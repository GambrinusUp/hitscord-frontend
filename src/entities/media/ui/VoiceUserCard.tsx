import { Card, Stack, Text, Group, Box } from '@mantine/core';
import { AppData, Consumer } from 'mediasoup-client/lib/types';
import { useState, useMemo, memo } from 'react';

import { Buttons } from './Buttons';
import { CameraPreview } from './CameraPreview';
import { CompatButtons } from './CompatButtons';
import { MicrophoneIndicator } from './MicrophoneIndicator';
import { StreamPreview } from './StreamPreview';
import { UserAvatar } from './UserAvatar';
import { UserInfo } from './UserInfo';
import { stylesVoiceUserCard } from './VoiceUserCard.style';

import { useStream, useCamera } from '~/shared/lib/hooks';

interface VoiceUserCardProps {
  socketId: string;
  userName: string;
  userId?: string;
  isStreaming: boolean;
  onOpenStream: (socketId: string) => void;
  isCameraEnabled?: boolean;
  onPreviewStream?: (socketId: string) => void;
  isSpeaking?: boolean;
  isMuted?: boolean;
  isPreviewActive?: boolean;
  consumers?: Consumer<AppData>[];
  userProducerIds?: string[];
  isCompact?: boolean;
}

const VoiceUserCardComponent = ({
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
    isStreaming,
    isPreviewActive,
    consumers,
    userProducerIds,
  });

  const { videoRef: cameraVideoRef, cameraStreamRef } = useCamera({
    consumers,
    userProducerIds,
  });

  const handlePreviewToggle = () => {
    if (onPreviewStream) {
      onPreviewStream(socketId);
    }
  };

  const mediaContent = useMemo(() => {
    if (isStreaming && isPreviewActive) {
      return <StreamPreview key="stream" videoRef={videoRef} />;
    }

    if (isCameraEnabled && !isPreviewActive) {
      return (
        <Box key="camera" style={stylesVoiceUserCard.video()}>
          <CameraPreview
            videoRef={cameraVideoRef}
            cameraStreamRef={cameraStreamRef}
          />
        </Box>
      );
    }

    return <UserAvatar key="avatar" userName={userName} userId={userId!} />;
  }, [isCameraEnabled, isStreaming, isPreviewActive, userName, userId]);

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
        {mediaContent}
        {isCompact && isStreaming && !isCameraEnabled && (
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

const areEqual = (
  prevProps: VoiceUserCardProps,
  nextProps: VoiceUserCardProps,
) => {
  const mediaPropsEqual =
    prevProps.isCameraEnabled === nextProps.isCameraEnabled &&
    prevProps.isStreaming === nextProps.isStreaming &&
    prevProps.isPreviewActive === nextProps.isPreviewActive &&
    prevProps.userName === nextProps.userName &&
    prevProps.userId === nextProps.userId &&
    prevProps.socketId === nextProps.socketId &&
    prevProps.isCompact === nextProps.isCompact;

  const prevConsumers = prevProps.consumers ?? [];
  const nextConsumers = nextProps.consumers ?? [];
  const consumersEqual =
    prevConsumers.length === nextConsumers.length &&
    prevConsumers.every(
      (consumer, index) =>
        consumer.id === nextConsumers[index]?.id &&
        consumer.producerId === nextConsumers[index]?.producerId,
    );

  const prevProducerIds = prevProps.userProducerIds ?? [];
  const nextProducerIds = nextProps.userProducerIds ?? [];
  const producerIdsEqual =
    prevProducerIds.length === nextProducerIds.length &&
    prevProducerIds.every((id, index) => id === nextProducerIds[index]);

  if (!mediaPropsEqual || !consumersEqual || !producerIdsEqual) {
    return false;
  }

  return (
    prevProps.isMuted === nextProps.isMuted &&
    prevProps.isSpeaking === nextProps.isSpeaking &&
    prevProps.onOpenStream === nextProps.onOpenStream &&
    prevProps.onPreviewStream === nextProps.onPreviewStream
  );
};

export const VoiceUserCard = memo(VoiceUserCardComponent, areEqual);
VoiceUserCard.displayName = 'VoiceUserCard';
