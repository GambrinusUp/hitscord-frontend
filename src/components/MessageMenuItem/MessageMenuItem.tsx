import { MessageCircle } from 'lucide-react';

import styles from './MessageMenuItem.module.scss';

function MessageMenuItem() {
  return (
    <div className={styles.item}>
      <MessageCircle size={30} />
    </div>
  );
}

export default MessageMenuItem;
