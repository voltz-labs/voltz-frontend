import { FallbackError } from "./FallbackError";
import { Loading } from "./Loading";

export interface FallbackProps {
  loading: boolean;
  errors: Error[] | null;
}

export const Fallback = ({ loading, errors }: FallbackProps) => {
  if (loading) {
    return <Loading />;
  }

  return <FallbackError errors={errors} />;
};
