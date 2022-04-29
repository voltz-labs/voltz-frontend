import { gql } from "../../../functions/gql";
import { useQuery } from "../../../hooks/useQuery";

export interface PollVoteQuery {
  poll: {
    pollId: string;
    title: string;
    description: string;
    creatorAddress: string;
    payload: string;
    signature: string;
    creator: {
      address: string;
      publicKey: string;
    };
    options: {
      optionId: string;
      description: string;
    }[];
  };
}

export interface PollVoteQueryVariables {
  id: {
    pollId: string;
  };
}

export const POLL_QUERY = gql`
  query ($id: PollID!) {
    poll(id: $id) {
      pollId
      title
      description
      creatorAddress
      payload
      signature
      creator {
        address
        publicKey
      }
      options {
        optionId
        description
      }
    }
  }
`;

export const useQueryPollVote = (variables: PollVoteQueryVariables) =>
  useQuery<PollVoteQuery, PollVoteQueryVariables>({
    query: POLL_QUERY,
    variables,
  });
