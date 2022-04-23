export const convertStringToHex = (str: string) =>
  Array.from(str)
    .map((char) => char.charCodeAt(0).toString(16))
    .join("");
