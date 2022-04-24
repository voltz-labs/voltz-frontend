import { useException } from "./useException";

export const useHandler = () => {
  const { createException } = useException();

  const handler =
    <Args extends any[], T>(callback: (...args: Args) => Promise<T>) =>
    async (...args: Args) => {
      try {
        const values = await callback(...args);

        return values;
      } catch (err: any) {
        createException(err);

        throw err;
      }
    };

  return { handler };
};
