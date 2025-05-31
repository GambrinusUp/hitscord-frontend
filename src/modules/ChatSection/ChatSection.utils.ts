export const formatUserTagMessage = (message: string) => {
  const pattern = /#([a-zA-Z]+#\d+)/g;

  return message.replace(pattern, '//{usertag:$1}//');
};
