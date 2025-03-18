import { configureStore } from '@reduxjs/toolkit';

import { AppReducer } from './AppStore';
import { ServerReducer } from './ServerStore';
import { UserReducer } from './UserStore';

const store = configureStore({
  reducer: {
    userStore: UserReducer,
    appStore: AppReducer,
    testServerStore: ServerReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
