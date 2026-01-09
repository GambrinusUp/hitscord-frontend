import { MantineStyleProp, Tooltip, Box } from '@mantine/core';
import { IconMicrophoneOff } from '@tabler/icons-react';

const stylesMicrophoneIndicator = {
  box: (): MantineStyleProp => ({
    position: 'absolute',
    top: 8,
    left: 8,
    background: 'rgba(239, 68, 68, 0.2)',
    border: '1px solid rgba(239, 68, 68, 0.5)',
    borderRadius: '6px',
    padding: '6px 8px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    zIndex: 10,
  }),
};

export const MicrophoneIndicator = () => {
  return (
    <Tooltip label="Микрофон выключен" position="top-end">
      <Box style={stylesMicrophoneIndicator.box()}>
        <IconMicrophoneOff
          size={16}
          style={{ color: 'rgba(239, 68, 68, 0.8)' }}
        />
      </Box>
    </Tooltip>
  );
};
