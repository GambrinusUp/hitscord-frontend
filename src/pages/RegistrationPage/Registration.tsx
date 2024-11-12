import {
  Button,
  Card,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';

//import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { registerUser } from '../../store/user/UserActionCreators';

const RegistrationPage = () => {
  const dispatch = useAppDispatch();
  //const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      fullName: '',
      course: '',
      group: '',
      password: '',
    },

    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : 'Неверный формат email',
      fullName: (value) => (value.trim().length > 0 ? null : 'Введите ФИО'),
      course: (value) => (value ? null : 'Выберите курс'),
      group: (value) => (value.trim().length > 0 ? null : 'Введите группу'),
      password: (value) => (value.trim().length > 0 ? null : 'Введите пароль'),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log('Account Data:', values);
    dispatch(registerUser(values));
    /*dispatch(setUserName(values.email));
    navigate('/main');*/
  };

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
              label="ФИО"
              placeholder="Введите ФИО"
              {...form.getInputProps('fullName')}
              required
            />
            <Select
              label="Курс"
              placeholder="Выберите курс"
              data={[
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
              ]}
              {...form.getInputProps('course')}
              required
            />
            <TextInput
              label="Группа"
              placeholder="Введите группу"
              {...form.getInputProps('group')}
              required
            />
            <TextInput
              label="Пароль"
              placeholder="Введите пароль"
              {...form.getInputProps('password')}
              required
            />
            <Group justify="center" mt="md">
              <Button type="submit">Создать</Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </>
  );
};

export default RegistrationPage;
