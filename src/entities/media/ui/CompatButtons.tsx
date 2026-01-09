import { ActionIcon, Group, MantineStyleProp, Tooltip } from '@mantine/core';
import { IconEye, IconPlayerPlay } from '@tabler/icons-react';

const stylesCompatButtons = {
  container: (hovered: boolean): MantineStyleProp => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '6px',
    opacity: hovered ? 1 : 0,
    transition: 'opacity 0.2s ease',
  }),
};

interface CompatButtonsProps {
  hovered: boolean;
  isPreviewActive: boolean;
  onPreviewToggle: () => void;
  onOpenStream: () => void;
}

export const CompatButtons = ({
  hovered,
  isPreviewActive,
  onPreviewToggle,
  onOpenStream,
}: CompatButtonsProps) => {
  return (
    <Group
      gap="xs"
      style={stylesCompatButtons.container(hovered)}
      className="card-buttons"
    >
      <Tooltip
        label={isPreviewActive ? 'Скрыть превью' : 'Показать превью'}
        position="top"
      >
        <ActionIcon
          variant={isPreviewActive ? 'filled' : 'light'}
          color={isPreviewActive ? 'blue' : 'gray'}
          size="md"
          onClick={onPreviewToggle}
          style={{ flex: 1 }}
        >
          <IconEye size={14} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Открыть стрим" position="top">
        <ActionIcon
          variant="filled"
          color="blue"
          size="md"
          onClick={onOpenStream}
          style={{ flex: 1 }}
        >
          <IconPlayerPlay size={14} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};
