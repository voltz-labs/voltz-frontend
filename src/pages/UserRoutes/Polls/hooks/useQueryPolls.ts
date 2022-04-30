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
      results: {
        voteCount: number;
        voteBalance: number;
      };
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
        results {
          voteCount
          voteBalance
        }
      }
    }
  }
`;

export const useQueryPolls = () =>
  useQuery<GraphQLQueryPolls>({
    query: GRAPHQL_QUERY_POLLS,
  });
