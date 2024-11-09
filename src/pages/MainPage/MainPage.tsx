import Chat from '../../components/Chat/Chat';
import MessageMenuItem from '../../components/MessageMenuItem/MessageMenuItem';
import Panel from '../../components/Panel/Panel';
import TextChannels from '../../components/TextChannels/TextChannels';
import VoiceChannels from '../../components/VoiceChannels/VoiceChannels';
import { useAppSelector } from '../../hooks/redux';
import { useMediasoupConnection } from '../../hooks/useMediasoupConnection';
import styles from '../MainPage/MainPage.module.scss';

function MainPage() {
  //const roomName = '11';
  const { roomName, userName } = useAppSelector((state) => state.userStore);
  const {
    connect,
    disconnect,
    startScreenSharing,
    stopScreenSharing,
    consumers,
    connected,
    users,
  } = useMediasoupConnection(roomName, userName);

  return (
    <>
      <div className={styles.mainContainer}>
        <nav className={styles.navigationBar}>
          <MessageMenuItem />
        </nav>
        <div className={styles.contentContainer}>
          <div className={styles.sideBar}>
            <div className={styles.serverInfo}>Сервер №1</div>
            <TextChannels />
            <VoiceChannels
              connect={connect}
              consumers={consumers}
              users={users}
            />
            <Panel
              isConnected={connected}
              startScreenSharing={startScreenSharing}
              stopScreenSharing={stopScreenSharing}
              onDisconnect={disconnect}
            />
          </div>
          <div className={styles.chatContainer}>
            <div className={styles.subtitleContainer}>subtitleContainer</div>
            <div className={styles.chatContentContainer}>
              <Chat />
              <div className={styles.chatSideBar}>chatSideBar</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainPage;
