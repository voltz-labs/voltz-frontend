import { gql } from "../../../functions/gql";
import { useQuery } from "../../../hooks/useQuery";

export interface GraphQLQueryWhitelists {
  whitelists: {
    items: {
      userAddress: string;
      isAdmin: boolean;
    }[];
  };
}

export const GRAPHQL_QUERY_WHITELISTS = gql`
  query {
    whitelists {
      items {
        userAddress
        isAdmin
      }
    }
  }
`;

export const useQueryWhitelists = () =>
  useQuery<GraphQLQueryWhitelists>({
    query: GRAPHQL_QUERY_WHITELISTS,
  });
