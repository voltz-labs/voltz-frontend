import { PollType } from "../../../@types/PollType";
import { gql } from "../../../functions/gql";
import { useQuery } from "../../../hooks/useQuery";

export interface GraphQLQueryDashboard {
  polls: {
    totalCount: number;
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
      expired: boolean;
      pollType: PollType;
    }[];
  };
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

export const GRAPHQL_QUERY_DASHBOARD = gql`
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
        expired
        pollType
      }
    }
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

export const useQueryDashboard = () =>
  useQuery<GraphQLQueryDashboard>({
    query: GRAPHQL_QUERY_DASHBOARD,
  });
