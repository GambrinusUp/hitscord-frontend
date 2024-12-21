import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './App.css';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import { MediaProvider } from './context/MediaContext/MediaProvider';
import AuthPage from './pages/AuthPage/AuthPage';
import LandingPage from './pages/LandingPage/LandingPage';
import RegistrationPage from './pages/RegistrationPage/Registration';
//import TestEntryPage from './pages/TestEntryPage/TestEntryPage';
import TestMainPage from './pages/TestMainPage/TestMainPage';

function App() {
  return (
    <MediaProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <MantineProvider>
          <Notifications />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/main" element={<TestMainPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<RegistrationPage />} />
          </Routes>
        </MantineProvider>
      </Router>
    </MediaProvider>
  );
}

export default App;
