export interface ThreadItemProps {
  name: string;
  lastMessage: string;
  date: string;
  isActive: boolean;
  onClick: () => void;
}
