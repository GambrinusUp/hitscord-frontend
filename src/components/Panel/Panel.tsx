import { ScreenShare, StopCircle } from 'lucide-react';
import { useState } from 'react';

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
  const [isStreaming, setIsStreaming] = useState(false);

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
          <button className={styles.disconnectButton} onClick={onDisconnect}>
            Отключиться
          </button>
        </div>
      )}
      <div className={styles.panel}>
        <div className={styles.userInfo}>
          <span className={styles.userName}>Пользователь</span>
        </div>
      </div>
    </>
  );
}

export default Panel;
