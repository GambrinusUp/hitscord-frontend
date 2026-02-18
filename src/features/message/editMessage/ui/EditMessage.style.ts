import { MantineStyleProp } from '@mantine/core';
import { CSSProperties } from 'react';

export const editMessageStyles = {
  container: (isFocused: boolean): MantineStyleProp => ({
    padding: '10px',
    backgroundColor: 'var(--color-surface-3)',
    borderRadius: '12px',
    border: isFocused
      ? '1px solid var(--color-primary)'
      : '1px solid var(--border-primary-soft)',
    boxShadow: isFocused
      ? '0 0 0 3px var(--color-primary-10), 0 10px 22px rgba(0, 0, 0, 0.25)'
      : '0 6px 16px rgba(0, 0, 0, 0.18)',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  }),

  header: (): MantineStyleProp => ({
    marginBottom: 6,
    userSelect: 'none',
  }),

  textareaRoot: (): CSSProperties => ({
    marginBottom: '8px',
    width: '100%',
    flexGrow: 1,
  }),

  textareaInput: (isFocused: boolean): CSSProperties => ({
    boxSizing: 'border-box',
    backgroundColor: 'var(--color-white-05)',
    color: 'var(--color-white)',
    border: `1px solid ${
      isFocused ? 'var(--color-primary)' : 'var(--border-primary-soft)'
    }`,
    boxShadow: isFocused ? '0 0 0 3px var(--color-primary-10)' : 'none',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '14px',
    lineHeight: '1.5',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  }),

  buttonGroup: (): MantineStyleProp => ({
    gap: '8px',
  }),

  actionIcon: (): MantineStyleProp => ({
    transition: 'transform 0.12s ease, box-shadow 0.12s ease',
  }),
};
