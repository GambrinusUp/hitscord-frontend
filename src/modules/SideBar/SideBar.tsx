import {
  Divider,
  Group,
  Menu,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  ChevronDown,
  Copy,
  DoorOpen,
  Settings,
  UserPen,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ChangeNameModal } from './components/ChangeNameModal';
import { Panel } from './components/Panel';
import { RolesModal } from './components/RolesModal';
import { ServerSettingsModal } from './components/ServerSettingsModal';
import { UnsubscribeModal } from './components/UnsubscribeModal';
import { SideBarProps } from './SideBarProps.types';

import { useAppDispatch, useAppSelector, useDisconnect } from '~/hooks';
import { TextChannels } from '~/modules/TextChannels';
import { VoiceChannels } from '~/modules/VoiceChannels';
import {
  setOpenHome,
  setUserStreamView,
} from '~/store/AppStore/AppStore.reducer';
import {
  getUserServers,
  unsubscribeFromServer,
} from '~/store/ServerStore/ServerStore.actions';
import {
  clearServerData,
  setCurrentVoiceChannelId,
} from '~/store/ServerStore/ServerStore.reducer';

export const SideBar = ({ onClose }: SideBarProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const disconnect = useDisconnect();
  const [opened, { open, close }] = useDisclosure(false);
  const [
    changeNameModalOpened,
    { open: openChangeNameModalOpened, close: closeChangeNameModalOpened },
  ] = useDisclosure(false);
  const [
    unsubscribeModalOpened,
    { open: openUnsubscribeModal, close: closeUnsubscribeModal },
  ] = useDisclosure(false);
  const [rolesModalOpened, { open: openRolesModal, close: closeRolesModal }] =
    useDisclosure(false);
  const { serverData, isLoading, currentVoiceChannelId } = useAppSelector(
    (state) => state.testServerStore,
  );
  const { accessToken } = useAppSelector((state) => state.userStore);
  const canChangeRole = serverData.permissions.canChangeRole;
  const isCreator = serverData.isCreator;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleUnsubscribe = async () => {
    disconnect(accessToken, currentVoiceChannelId!);
    dispatch(setUserStreamView(false));
    dispatch(setCurrentVoiceChannelId(null));

    const result = await dispatch(
      unsubscribeFromServer({ accessToken, serverId: serverData.serverId }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(getUserServers({ accessToken }));
      dispatch(setOpenHome(true));
      dispatch(clearServerData());
      navigate('/main');
    }
  };

  return (
    <>
      <Stack
        gap="xs"
        bg="#1A1B1E"
        p={10}
        //w={{ base: 150, lg: 250 }}
        w={250}
        h="100%"
        visibleFrom="sm"
      >
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Group justify="space-between" style={{ cursor: 'pointer' }}>
              {isLoading ? (
                <Skeleton height={10} width="40%" radius="md" />
              ) : (
                <Text>{serverData.serverName}</Text>
              )}
              <ChevronDown />
            </Group>
          </Menu.Target>
          <Menu.Dropdown>
            {(canChangeRole || isCreator) && (
              <Menu.Item leftSection={<Settings size={16} />} onClick={open}>
                Настройки сервера
              </Menu.Item>
            )}
            {canChangeRole && (
              <Menu.Item
                onClick={() => openRolesModal()}
                leftSection={<Users size={16} />}
              >
                Настройки ролей
              </Menu.Item>
            )}
            <Menu.Item
              onClick={openChangeNameModalOpened}
              leftSection={<UserPen size={16} />}
            >
              Изменить имя на сервере
            </Menu.Item>
            <Menu.Item
              onClick={() => copyToClipboard(serverData.serverId)}
              leftSection={<Copy size={16} />}
            >
              Копировать ID сервера
            </Menu.Item>
            {!isCreator && (
              <Menu.Item
                onClick={handleUnsubscribe}
                leftSection={<DoorOpen size={16} />}
              >
                Отписаться от сервера
              </Menu.Item>
            )}
            {isCreator && (
              <Menu.Item
                onClick={() => openUnsubscribeModal()}
                leftSection={<DoorOpen size={16} />}
              >
                Отписаться от сервера
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
        <Divider />
        <ScrollArea.Autosize mah="100%" maw="100%" scrollbarSize={0}>
          <TextChannels onClose={onClose} />
          <VoiceChannels />
        </ScrollArea.Autosize>
        <Panel />
      </Stack>
      <ServerSettingsModal opened={opened} onClose={close} />
      <ChangeNameModal
        opened={changeNameModalOpened}
        onClose={closeChangeNameModalOpened}
      />
      <UnsubscribeModal
        opened={unsubscribeModalOpened}
        onClose={closeUnsubscribeModal}
      />
      <RolesModal opened={rolesModalOpened} onClose={closeRolesModal} />
    </>
  );
};
