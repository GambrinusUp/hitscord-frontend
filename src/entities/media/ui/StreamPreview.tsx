import { Badge, Box, CSSProperties, MantineStyleProp } from '@mantine/core';

const stylesStreamPreview = {
  container: (): MantineStyleProp => ({
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  }),
  video: (): CSSProperties => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }),
  badge: (): MantineStyleProp => ({
    position: 'absolute',
    top: 8,
    right: 8,
  }),
};

interface StreamPreviewProps {
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
}

export const StreamPreview = ({ videoRef }: StreamPreviewProps) => {
  return (
    <Box style={stylesStreamPreview.container()}>
      <video
        ref={videoRef}
        autoPlay
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
};
