import { Consumer } from 'mediasoup-client/lib/Consumer';
import { Device } from 'mediasoup-client/lib/Device';
import { Producer } from 'mediasoup-client/lib/Producer';
import { Transport } from 'mediasoup-client/lib/Transport';
import { AppData } from 'mediasoup-client/lib/types';
import React, { createContext } from 'react';

import { UserInList } from '../../utils/types';

export const MediaContext = createContext<{
  isConnected: boolean;
  isMuted: boolean;
  isStreaming: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>;
  audioProducer: Producer | null;
  setAudioProducer: React.Dispatch<React.SetStateAction<Producer | null>>;
  videoProducer: Producer | null;
  setVideoProducer: React.Dispatch<React.SetStateAction<Producer | null>>;
  device: Device | null;
  setDevice: React.Dispatch<React.SetStateAction<Device | null>>;
  producerTransport: Transport | null;
  setProducerTransport: React.Dispatch<React.SetStateAction<Transport | null>>;
  consumers: Consumer[];
  users: UserInList[];
  addConsumer: (consumer: Consumer) => void;
  setConsumers: React.Dispatch<React.SetStateAction<Consumer<AppData>[]>>;
  toggleMute: () => void;
  selectedUserId: string | null;
  setSelectedUserId: React.Dispatch<React.SetStateAction<string | null>>;
} | null>(null);
