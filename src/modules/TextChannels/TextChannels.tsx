import { ActionIcon, Box, Button, Collapse, Group, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChevronDown, ChevronRight, Hash, Plus, Settings } from 'lucide-react';
import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setUserStreamView } from '../../store/app/AppSettingsSlice';
import { setCurrentChannel } from '../../store/server/ServerSlice';
import { EditModal } from '../../utils/types';
import CreateChannelModal from './components/CreateChannelModal/CreateChannelModal';

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
  const { servers, currentServerId, currentChannelId } = useAppSelector(
    (state) => state.serverStore
  );
  const [isHovered, setIsHovered] = useState('');
  const [isEditing, setIsEditing] = useState<EditModal>({
    isEdit: false,
    initialData: '',
    channelId: '',
  });
  const { serverData } = useAppSelector((state) => state.testServerStore);
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
            {Object.entries(servers['channel1'].textChannels).map(
              ([channelId, channel]) => (
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
                      root: {
                        backgroundColor:
                          currentChannelId === channelId
                            ? '#999999'
                            : 'transparent',
                        '--button-hover-color': '#4f4f4f',
                        transition: 'color 0.3s ease',
                        borderTopRightRadius:
                          isHovered === channelId
                            ? 0
                            : 'var(--mantine-radius-default)',
                        borderBottomRightRadius:
                          isHovered === channelId
                            ? 0
                            : 'var(--mantine-radius-default)',
                      },
                    }}
                    fullWidth
                    onClick={() => {
                      dispatch(setCurrentChannel(channelId));
                      dispatch(setUserStreamView(false));
                      onClose();
                    }}
                  >
                    {channel.name}
                  </Button>
                  {isAdmin && isHovered === channelId && (
                    <Button
                      variant="subtle"
                      p={0}
                      color="#ffffff"
                      justify="flex-start"
                      w="20px"
                      styles={{
                        root: {
                          backgroundColor:
                            currentChannelId === channelId
                              ? '#999999'
                              : 'transparent',
                          '--button-hover-color': '#4f4f4f',
                          transition: 'color 0.3s ease',
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                        },
                      }}
                      onClick={() => {
                        setIsEditing({
                          isEdit: true,
                          initialData: channel.name,
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
        />
      )}
    </>
  );
}

export default TextChannels;
