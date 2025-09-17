import {
  ActionIcon,
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
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '~/hooks';
import { registerUser } from '~/store/UserStore/UserStore.actions';

export const RegistrationPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { accessToken } = useAppSelector((state) => state.userStore);

  const form = useForm({
    initialValues: {
      mail: '',
      accountName: '',
      password: '',
    },

    validate: {
      mail: (value) => {
        const length = value.trim().length;

        if (length < 6) {
          return 'Email должен содержать минимум 6 символов';
        }

        if (length > 50) {
          return 'Email не должен превышать 50 символов';
        }

        if (!/^\S+@\S+$/.test(value)) {
          return 'Неверный формат email';
        }

        return null;
      },
      accountName: (value) => {
        const length = value.trim().length;

        if (length < 6) {
          return 'Имя должно содержать минимум 6 символов';
        }

        if (length > 50) {
          return 'Имя не должно превышать 50 символов';
        }

        return null;
      },
      password: (value) =>
        value.trim().length > 5
          ? null
          : 'Введите пароль (пароль должен содержать больше 6 символов)',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    const result = await dispatch(
      registerUser({
        mail: values.mail,
        password: values.password,
        accountName: values.accountName,
      }),
    );

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/main');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  useEffect(() => {
    if (accessToken) {
      navigate('/main');
    }
  }, [accessToken, navigate]);

  return (
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
        <Group justify="space-between" align="center" mb="md">
          <Text fw={500}> Создать учётную запись</Text>
          <ActionIcon variant="subtle" onClick={handleBack}>
            <ArrowLeft size={24} />
          </ActionIcon>
        </Group>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="Введите email"
              {...form.getInputProps('mail')}
              maxLength={50}
              required
            />
            <TextInput
              label="ФИО"
              placeholder="Введите ФИО"
              description="от 6 до 50 символов"
              {...form.getInputProps('accountName')}
              maxLength={50}
              required
            />
            <PasswordInput
              label="Пароль"
              placeholder="Введите пароль"
              description="от 6 символов"
              {...form.getInputProps('password')}
              required
            />
            <Group justify="center" mt="md">
              <Button type="submit">Создать</Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Flex>
  );
};
