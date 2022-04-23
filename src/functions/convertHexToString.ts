export const convertHexToString = (hex: string) =>
  hex
    .match(/[0-9a-f]{2}/gi)!
    .map((hex) => String.fromCharCode(parseInt(hex, 16)))
    .join("");
