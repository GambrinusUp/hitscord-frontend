import { MessageContext } from './MessageContext';

import { CreateMessageWs } from '~/store/ServerStore';

export const AudioProvider = (props: React.PropsWithChildren) => {
  const sendMessage = (message: CreateMessageWs) => {
    console.log(message);
  };

  return (
    <MessageContext.Provider
      value={{
        sendMessage,
      }}
    >
      {props.children}
    </MessageContext.Provider>
  );
};
