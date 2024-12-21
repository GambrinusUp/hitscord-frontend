import { io, Socket } from 'socket.io-client';

//const socket: Socket = io('https://hitscord-backend.ru/mediasoup');
const socket: Socket = io('https://192.168.0.101:3000/mediasoup');

socket.on('connection-success', ({ socketId }: { socketId: string }) => {
  console.log('Connected with socketId', socketId);
});

export default socket;
