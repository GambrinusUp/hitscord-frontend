import { Mic, MicOff, ScreenShare, StopCircle } from 'lucide-react';
import { useState } from 'react';

import { useAppSelector } from '../../hooks/redux';
import styles from './Panel.module.scss';

interface PanelProps {
  isConnected: boolean;
  startScreenSharing: () => Promise<void>;
  stopScreenSharing: () => Promise<void>;
  onDisconnect: () => void;
}

function Panel({
  isConnected,
  startScreenSharing,
  stopScreenSharing,
  onDisconnect,
}: PanelProps) {
  const { userName } = useAppSelector((state) => state.userStore);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => setIsMuted((value) => !value);

  const handleScreenShareClick = () => {
    if (isStreaming) {
      stopScreenSharing();
    } else {
      startScreenSharing();
    }
    setIsStreaming((prev) => !prev);
  };

  return (
    <>
      {isConnected && (
        <div className={styles.actionButtons}>
          <button
            className={styles.screenShareButton}
            onClick={handleScreenShareClick}
            id={'startSceenSharing'}
          >
            {isStreaming ? (
              <>
                <StopCircle size={20} /> Прекратить стриминг
              </>
            ) : (
              <>
                <ScreenShare size={20} /> Начать стриминг
              </>
            )}
          </button>
          <button className={styles.muteButton} onClick={toggleMute}>
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <button className={styles.disconnectButton} onClick={onDisconnect}>
            Отключиться
          </button>
        </div>
      )}
      <div className={styles.panel}>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{userName}</span>
        </div>
      </div>
    </>
  );
}

export default Panel;
