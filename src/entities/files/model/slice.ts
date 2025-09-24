import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { attachFile } from './actions';
import { FILES_SLICE_NAME } from './const';
import { FileResponse, FilesState } from './types';

import { LoadingState } from '~/shared';

const initialState: FilesState = {
  uploadedFiles: [],
  loading: LoadingState.IDLE,
  error: '',
};

export const FilesSlice = createSlice({
  name: FILES_SLICE_NAME,
  initialState,
  reducers: {
    removeFile: (state, action: PayloadAction<{ fileId: string }>) => {
      const { fileId } = action.payload;

      state.uploadedFiles = state.uploadedFiles.filter(
        (file) => file.fileId !== fileId,
      );
    },
    clearFiles: (state) => {
      state.uploadedFiles = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(attachFile.pending, (state) => {
        state.loading = LoadingState.PENDING;
        state.error = '';
      })
      .addCase(
        attachFile.fulfilled,
        (state, action: PayloadAction<FileResponse>) => {
          state.loading = LoadingState.FULFILLED;
          state.uploadedFiles = [...state.uploadedFiles, action.payload];
          state.error = '';
        },
      )
      .addCase(attachFile.rejected, (state, action) => {
        state.loading = LoadingState.REJECTED;
        state.error = action.payload as string;
      });
  },
});

export const { removeFile, clearFiles } = FilesSlice.actions;

export const filesReducer = FilesSlice.reducer;
