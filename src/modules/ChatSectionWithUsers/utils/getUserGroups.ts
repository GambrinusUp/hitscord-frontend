import { Room } from '../../../utils/types';

interface UserGroup {
  userName: string;
  producerIds: string[];
}

interface RoomGroup {
  roomName: string;
  users: Record<string, UserGroup>;
}

export const getUserGroups = (rooms: Room[]): RoomGroup[] => {
  return rooms.map((room) => {
    const usersGroup = room.users.reduce((acc, user) => {
      if (!acc[user.socketId]) {
        acc[user.socketId] = { userName: user.userName, producerIds: [] };
      }
      acc[user.socketId].producerIds.push(user.producerId);
      return acc;
    }, {} as Record<string, UserGroup>);

    return {
      roomName: room.roomName,
      users: usersGroup,
    };
  });
};
