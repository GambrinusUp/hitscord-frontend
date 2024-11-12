import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './App.css';

import { Flex, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import AuthPage from './pages/AuthPage/AuthPage';
import LandingPage from './pages/LandingPage/LandingPage';
import MainPage from './pages/MainPage/MainPage';
import RegistrationPage from './pages/RegistrationPage/Registration';

function App() {
  return (
    <Router>
      <MantineProvider>
        <Notifications />
        <Flex
          w="100vw"
          h="100vh"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
          bg="linear-gradient(135deg, #4a90e2, #7b4397)"
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/register" element={<RegistrationPage />} />
          </Routes>
        </Flex>
      </MantineProvider>
    </Router>
  );
}

export default App;
