import { Button, Flex, Paper, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../../hooks/redux';
import { setUserName } from '../../store/user/UserSlice';

const TestEntryPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: '',
    },

    validate: {
      name: (value) =>
        value.trim().length < 2 ? 'Имя слишком короткое' : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    dispatch(setUserName(values.name));
    navigate('/main');
  };

  return (
    <>
      <Flex justify="center" align="center" w="100vw" h="100vh" bg="#1a1b1e">
        <Paper
          shadow="md"
          radius="md"
          p="md"
          c="#ffffff"
          bg="#0e0e10"
          w={{ base: 300, lg: 500 }}
        >
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Введите ваше имя"
                placeholder="Имя"
                {...form.getInputProps('name')}
              />
              <Button type="submit">Войти</Button>
            </Stack>
          </form>
        </Paper>
      </Flex>
    </>
  );
};

export default TestEntryPage;
