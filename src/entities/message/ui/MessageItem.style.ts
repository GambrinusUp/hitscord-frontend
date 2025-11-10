import { MantineStyleProp } from '@mantine/core';

export const messageItemStyles = {
  box: (isOwnMessage: boolean, isEditing: boolean): MantineStyleProp => ({
    position: 'relative',
    backgroundColor: isOwnMessage ? '#4A90E2' : '#454950',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '10px',
    maxWidth: '75%',
    display: 'flex',
    flexDirection: 'column',
    width: isEditing ? '100%' : 'auto',
  }),

  breakText: (): MantineStyleProp => ({
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  }),

  meta: (isOwnMessage: boolean): MantineStyleProp => ({
    marginTop: 4,
    fontSize: 12,
    color: isOwnMessage ? '#D1D5DB' : '#9CA3AF',
    alignSelf: 'flex-start',
  }),
};
