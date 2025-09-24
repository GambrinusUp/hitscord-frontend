import { ATTACH_FILE, GET_FILE } from './const';

import { FileResponse } from '~/entities/files/model/types';
import { api } from '~/shared/api';

export const getFile = async (
  channelId: string,
  fileId: string,
): Promise<FileResponse> => {
  const { data } = await api.get(GET_FILE(channelId, fileId));

  return data;
};

export const attachFile = async (
  channelId: string,
  file: File,
): Promise<FileResponse> => {
  const formData = new FormData();
  formData.append('ChannelId', channelId);
  formData.append('File', file);

  const { data } = await api.post(ATTACH_FILE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};
