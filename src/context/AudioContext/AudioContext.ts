import { createContext } from 'react';

export const AudioContext = createContext<
  | {
      setVolume: (producerId: string, volume: number) => void;
      userVolumes: Record<string, number>;
    }
  | undefined
>(undefined);
