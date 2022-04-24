export const parseError = (err: any) => {
  const name = err.name;
  const message = err.message;
  const stack =
    typeof err.stack === "string" ? err.stack.split("\n") : err.stack;

  return {
    name,
    message,
    ...err,
    stack,
  };
};
