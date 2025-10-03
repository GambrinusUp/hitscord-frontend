import { changeProfileIcon } from '~/entities/user';
import { useAppDispatch, useNotification } from '~/hooks';

export const useUploadIcon = () => {
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useNotification();

  const validateAndUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      showError('Файл слишком большой (макс. 10 МБ)');

      return;
    }

    if (!file.type.startsWith('image/')) {
      showError('Файл не является изображением!');

      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    try {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () =>
          reject(new Error('Невозможно загрузить изображение'));
        img.src = objectUrl;
      });

      if (img.width > 650 || img.height > 650) {
        showError('Изображение слишком большое (макс. 650×650)');

        return;
      }
    } finally {
      URL.revokeObjectURL(objectUrl);
    }

    const result = await dispatch(changeProfileIcon({ icon: file }));

    if (result.meta.requestStatus === 'fulfilled') {
      showSuccess('Аватарка успешно установлена');
    }
  };

  return { validateAndUpload };
};
