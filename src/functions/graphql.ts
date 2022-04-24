import { API_URL } from "../utils/constants";
import { FetchError } from "../utils/FetchError";

export interface GraphQLProps<Variables> {
  query: string;
  variables?: Variables;
  headers?: Record<string, any>;
}

export interface GraphQLResult<T> {
  data: T;
  errors: Error[];
}

export const graphql = async <
  T = Record<string, any>,
  Variables = Record<string, any>
>({
  query,
  variables,
  headers,
}: GraphQLProps<Variables>): Promise<GraphQLResult<T>> => {
  console.log(API_URL);

  const url = new URL(API_URL);

  url.pathname = "/graphql";

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      ...headers,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (response.status !== 200) {
    const error = await FetchError.create(response);

    throw error;
  }

  const { data, errors } = await response.json();

  return {
    data,
    errors,
  };
};
