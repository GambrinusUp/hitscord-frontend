import { Paperclip, Send } from 'lucide-react';

import styles from './Chat.module.scss';

function Chat() {
  return (
    <div className={styles.chatContent}>
      <div className={styles.chat}>
        <div className={styles.message}>Сообщение 1</div>
        <div className={styles.message}>Сообщение 2</div>
        <div className={styles.message}>Сообщение 3</div>
      </div>
      <div className={styles.bottomContainer}>
        <button className={styles.attachButton}>
          <Paperclip size={20} />
        </button>
        <input
          type="text"
          placeholder="Написать сообщение..."
          className={styles.input}
        />
        <button className={styles.sendButton}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

export default Chat;
