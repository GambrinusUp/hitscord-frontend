/*import { createAsyncThunk } from '@reduxjs/toolkit';
import { Device } from 'mediasoup-client';
import { Consumer } from 'mediasoup-client/lib/Consumer';
import { Producer } from 'mediasoup-client/lib/Producer';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import { Transport } from 'mediasoup-client/lib/Transport';

import socket from '../../api/socket';
import {
  createDevice,
  createSendTransport,
  getLocalAudioStream,
  joinRoom,
} from '../../context/utils/mediaHelpers';
import { getErrorMessage } from '../../helpers/getErrorMessage';

export const connectThunk = createAsyncThunk<
  void,
  {
    roomName: string;
    userName: string;
    audioProducerRef: React.MutableRefObject<Producer | null>;
    deviceRef: React.MutableRefObject<Device | null>;
    producerTransportRef: React.MutableRefObject<Transport | null>;
    addConsumer: (consumer: Consumer) => void;
  },
  { rejectValue: string }
>(
  'connection/connect',
  async (
    {
      roomName,
      userName,
      audioProducerRef,
      deviceRef,
      producerTransportRef,
      addConsumer,
    },
    { rejectWithValue }
  ) => {
    try {
      if (!socket.connected) {
        throw new Error('Socket is not connected');
      }

      const audioTrack = await getLocalAudioStream();

      const roomData: RtpCapabilities = await joinRoom(roomName, userName);

      const device = await createDevice(roomData);

      deviceRef.current = device;

      const producerTransport: Transport = await createSendTransport(
        device,
        audioTrack,
        audioProducerRef,
        addConsumer
      );

      producerTransportRef.current = producerTransport;

      console.log('Connected and configured successfully');
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
*/
