import { configureStore } from '@reduxjs/toolkit';

import appReducer from './app/AppSettingsSlice';
import serverReducer from './server/ServerSlice';
import userReducer from './user/UserSlice';

const store = configureStore({
  reducer: {
    userStore: userReducer,
    appStore: appReducer,
    serverStore: serverReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
