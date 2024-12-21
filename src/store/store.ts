import { configureStore } from '@reduxjs/toolkit';

import appReducer from './app/AppSettingsSlice';
import mediaReducer from './mediasoup/MediasoupSlice';
import serverReducer from './server/ServerSlice';
import testServerReducer from './server/TestServerSlice';
import userReducer from './user/UserSlice';

const store = configureStore({
  reducer: {
    userStore: userReducer,
    appStore: appReducer,
    serverStore: serverReducer,
    testServerStore: testServerReducer,
    mediaStore: mediaReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
