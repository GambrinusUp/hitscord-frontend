import { Room } from '~/shared';

export interface UserCardsProps {
  users: Room[];
  onOpenStream: (socketId: string) => void;
}
