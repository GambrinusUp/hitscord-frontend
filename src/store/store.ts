import { configureStore } from '@reduxjs/toolkit';

import userReducer from './user/UserSlice';

const store = configureStore({
  reducer: {
    userStore: userReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
