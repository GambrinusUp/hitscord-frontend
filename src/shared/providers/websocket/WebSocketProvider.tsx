import { useCallback, useEffect, useRef } from 'react';

import { WebSocketContext } from './WebSocketContext';

import { addChatMessage } from '~/entities/chat';
import { formatMessage } from '~/helpers';
import { formatChatMessage } from '~/helpers/formatMessage';
import { useAppDispatch, useNotification, useAppSelector } from '~/hooks';
import { deleteChatMessageWS, editChatMessageWS } from '~/store/ChatsStore';
import {
  addMessage,
  deleteMessageWs,
  editMessageWs,
  CreateMessageWs,
  EditMessageWs,
  DeleteMessageWs,
} from '~/store/ServerStore';

export const WebSocketProvider = (props: React.PropsWithChildren) => {
  const dispatch = useAppDispatch();
  const { showMessage, showError } = useNotification();
  const { accessToken } = useAppSelector((state) => state.userStore);
  const { currentServerId } = useAppSelector((state) => state.testServerStore);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (accessToken) {
      const ws = new WebSocket(
        `wss://hitscord-backend.online/api/wss?accessToken=${accessToken}`,
      );

      ws.onopen = () => {
        setInterval(
          () => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'ping' }));
            }
          },
          5 * 60 * 1000,
        );
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        console.log(data);

        if (data.MessageType === 'New message') {
          const formattedMessage = formatMessage(data.Payload);

          if (formattedMessage.id && formattedMessage.text) {
            dispatch(addMessage(formattedMessage));
          }
        }

        if (data.MessageType === 'New message in chat') {
          const formattedMessage = formatChatMessage(data.Payload);

          if (formattedMessage.id && formattedMessage.text) {
            dispatch(addChatMessage(formattedMessage));
          }
        }

        if (data.MessageType === 'Deleted message') {
          dispatch(
            deleteMessageWs({
              channelId: data.Payload.ChannelId,
              messageId: data.Payload.MessageId,
            }),
          );
        }

        if (data.MessageType === 'Deleted message in chat') {
          dispatch(
            deleteChatMessageWS({
              chatId: data.Payload.ChatId,
              messageId: data.Payload.MessageId,
            }),
          );
        }

        if (data.MessageType === 'Updated message') {
          const formattedMessage = formatMessage(data.Payload);
          dispatch(editMessageWs(formattedMessage));
        }

        if (data.MessageType === 'Updated message in chat') {
          const formattedMessage = formatChatMessage(data.Payload);
          dispatch(editChatMessageWS(formattedMessage));
        }

        if (data.MessageType === 'User notified') {
          if (showMessage) {
            showMessage(data.Payload.Text);
          }
        }

        if (data.MessageType === 'ErrorWithMessage') {
          const message = `${data.Payload.Object}: ${data.Payload.Message}`;
          showError(message);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      wsRef.current = ws;

      return () => {
        console.log('Closing WebSocket connection');
        ws.close();
      };
    }
  }, [accessToken, currentServerId, dispatch]);

  const sendMessage = useCallback(
    (message: CreateMessageWs) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'New message',
          Content: message,
        };

        console.log(sendData);
        wsRef.current.send(JSON.stringify(sendData));
      } else {
        console.error(
          'WebSocket is not open. Ready state:',
          wsRef.current?.readyState,
        );
      }
    },
    [wsRef],
  );

  const sendChatMessage = useCallback(
    (message: CreateMessageWs) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'New message chat',
          Content: message,
        };

        console.log(sendData);

        wsRef.current.send(JSON.stringify(sendData));
      } else {
        console.error(
          'WebSocket is not open. Ready state:',
          wsRef.current?.readyState,
        );
      }
    },
    [wsRef],
  );

  const editMessage = useCallback(
    (message: EditMessageWs) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'Update message',
          Content: message,
        };

        wsRef.current.send(JSON.stringify(sendData));
      } else {
        console.error(
          'WebSocket is not open. Ready state:',
          wsRef.current?.readyState,
        );
      }
    },
    [wsRef],
  );

  const editChatMessage = useCallback(
    (message: EditMessageWs) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'Update message chat',
          Content: message,
        };

        wsRef.current.send(JSON.stringify(sendData));
      } else {
        console.error(
          'WebSocket is not open. Ready state:',
          wsRef.current?.readyState,
        );
      }
    },
    [wsRef],
  );

  const deleteMessage = useCallback(
    (message: DeleteMessageWs) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'Delete message',
          Content: message,
        };

        wsRef.current.send(JSON.stringify(sendData));
      } else {
        console.error(
          'WebSocket is not open. Ready state:',
          wsRef.current?.readyState,
        );
      }
    },
    [wsRef],
  );

  const deleteChatMessage = useCallback(
    (message: DeleteMessageWs) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const sendData = {
          Type: 'Delete message chat',
          Content: message,
        };

        wsRef.current.send(JSON.stringify(sendData));
      } else {
        console.error(
          'WebSocket is not open. Ready state:',
          wsRef.current?.readyState,
        );
      }
    },
    [wsRef],
  );

  return (
    <WebSocketContext.Provider
      value={{
        sendMessage,
        sendChatMessage,
        editMessage,
        editChatMessage,
        deleteMessage,
        deleteChatMessage,
      }}
    >
      {props.children}
    </WebSocketContext.Provider>
  );
};
