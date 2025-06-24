export const formatTagMessage = (message: string) => {
  // user tags: @username#1234
  message = message.replace(/@([a-zA-Z]+#\d+)/g, '//{usertag:$1}//');
  // role tags: @rolename
  message = message.replace(/@([a-zA-Z0-9_-]+)/g, (match, p1) => {
    if (!/\d/.test(p1)) {
      return `//{roletag:${p1}}//`;
    }

    return match;
  });

  return message;
};
