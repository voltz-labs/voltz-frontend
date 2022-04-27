export const parseDateTimeLocalValueToDate = (value: string): Date | null => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Date(date.getTime());
};
