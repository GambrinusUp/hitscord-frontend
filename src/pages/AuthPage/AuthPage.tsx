//import styles from './AuthPage.module.scss';
import { Button, Card, Group, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useNotification } from '../../hooks/useNotification';
import { loginUser } from '../../store/user/UserActionCreators';

function AuthPage() {
  const { error } = useAppSelector((state) => state.userStore);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showError } = useNotification();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : 'Неверный формат email',
      password: (value) => (value.trim().length > 0 ? null : 'Введите пароль'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    console.log('Account Data:', values);
    const result = await dispatch(loginUser(values));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/main');
    }
  };

  useEffect(() => {
    if (error) {
      showError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        bg="#1c1c1c"
        c="white"
        w="30vw"
        miw="300px"
      >
        <Text fw={500} mb="md">
          Создать учётную запись
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="Введите email"
              {...form.getInputProps('email')}
              required
            />
            <TextInput
              label="Пароль"
              placeholder="Введите пароль"
              {...form.getInputProps('password')}
              required
            />
            <Group justify="center" mt="md">
              <Button type="submit">Войти</Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </>
  );
}

export default AuthPage;
