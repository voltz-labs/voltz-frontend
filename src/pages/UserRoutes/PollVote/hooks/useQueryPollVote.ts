import { gql } from "../../../../functions/gql";
import { useQuery } from "../../../../hooks/useQuery";

export interface PollVoteQuery {
  poll: {
    pollId: string;
    title: string;
    description: string;
    creatorAddress: string;
    payload: string;
    signature: string;
    expired: string;
    creator: {
      address: string;
      publicKey: string;
    };
    options: {
      optionId: string;
      description: string;
    }[];
    votedOption: {
      optionId: string;
    } | null;
    results: {
      voteCount: number;
      voteResults: {
        optionId: string;
        voteCount: number;
      }[];
    };
  };
}

export interface PollVoteQueryVariables {
  id: {
    pollId: string;
  };
  input: {
    voterAddress: string;
  };
}

export const POLL_QUERY = gql`
  query ($id: PollID!, $input: VotedOptionInput!) {
    poll(id: $id) {
      pollId
      title
      description
      creatorAddress
      payload
      signature
      expired
      creator {
        address
        publicKey
      }
      options {
        optionId
        description
      }
      votedOption(input: $input) {
        optionId
      }
      results {
        voteCount
        voteResults {
          optionId
          voteCount
        }
      }
    }
  }
`;

export const useQueryPollVote = (variables: PollVoteQueryVariables) =>
  useQuery<PollVoteQuery, PollVoteQueryVariables>({
    query: POLL_QUERY,
    variables,
  });
