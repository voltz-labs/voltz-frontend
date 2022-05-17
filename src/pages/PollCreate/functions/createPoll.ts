import { PollType } from "../../../@types/PollType";
import { gql } from "../../../functions/gql";
import { graphql } from "../../../functions/graphql";

export interface MutationCreatePoll {
  pollCreate: {
    pollId: string;
  };
}

export interface MutationCreatePollVariables {
  input: {
    pollId: string;
    title: string;
    description: string;
    creatorAddress: string;
    payload: string;
    signature: string;
    minimalBalanceRequiredToVote: number;
    expirationDate: Date | null;
    expirationBlockQuote: number | null;
    options: {
      optionId: string;
      description: string;
    }[];
    pollType: PollType;
  };
}

export const MUTATION_CREATE_POLL = gql`
  mutation ($input: PollCreateInput!) {
    pollCreate(input: $input) {
      pollId
    }
  }
`;

export const createPoll = (variables: MutationCreatePollVariables) =>
  graphql<MutationCreatePoll, MutationCreatePollVariables>({
    query: MUTATION_CREATE_POLL,
    variables,
  });
