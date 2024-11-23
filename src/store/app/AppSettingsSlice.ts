import { createSlice } from '@reduxjs/toolkit';

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
    // toggleDarkMode(state) {
    //   state.isDarkMode = !state.isDarkMode;
    // },
    // setLanguage(state, action: PayloadAction<string>) {
    //   state.language = action.payload;
    // },
  },
});

export const { toggleUserStreamView } = AppSettingsSlice.actions;

export default AppSettingsSlice.reducer;
