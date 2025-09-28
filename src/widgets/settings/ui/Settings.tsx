import { Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';

import { SettingsForm } from '~/entities/user';
import { EditSettings } from '~/features/settings/editSettings';
import { PrivacySettings } from '~/features/settings/privacySettings';
import { ProfileSettings } from '~/features/settings/profileSettings';
import { useAppSelector } from '~/hooks';
import {
  combineValidators,
  isEmail,
  maxLength,
  minLength,
} from '~/shared/lib/validators';

export const Settings = () => {
  const [isEdit, setIsEdit] = useState(false);
  const { user } = useAppSelector((state) => state.userStore);

  const form = useForm<SettingsForm>({
    mode: 'uncontrolled',
    initialValues: {
      email: user.mail,
      name: user.name,
      notifiable: user.notifiable,
      friendshipApplication: user.friendshipApplication,
      nonFriendMessage: user.nonFriendMessage,
    },

    validate: {
      email: combineValidators(
        minLength(6, 'Email'),
        maxLength(50, 'Email'),
        isEmail,
      ),
      name: combineValidators(minLength(6, 'Имя'), maxLength(50, 'Имя')),
    },
  });

  return (
    <Stack p="xl" gap="md" w="100%">
      <ProfileSettings isEdit={isEdit} form={form} />
      <PrivacySettings isEdit={isEdit} form={form} />
      <EditSettings isEdit={isEdit} setIsEdit={setIsEdit} form={form} />
    </Stack>
  );
};
