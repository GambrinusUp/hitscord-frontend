import { VOLUME_STORAGE_KEY } from '~/features/media/streamView/model/const';

export const saveVolumeToStorage = (userId: string, volume: number) => {
  try {
    const stored = localStorage.getItem(VOLUME_STORAGE_KEY);
    const volumes = stored ? JSON.parse(stored) : {};
    volumes[userId] = volume;
    localStorage.setItem(VOLUME_STORAGE_KEY, JSON.stringify(volumes));
  } catch (error) {
    console.error('Error saving volume to localStorage:', error);
  }
};
