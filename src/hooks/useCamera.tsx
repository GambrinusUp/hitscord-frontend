import { useRef } from 'react';

import { socket } from '~/api';
import { useMediaContext } from '~/context';

export const useCamera = () => {
  const {
    videoProducer,
    setVideoProducer,
    producerTransport,
    isStreaming,
    isCameraOn,
    setIsCameraOn,
  } = useMediaContext();
  const cameraProducerIdRef = useRef<string | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    if (!producerTransport) return;

    // Если идет стрим экрана, не позволяем включить камеру
    if (isStreaming) {
      console.warn('Нельзя включить камеру во время стрима экрана');

      return;
    }

    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      cameraStreamRef.current = cameraStream;
      const videoTrack = cameraStream.getVideoTracks()[0];

      // Проверяем, не используется ли videoProducer для стрима экрана
      if (!videoProducer || videoProducer.appData?.source !== 'screen-video') {
        // Если есть старый producer камеры, закрываем его
        if (videoProducer && videoProducer.appData?.source === 'camera') {
          const accessToken = localStorage.getItem('accessToken');
          videoProducer.close();
          socket.emit('stopProducer', {
            producerId: videoProducer.id,
            accessToken,
          });
        }

        const cameraProducer = await producerTransport.produce({
          track: videoTrack,
          appData: { source: 'camera' },
        });

        setVideoProducer(cameraProducer);
        cameraProducerIdRef.current = cameraProducer.id;
        setIsCameraOn(true);
        videoTrack.onended = stopCamera;
      }
    } catch (error) {
      console.error('Ошибка при включении камеры:', error);
    }
  };

  const stopCamera = async () => {
    const accessToken = localStorage.getItem('accessToken');

    // Останавливаем трек камеры
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }

    // Закрываем producer только если это камера (не стрим экрана)
    if (videoProducer && videoProducer.appData?.source === 'camera') {
      videoProducer.close();
      socket.emit('stopProducer', {
        producerId: videoProducer.id,
        accessToken,
      });
      setVideoProducer(null);
    } else if (cameraProducerIdRef.current) {
      socket.emit('stopProducer', {
        producerId: cameraProducerIdRef.current,
        accessToken,
      });
    }

    cameraProducerIdRef.current = null;
    setIsCameraOn(false);
  };

  const toggleCamera = async () => {
    const isCameraActive =
      isCameraOn ||
      videoProducer?.appData?.source === 'camera' ||
      (cameraStreamRef.current &&
        cameraStreamRef.current
          .getVideoTracks()
          .some((track) => track.readyState === 'live'));

    if (isCameraActive) {
      await stopCamera();
    } else {
      await startCamera();
    }
  };

  return { startCamera, stopCamera, toggleCamera };
};
