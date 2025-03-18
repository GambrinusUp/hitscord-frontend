export interface UserGroup {
  userName: string;
  producerIds: string[];
}

export interface RoomGroup {
  roomName: string;
  users: Record<string, UserGroup>;
}
