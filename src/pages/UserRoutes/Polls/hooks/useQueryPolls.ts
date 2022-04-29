import { PollType } from "../../../../@types/PollType";
import { gql } from "../../../../functions/gql";
import { useQuery } from "../../../../hooks/useQuery";

export interface GraphQLQueryPolls {
  polls: {
    items: {
      pollId: string;
      title: string;
      description: string;
      creator: {
        address: string;
      };
      options: {
        optionId: string;
        description: string;
      }[];
      minimalBalanceRequiredToVote: number;
      expired: boolean;
      expirationDate: Date;
      expirationBlockQuote: number;
      pollType: PollType;
    }[];
  };
}

export const GRAPHQL_QUERY_POLLS = gql`
  query {
    polls {
      items {
        pollId
        title
        description
        creator {
          address
        }
        options {
          optionId
          description
        }
        minimalBalanceRequiredToVote
        expired
        expirationDate
        expirationBlockQuote
        pollType
      }
    }
  }
`;

export const useQueryPolls = () =>
  useQuery<GraphQLQueryPolls>({
    query: GRAPHQL_QUERY_POLLS,
  });
