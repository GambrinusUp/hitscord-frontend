import { ActionIcon, Box, Button, Collapse, Group, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChevronDown, ChevronRight, Hash, Plus, Settings } from 'lucide-react';
import { useState } from 'react';

import CreateChannelModal from '../../components/CreateChannelModal/CreateChannelModal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setUserStreamView } from '../../store/app/AppSettingsSlice';
import { setCurrentChannel } from '../../store/server/ServerSlice';
import { ChannelType, EditModal } from '../../utils/types';
import { styles } from './TextChannels.const';

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
  const [isHovered, setIsHovered] = useState('');
  const [isEditing, setIsEditing] = useState<EditModal>({
    isEdit: false,
    initialData: '',
    channelId: '',
  });
  const { serverData, currentServerId, currentChannelId } = useAppSelector(
    (state) => state.testServerStore
  );
  const isAdmin = serverData.userRole === 'Admin' ? true : false;

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
                <Box
                  key={channelId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onMouseEnter={() => setIsHovered(channelId)}
                  onMouseLeave={() => setIsHovered('')}
                >
                  <Button
                    leftSection={<Hash />}
                    variant="subtle"
                    p={0}
                    color="#ffffff"
                    justify="flex-start"
                    styles={{
                      root: styles.buttonRoot(
                        isHovered === channelId,
                        currentChannelId === channelId
                      ),
                    }}
                    fullWidth
                    onClick={() => {
                      dispatch(setCurrentChannel(channelId));
                      dispatch(setUserStreamView(false));
                      onClose();
                    }}
                  >
                    {channelName}
                  </Button>
                  {isAdmin && isHovered === channelId && (
                    <Button
                      variant="subtle"
                      p={0}
                      color="#ffffff"
                      justify="flex-start"
                      w="20px"
                      styles={{
                        root: styles.buttonSettings(
                          currentChannelId === channelId
                        ),
                      }}
                      onClick={() => {
                        setIsEditing({
                          isEdit: true,
                          initialData: channelName,
                          channelId: channelId,
                        });
                        openChannelModal();
                      }}
                    >
                      <Settings size={16} />
                    </Button>
                  )}
                </Box>
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
