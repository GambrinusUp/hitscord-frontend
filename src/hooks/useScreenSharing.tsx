import { useRef } from 'react';

import socket from '../api/socket';
import { useMediaContext } from '../context/MediaContext/useMediaContext';

export const useScreenSharing = () => {
  const { videoProducer, setVideoProducer, producerTransport, setIsStreaming } =
    useMediaContext();
  const producerIdRef = useRef<string | null>(null);

  const startScreenSharing = async () => {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    const screenTrack = screenStream.getVideoTracks()[0];

    const producer = await producerTransport!.produce({
      track: screenTrack,
    });

    setVideoProducer(producer);
    producerIdRef.current = producer.id;

    producer.on('trackended', stopScreenSharing);
    setIsStreaming(true);
  };

  const stopScreenSharing = async () => {
    if (videoProducer) {
      videoProducer.close();
      socket.emit('stopProducer', { producerId: videoProducer!.id });
    } else {
      socket.emit('stopProducer', { producerId: producerIdRef.current });
    }
    producerIdRef.current = null;
    setVideoProducer(null);
    setIsStreaming(false);
  };

  return { startScreenSharing, stopScreenSharing };
};
