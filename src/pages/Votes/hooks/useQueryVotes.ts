import { gql } from "../../../functions/gql";
import { useQuery } from "../../../hooks/useQuery";

export interface GraphQLQueryVotes {
  votes: {
    items: {
      voteId: string;
      poll: {
        title: string;
      };
      option: {
        description: string;
      };
      voter: {
        address: string;
      };
    }[];
  };
}

export const GRAPHQL_QUERY_POLLS = gql`
  query {
    votes {
      items {
        voteId
        poll {
          title
        }
        option {
          description
        }
        voter {
          address
        }
      }
    }
  }
`;

export const useQueryVotes = () =>
  useQuery<GraphQLQueryVotes>({
    query: GRAPHQL_QUERY_POLLS,
  });
