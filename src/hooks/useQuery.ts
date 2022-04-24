import { useEffect, useState } from "react";
import { graphql } from "../functions/graphql";

export interface UseQueryProps<Variables> {
  query: string;
  variables?: Variables;
  headers?: Record<string, string>;
}

export interface FieldsStateProps<T> {
  data: T | null;
  errors: Error[] | null;
}

export type Result<T> =
  | SuccessResult<T>
  | LoadingResult
  | ErrorResult
  | EmptyResult;

export type SuccessResult<T> = {
  loading: false;
  data: T;
  errors: null;
  fallback: false;
};

export type LoadingResult = {
  loading: true;
  data: null;
  errors: null;
  fallback: true;
};

export type ErrorResult = {
  loading: false;
  data: null;
  errors: Error[];
  fallback: true;
};

export type EmptyResult = {
  loading: false;
  data: null;
  errors: null;
  fallback: true;
};

export const useQuery = <
  T = Record<string, any>,
  Variables = Record<string, any>
>({
  query,
  variables,
  headers,
}: UseQueryProps<Variables>): Result<T> => {
  const [fields, setFields] = useState<FieldsStateProps<T>>({
    data: null,
    errors: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchQuery = async () => {
    setLoading(true);

    try {
      const { data, errors } = await graphql<T, Variables>({
        query,
        variables,
        headers,
      });

      setFields({
        data,
        errors,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuery();
  }, [query, JSON.stringify({ variables, headers })]);

  if (loading) {
    return {
      loading: true,
      data: null,
      errors: null,
      fallback: true,
    };
  }

  if (fields.errors) {
    return {
      loading: false,
      data: null,
      errors: fields.errors,
      fallback: true,
    };
  }

  if (!fields.data) {
    return {
      loading: true,
      data: null,
      errors: null,
      fallback: true,
    };
  }

  return {
    loading: false,
    data: fields.data,
    errors: fields.errors,
    fallback: false,
  };
};
