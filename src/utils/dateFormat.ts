export const formatDate = (date: Date) => {
  return date.toString().slice(0, 19).replace(/-/g, "/").replace("T", " ");
};
