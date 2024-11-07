import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './App.css';

import { Flex, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import MainPage from './pages/MainPage';
function App() {
  return (
    <Router>
      <MantineProvider>
        <Notifications />
        <Flex
          mih={'100vh'}
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
        >
          <Routes>
            <Route path="/" element={<MainPage />} />
          </Routes>
        </Flex>
      </MantineProvider>
    </Router>
  );
}

export default App;
