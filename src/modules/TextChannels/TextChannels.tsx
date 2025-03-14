import { ActionIcon, Button, Collapse, Group, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import CreateChannelModal from '../../components/CreateChannelModal/CreateChannelModal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setUserStreamView } from '../../store/app/AppSettingsSlice';
import { setCurrentChannelId } from '../../store/server/TestServerSlice';
import { ChannelType, EditModal } from '../../utils/types';
import { ChannelItem } from './components/ChannelItem';

interface TextChannelsProps {
  onClose: () => void;
}

function TextChannels({ onClose }: TextChannelsProps) {
  const dispatch = useAppDispatch();
  const [opened, { toggle }] = useDisclosure(true);
  const [
    channelModalOpened,
    { open: openChannelModal, close: closeChannelModal },
  ] = useDisclosure(false);
  const [isEditing, setIsEditing] = useState<EditModal>({
    isEdit: false,
    initialData: '',
    channelId: '',
  });
  const { serverData, currentServerId, currentChannelId } = useAppSelector(
    (state) => state.testServerStore
  );
  const isAdmin = serverData.userRole === 'Admin' ? true : false;

  const handleOpenChannel = (channelId: string) => {
    dispatch(setCurrentChannelId(channelId));
    dispatch(setUserStreamView(false));
    onClose();
  };

  const handleEditChannel = (channelName: string, channelId: string) => {
    setIsEditing({
      isEdit: true,
      initialData: channelName,
      channelId: channelId,
    });
    openChannelModal();
  };

  useEffect(() => {
    console.log(currentChannelId);
  }, [currentChannelId]);

  return (
    <>
      <Stack align="flex-start" gap="xs">
        <Group justify="space-between" w="100%" wrap="nowrap">
          <Button
            leftSection={opened ? <ChevronDown /> : <ChevronRight />}
            variant="transparent"
            onClick={toggle}
            p={0}
            color="#fffff"
            styles={{
              root: {
                '--button-hover-color': '#4f4f4f',
                transition: 'color 0.3s ease',
              },
            }}
          >
            Текстовые каналы
          </Button>
          {isAdmin && (
            <ActionIcon
              variant="transparent"
              onClick={() => {
                setIsEditing({ isEdit: false, initialData: '', channelId: '' });
                openChannelModal();
              }}
            >
              <Plus color="#ffffff" />
            </ActionIcon>
          )}
        </Group>
        <Collapse in={opened} w="100%">
          <Stack gap="xs">
            {serverData.channels.textChannels.map(
              ({ channelId, channelName }) => (
                <ChannelItem
                  channelId={channelId}
                  currentChannelId={currentChannelId}
                  channelName={channelName}
                  isAdmin={isAdmin}
                  handleOpenChannel={() => handleOpenChannel(channelId)}
                  handleEditChannel={() =>
                    handleEditChannel(channelName, channelId)
                  }
                />
              )
            )}
          </Stack>
        </Collapse>
      </Stack>
      {currentServerId && (
        <CreateChannelModal
          opened={channelModalOpened}
          onClose={closeChannelModal}
          isEdit={isEditing}
          serverId={currentServerId}
          channelType={ChannelType.TEXT_CHANNEL}
        />
      )}
    </>
  );
}

export default TextChannels;
