import { Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChevronDown, ChevronRight, Hash } from 'lucide-react';

import styles from './TextChannels.module.scss';

function TextChannels() {
  const [opened, { toggle }] = useDisclosure(true);

  return (
    <>
      <div
        className={`${styles.menuItem} ${styles.channelHeader}`}
        onClick={toggle}
      >
        {opened ? <ChevronDown /> : <ChevronRight />}
        <span>Текстовые каналы</span>
      </div>
      <Collapse in={opened} style={{ padding: 5 }}>
        <div className={styles.channelItem}>
          <Hash />
          <span>Текстовый канал 1</span>
        </div>
      </Collapse>
    </>
  );
}

export default TextChannels;
