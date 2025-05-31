import { notifications } from '@mantine/notifications';
import { CircleCheck, CircleX, MessageSquareWarning } from 'lucide-react';

export function useNotification() {
  const showSuccess = (message: string) => {
    notifications.show({
      message,
      position: 'top-center',
      color: 'green',
      radius: 'md',
      autoClose: 2000,
      icon: <CircleCheck />,
    });
  };

  const showError = (message: string) => {
    notifications.show({
      title: 'Ошибка',
      message,
      position: 'top-center',
      color: 'red',
      radius: 'md',
      autoClose: 2000,
      icon: <CircleX />,
    });
  };

  const showMessage = (message: string) => {
    notifications.show({
      title: 'Уведомление',
      message,
      position: 'top-right',
      color: 'yellow',
      radius: 'md',
      autoClose: 2000,
      icon: <MessageSquareWarning />,
    });
  };

  return { showSuccess, showError, showMessage };
}
