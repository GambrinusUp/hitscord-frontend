export interface EditModal {
  isEdit: boolean;
  initialData: string;
  channelId: string;
}

export interface UserInList {
  socketId: string;
  producerId: string;
  userName: string;
}

export interface Room {
  roomName: string;
  users: UserInList[];
}
