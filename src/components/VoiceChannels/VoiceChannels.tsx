/* eslint-disable @typescript-eslint/no-explicit-any */
import { Collapse, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChevronDown, ChevronRight, User, Video, Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import styles from './VoiceChannels.module.scss';

interface VoiceChannelsProps {
  connect: () => void;
  consumers: any[];
  users: { socketId: string; producerId: string; userName: string }[];
}

function VoiceChannels({ connect, consumers, users }: VoiceChannelsProps) {
  const [opened, { toggle }] = useDisclosure(true);
  const [selectedStream, setSelectedStream] = useState<MediaStream | null>(
    null
  );
  const [isModalOpen, setModalOpen] = useState(false);

  const userGroups = users.reduce((acc, user) => {
    if (!acc[user.socketId]) {
      acc[user.socketId] = { userName: user.userName, producerIds: [] };
    }
    acc[user.socketId].producerIds.push(user.producerId);
    return acc;
  }, {} as Record<string, { userName: string; producerIds: string[] }>);

  useEffect(() => {
    console.log(users);
  }, [users]);

  const handleUserClick = (socketId: string) => {
    const isStreaming = userGroups[socketId].producerIds.length > 1;

    if (isStreaming) {
      const videoConsumer = consumers.find(
        (consumer) =>
          consumer.kind === 'video' &&
          userGroups[socketId].producerIds.includes(consumer.producerId)
      );

      if (videoConsumer) {
        const stream = new MediaStream([videoConsumer.track]);
        setSelectedStream(stream);
        setModalOpen(true);
      }
    }
  };

  return (
    <>
      <div
        className={`${styles.menuItem} ${styles.channelHeader}`}
        onClick={toggle}
      >
        {opened ? <ChevronDown /> : <ChevronRight />}
        <span>Голосовые каналы</span>
      </div>
      <Collapse in={opened} style={{ padding: 5 }}>
        <div
          className={styles.channelItem}
          onClick={connect}
          id={'connectToServer'}
        >
          <Volume2 />
          <span>Голосовой канал 1</span>
        </div>
        <div className={styles.userList}>
          {Object.entries(userGroups).map(([socketId, { producerIds }]) => (
            <div
              key={socketId}
              className={styles.userItem}
              onClick={() => handleUserClick(socketId)}
            >
              <User />
              <span>{socketId}</span>
              {producerIds.length > 1 && (
                <Video className={styles.streamingIcon} />
              )}
            </div>
          ))}
        </div>
      </Collapse>
      {consumers.map(
        (consumer, index) =>
          consumer.kind === 'audio' && (
            <audio
              key={index}
              autoPlay
              ref={(el) => {
                if (el) el.srcObject = new MediaStream([consumer.track]);
              }}
            />
          )
      )}
      {/*consumers.map((consumer, index) =>
        consumer.kind === 'video' ? (
          <video
            key={index}
            autoPlay
            playsInline
            ref={(el) => {
              if (el) el.srcObject = new MediaStream([consumer.track]);
            }}
          />
        ) : (
          <audio
            key={index}
            autoPlay
            ref={(el) => {
              if (el) el.srcObject = new MediaStream([consumer.track]);
            }}
          />
        )
      )*/}
      <Modal
        opened={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedStream(null);
        }}
        title="Просмотр стрима"
        centered
        size="auto"
        style={{ width: '100%' }}
      >
        {selectedStream && (
          <video
            style={{ width: '100%', height: 'auto', maxHeight: '700px' }}
            autoPlay
            ref={(el) => {
              if (el) el.srcObject = selectedStream;
            }}
          />
        )}
      </Modal>
    </>
  );
}

export default VoiceChannels;
