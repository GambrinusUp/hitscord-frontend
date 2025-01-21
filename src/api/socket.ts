import { io, Socket } from 'socket.io-client';

import { WEBSOCKET_MEDIA_URL } from '../utils/constants';

const socket: Socket = io(WEBSOCKET_MEDIA_URL);

socket.on('connection-success', ({ socketId }: { socketId: string }) => {
  console.log('Connected with socketId', socketId);
});

export default socket;
