import { VOLUME_STORAGE_KEY } from '~/features/media/streamView/model/const';

export const getStoredVolume = (userId: string): number => {
  try {
    const stored = localStorage.getItem(VOLUME_STORAGE_KEY);

    if (stored) {
      const volumes = JSON.parse(stored);

      return volumes[userId] ?? 1;
    }
  } catch (error) {
    console.error('Error reading volume from localStorage:', error);
  }

  return 1;
};
