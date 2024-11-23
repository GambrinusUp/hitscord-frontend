export interface User {
  id: string;
  email: string;
  fullName: string;
  course: string;
  group: string;
  password: string;
  isAdmin: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  userName: string;
  timestamp: string;
  isOwnMessage: boolean;
}

export interface TextChannel {
  name: string;
  messages: Message[];
}

export interface Server {
  name: string;
  textChannels: Record<string, TextChannel>;
}

export interface EditModal {
  isEdit: boolean;
  initialData: string;
  channelId: string;
}
