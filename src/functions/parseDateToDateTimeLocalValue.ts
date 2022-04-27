export const parseDateToDateTimeLocalValue = (value: Date | null) => {
  if (!value) {
    return "";
  }

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return new Date(value.getTime() - value.getTimezoneOffset() * 60 * 1000)
    .toISOString()
    .slice(0, 16);
};
