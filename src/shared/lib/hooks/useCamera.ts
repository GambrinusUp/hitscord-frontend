import { AppData, Consumer } from 'mediasoup-client/lib/types';
import { useEffect, useRef } from 'react';

interface UseCameraParams {
  consumers: Consumer<AppData>[];
  userProducerIds: string[];
}

export const useCamera = ({ consumers, userProducerIds }: UseCameraParams) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const previousTracksRef = useRef<string>('');

  useEffect(() => {
    if (consumers.length === 0 || userProducerIds.length === 0) {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      previousTracksRef.current = '';

      return;
    }

    const cameraVideoConsumer = consumers.find(
      (consumer) =>
        consumer.kind === 'video' &&
        consumer.appData?.source === 'camera' &&
        userProducerIds.includes(consumer.producerId),
    );

    if (
      !cameraVideoConsumer?.track ||
      cameraVideoConsumer.track.readyState === 'ended'
    ) {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      previousTracksRef.current = '';

      return;
    }

    const tracks: MediaStreamTrack[] = [];

    if (cameraVideoConsumer?.track) tracks.push(cameraVideoConsumer.track);

    if (tracks.length > 0) {
      const tracksKey = tracks.map((t) => t.id).join(',');

      if (previousTracksRef.current !== tracksKey) {
        previousTracksRef.current = tracksKey;

        const newStream = new MediaStream(tracks);
        cameraStreamRef.current = newStream;

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          videoRef.current
            .play()
            .catch((err) =>
              console.error('Ошибка воспроизведения потока с камеры:', err),
            );
        }
      }
    } else {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      previousTracksRef.current = '';
    }
  }, [consumers, userProducerIds]);

  return { videoRef, cameraStreamRef };
};
