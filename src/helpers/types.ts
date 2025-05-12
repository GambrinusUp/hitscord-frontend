export interface UserGroup {
  userName: string;
  userId?: string;
  producerIds: string[];
}

export interface RoomGroup {
  roomName: string;
  users: Record<string, UserGroup>;
}
