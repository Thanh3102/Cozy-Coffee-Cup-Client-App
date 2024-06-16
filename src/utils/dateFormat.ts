export const formatDate = (date: Date) => {
  const [d, t] = date.toString().split("T");
  const [yy, mm, dd] = d.split("-");
  const time = t.slice(0, 8);

  return `${dd}/${mm}/${yy} ${time}`;

  // return date.toString().slice(0, 19).replace(/-/g, "/").replace("T", " ");
};
