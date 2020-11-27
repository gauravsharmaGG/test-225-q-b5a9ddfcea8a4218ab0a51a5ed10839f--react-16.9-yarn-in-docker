export const validURL = (url) => {
  if (!url) return false;
  const expression = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi;
  const regex = new RegExp(expression);

  if (url.match(regex)) {
    return true;
  }
  return false;
};
