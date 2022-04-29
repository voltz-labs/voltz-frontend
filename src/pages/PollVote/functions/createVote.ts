import { gql } from "../../../functions/gql";
import { graphql } from "../../../functions/graphql";

export interface MutationVoteCreate {
  voteCreate: {
    voteId: string;
  };
}

export interface MutationVoteCreateVariables {
  input: {
    voteId: string;
    pollId: string;
    optionId: string;
    voterAddress: string;
    payload: string;
    signature: string;
  };
}

export const MUTATION_VOTE_CREATE = gql`
  mutation ($input: VoteCreateInput!) {
    voteCreate(input: $input) {
      voteId
    }
  }
`;

export const createVote = (variables: MutationVoteCreateVariables) =>
  graphql<MutationVoteCreate, MutationVoteCreateVariables>({
    query: MUTATION_VOTE_CREATE,
    variables,
  });
