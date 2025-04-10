import { useEffect, useRef, useState } from 'react';

import { AudioContext } from './AudioContext';

import { useMediaContext } from '~/context/MediaContext';

export const AudioProvider = (props: React.PropsWithChildren) => {
  const { consumers } = useMediaContext();
  const audioRefs = useRef(new Map());
  const [userVolumes, setUserVolumes] = useState<Record<string, number>>({});

  useEffect(() => {
    consumers.forEach(({ producerId, track, kind }) => {
      if (kind === 'audio' && !audioRefs.current.has(producerId)) {
        const audio = document.createElement('audio');
        audio.srcObject = new MediaStream([track]);
        audio.autoplay = true;
        audio.volume = userVolumes[producerId] ?? 1;
        audioRefs.current.set(producerId, audio);
        document.body.appendChild(audio);
      }
    });

    const activeProducers = consumers.map((c) => c.producerId);
    audioRefs.current.forEach((audio, producerId) => {
      if (!activeProducers.includes(producerId)) {
        audio.pause();
        audio.remove();
        audioRefs.current.delete(producerId);
      }
    });

    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.remove();
      });
      audioRefs.current.clear();
    };
  }, [consumers, userVolumes]);

  const setVolume = (producerId: string, volume: number) => {
    setUserVolumes((prev) => ({ ...prev, [producerId]: volume / 100 }));
  };

  return (
    <AudioContext.Provider
      value={{
        setVolume,
        userVolumes,
      }}
    >
      {props.children}
    </AudioContext.Provider>
  );
};
