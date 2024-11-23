import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppSettingsState {
  isUserStreamView: boolean;
  // isDarkMode: boolean;
  // language: string;
}

const initialState: AppSettingsState = {
  isUserStreamView: false,
};

const AppSettingsSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleUserStreamView(state) {
      state.isUserStreamView = !state.isUserStreamView;
    },
    setUserStreamView(state, action: PayloadAction<boolean>) {
      state.isUserStreamView = action.payload;
    },
    // toggleDarkMode(state) {
    //   state.isDarkMode = !state.isDarkMode;
    // },
    // setLanguage(state, action: PayloadAction<string>) {
    //   state.language = action.payload;
    // },
  },
});

export const { toggleUserStreamView, setUserStreamView } =
  AppSettingsSlice.actions;

export default AppSettingsSlice.reducer;
