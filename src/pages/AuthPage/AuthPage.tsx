import {
  Button,
  Card,
  Flex,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useNotification } from '../../hooks/useNotification';
import { loginUser } from '../../store/user/UserActionCreators';

function AuthPage() {
  const { accessToken, error } = useAppSelector((state) => state.userStore);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showError } = useNotification();

  const form = useForm({
    initialValues: {
      mail: '',
      password: '',
    },

    validate: {
      mail: (value) =>
        /^\S+@\S+$/.test(value) ? null : 'Неверный формат email',
      password: (value) =>
        value.trim().length > 5
          ? null
          : 'Введите пароль (пароль должен содержать больше 6 символов',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    const result = await dispatch(loginUser(values));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/main');
    }
  };

  useEffect(() => {
    if (accessToken) {
      navigate('/main');
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <>
      <Flex
        w="100vw"
        h="100vh"
        gap="md"
        justify="center"
        align="center"
        direction="column"
        bg="linear-gradient(135deg, #4a90e2, #7b4397)"
      >
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
            Войти в учётную запись
          </Text>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="Введите email"
                {...form.getInputProps('mail')}
                required
              />
              <PasswordInput
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
      </Flex>
    </>
  );
}

export default AuthPage;
