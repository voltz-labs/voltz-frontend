import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { parseError } from "../functions/parseError";

export interface FallbackErrorProps {
  errors: Error[] | null;
}

export const FallbackError = ({ errors }: FallbackErrorProps) => {
  useEffect(() => {
    if (errors) {
      for (const error of errors) {
        console.error(error);
      }
    }
  }, [errors]);

  return (
    <Container>
      <h1>Ooops...</h1>
      <p>The page you are looking for has an error.</p>

      {errors ? (
        <code>
          <pre>
            {JSON.stringify(
              errors.map((err) => parseError(err)),
              null,
              2
            )}
          </pre>
        </code>
      ) : (
        <p>No content returned from API.</p>
      )}
    </Container>
  );
};
