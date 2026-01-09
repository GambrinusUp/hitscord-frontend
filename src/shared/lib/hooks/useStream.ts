import { AppData, Consumer } from 'mediasoup-client/lib/types';
import { useEffect, useRef } from 'react';

interface UseStreamParams {
  isStreaming: boolean;
  consumers: Consumer<AppData>[];
  userProducerIds: string[];
  isPreviewActive?: boolean;
}

export const useStream = ({
  isStreaming,
  consumers,
  userProducerIds,
  isPreviewActive = true,
}: UseStreamParams) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isStreaming || consumers.length === 0) {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      return;
    }

    if (!isPreviewActive) {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      return;
    }

    const videoConsumer = consumers.find(
      (consumer) =>
        consumer.kind === 'video' &&
        userProducerIds.includes(consumer.producerId),
    );

    const audioConsumer = consumers.find(
      (consumer) =>
        consumer.kind === 'audio' &&
        consumer.appData?.source === 'screen-audio' &&
        userProducerIds.includes(consumer.producerId),
    );

    const tracks: MediaStreamTrack[] = [];

    if (videoConsumer?.track) tracks.push(videoConsumer.track);

    if (audioConsumer?.track) tracks.push(audioConsumer.track);

    if (tracks.length > 0) {
      const newStream = new MediaStream(tracks);
      previewStreamRef.current = newStream;

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current
          .play()
          .catch((err) => console.error('Ошибка воспроизведения потока:', err));
      }
    }
  }, [isStreaming, isPreviewActive, consumers, userProducerIds]);

  return { videoRef, previewStreamRef };
};
