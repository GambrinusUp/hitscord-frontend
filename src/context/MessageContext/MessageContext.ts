import { createContext } from 'react';

import { CreateMessageWs } from '~/store/ServerStore';

export const MessageContext = createContext<
  | {
      sendMessage: (messageData: CreateMessageWs) => void;
    }
  | undefined
>(undefined);
