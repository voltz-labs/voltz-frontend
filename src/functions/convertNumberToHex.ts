export const convertNumberToHex = (value: number) =>
  value.toString(16).padStart(8, "0");
