import { Box, Button, CSSProperties, MantineStyleProp } from '@mantine/core';
import { X } from 'lucide-react';

import { useMediaContext } from '~/context';

const stylesStream = {
  container: (): MantineStyleProp => ({
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '8px',
    marginBottom: '10px',
  }),
  video: (): CSSProperties => ({
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    backgroundColor: '#000',
  }),
  button: (): MantineStyleProp => ({
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 10,
  }),
};

interface StreamProps {
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
}

export const Stream = ({ videoRef }: StreamProps) => {
  const { setSelectedUserId } = useMediaContext();

  const handleCloseStream = () => {
    setSelectedUserId(null);

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <Box style={stylesStream.container()}>
      <video ref={videoRef} autoPlay playsInline style={stylesStream.video()} />
      <Button
        variant="filled"
        color="red"
        onClick={handleCloseStream}
        style={stylesStream.button()}
      >
        <X size={20} /> Закрыть
      </Button>
    </Box>
  );
};
