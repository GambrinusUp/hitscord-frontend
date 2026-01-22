import { Badge, Box } from '@mantine/core';
import { memo, useEffect } from 'react';

import { stylesStreamPreview } from './StreamPreview.style';

interface CameraPreviewProps {
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  cameraStreamRef?: React.MutableRefObject<MediaStream | null>;
}

export const CameraPreview = memo(
  ({ videoRef, cameraStreamRef }: CameraPreviewProps) => {
    useEffect(() => {
      if (!videoRef?.current) return;

      if (cameraStreamRef?.current) {
        videoRef.current.srcObject = cameraStreamRef.current;
        videoRef.current
          .play()
          .catch((err) =>
            console.error('Ошибка воспроизведения потока с камеры:', err),
          );
      }
    }, [videoRef, cameraStreamRef]);

    return (
      <Box style={stylesStreamPreview.container()}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={stylesStreamPreview.video()}
        />
        <Badge
          size="sm"
          variant="light"
          color="green"
          style={stylesStreamPreview.badge()}
        >
          LIVE
        </Badge>
      </Box>
    );
  },
);

CameraPreview.displayName = 'CameraPreview';
