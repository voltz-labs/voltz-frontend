import { FallbackError } from "./FallbackError";

export interface FallbackProps {
  loading: boolean;
  errors: Error[] | null;
}

export const Fallback = ({ loading, errors }: FallbackProps) => {
  if (loading) {
    return <span>Loading...</span>;
  }

  return <FallbackError errors={errors} />;
};
