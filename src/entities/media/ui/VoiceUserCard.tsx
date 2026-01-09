import { Card, Stack, Text, Group, Box, Badge } from '@mantine/core';
import { IconCameraPlus } from '@tabler/icons-react';
import { AppData, Consumer } from 'mediasoup-client/lib/types';
import { useState } from 'react';

import { Buttons } from './Buttons';
import { CompatButtons } from './CompatButtons';
import { MicrophoneIndicator } from './MicrophoneIndicator';
import { StreamPreview } from './StreamPreview';
import { UserAvatar } from './UserAvatar';
import { UserInfo } from './UserInfo';
import { stylesVoiceUserCard } from './VoiceUserCard.style';

import { useStream } from '~/shared/lib/hooks';

interface VoiceUserCardProps {
  socketId: string;
  userName: string;
  userId?: string;
  isStreaming: boolean;
  onOpenStream: (socketId: string) => void;
  isCameraEnabled?: boolean; // Для будущей поддержки камеры
  onPreviewStream?: (socketId: string) => void;
  isSpeaking?: boolean; // Говорит ли пользователь
  isMuted?: boolean; // Выключен ли микрофон
  isPreviewActive?: boolean; // Активен ли предпросмотр
  consumers?: Consumer<AppData>[];
  userProducerIds?: string[];
  isCompact?: boolean;
}

export const VoiceUserCard = ({
  socketId,
  userName,
  userId,
  isStreaming,
  onOpenStream,
  isCameraEnabled = false,
  onPreviewStream,
  isSpeaking = false,
  isMuted = false,
  isPreviewActive = false,
  consumers = [],
  userProducerIds = [],
  isCompact = false,
}: VoiceUserCardProps) => {
  const [hovered, setHovered] = useState(false);

  const { videoRef } = useStream({
    isStreaming: isStreaming && isPreviewActive,
    isPreviewActive,
    consumers,
    userProducerIds,
  });

  const handlePreviewToggle = () => {
    if (onPreviewStream) {
      onPreviewStream(socketId);
    }
  };

  return (
    <Card
      shadow="md"
      padding="0"
      radius="lg"
      withBorder
      style={stylesVoiceUserCard.card(isSpeaking)}
      onMouseEnter={(e) => {
        if (!isSpeaking) {
          e.currentTarget.style.borderColor = 'rgba(88, 166, 255, 0.5)';
          e.currentTarget.style.boxShadow =
            '0 8px 24px rgba(88, 166, 255, 0.2)';
        }

        if (isCompact) {
          setHovered(true);
        }
      }}
      onMouseLeave={(e) => {
        if (!isSpeaking) {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        }

        if (isCompact) {
          setHovered(false);
        }
      }}
    >
      <Box style={stylesVoiceUserCard.previewContainer(isCompact)}>
        {isMuted && <MicrophoneIndicator />}
        {isCameraEnabled ? (
          <Box
            style={{
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(45deg, rgba(88, 166, 255, 0.1) 0%, rgba(140, 100, 255, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Stack align="center" gap="xs">
              <IconCameraPlus
                size={32}
                style={{ color: 'rgba(88, 166, 255, 0.6)' }}
              />
              <Text size="sm" c="dimmed">
                Камера включена
              </Text>
            </Stack>
            <Badge
              size="sm"
              variant="light"
              color="green"
              style={stylesVoiceUserCard.badge()}
            >
              LIVE
            </Badge>
          </Box>
        ) : isStreaming && isPreviewActive ? (
          <StreamPreview videoRef={videoRef} />
        ) : (
          <UserAvatar userName={userName} userId={userId!} />
        )}
        {isCompact && isStreaming && (
          <CompatButtons
            hovered={hovered}
            isPreviewActive={isPreviewActive}
            onPreviewToggle={handlePreviewToggle}
            onOpenStream={() => onOpenStream(socketId)}
          />
        )}
      </Box>
      {!isCompact && (
        <Box p="md">
          <Stack gap="sm">
            <UserInfo
              isSpeaking={isSpeaking}
              userName={userName}
              isStreaming={isStreaming}
            />
            <Group gap="xs" grow>
              {isStreaming && (
                <Buttons
                  isPreviewActive={isPreviewActive}
                  onPreviewToggle={handlePreviewToggle}
                  onOpenStream={() => onOpenStream(socketId)}
                />
              )}
              {!isStreaming && (
                <Text
                  size="xs"
                  c="dimmed"
                  ta="center"
                  style={{ padding: '8px 0' }}
                >
                  Стрим не активен
                </Text>
              )}
            </Group>
          </Stack>
        </Box>
      )}
    </Card>
  );
};
