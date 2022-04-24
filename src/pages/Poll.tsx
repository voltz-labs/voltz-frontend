import { Button } from "react-bootstrap";
import { Fallback } from "../components/Fallback";
import { Navbar } from "../components/Navbar";
import { convertNumberToHex } from "../functions/convertNumberToHex";
import { convertStringToHex } from "../functions/convertStringToHex";
import { gql } from "../functions/gql";
import { nanoid } from "../functions/nanoid";
import { useQuery } from "../hooks/useQuery";
import { useRouter } from "../hooks/useRouter";
import { UserProps } from "../models/User";
import {
  BYTE_INDICATOR_HEX_BYTE_STRING,
  BYTE_INDICATOR_MICHELINE_EXPRESSION,
} from "../utils/constants";
import { wallet } from "../utils/wallet";
import { SigningType } from "@airgap/beacon-sdk";
import { graphql } from "../functions/graphql";

export interface MutationVoteCreate {
  voteId: string;
}

export interface MutationVoteCreateVariables {}

export const MUTATION_VOTE_CREATE = gql`
  mutation ($input: VoteCreateInput!) {
    voteCreate(input: $input) {
      voteId
    }
  }
`;

export interface PollQuery {
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

export interface PollProps {
  user: UserProps;
}

export const Poll = ({ user }: PollProps) => {
  const { params } = useRouter();

  const pollId = params.pollId!;

  const Q = useQuery<PollQuery>({
    query: POLL_QUERY,
    variables: {
      id: {
        pollId,
      },
    },
  });

  console.log(Q);
  if (Q.fallback) {
    return (
      <div>
        <Navbar />

        <Fallback loading={Q.loading} errors={Q.errors} />
      </div>
    );
  }

  const { data } = Q;

  const poll = data.poll;

  const vote = async (optionId: string) => {
    const voteId = nanoid();

    const content = {
      voteId,
      pollId: poll.pollId,
      optionId,
      voterAddress: user.address,
    };

    const bytes = convertStringToHex(JSON.stringify(content));

    const length = convertNumberToHex(bytes.length);

    const payload =
      BYTE_INDICATOR_MICHELINE_EXPRESSION +
      BYTE_INDICATOR_HEX_BYTE_STRING +
      length +
      bytes;

    const signedPayload = await wallet.client.requestSignPayload({
      signingType: SigningType.MICHELINE,
      payload,
      sourceAddress: user.address,
    });

    const signature = signedPayload.signature;

    const { data, errors } = await graphql<
      MutationVoteCreate,
      MutationVoteCreateVariables
    >({
      query: MUTATION_VOTE_CREATE,
      variables: {
        input: {
          ...content,
          payload,
          signature,
        },
      },
    });

    console.log({ data, errors });
  };

  return (
    <div>
      <Navbar />
      <p>PollId: {data.poll.pollId}</p>
      <p>Title: {data.poll.title}</p>
      <p>Description: {data.poll.description}</p>
      <div>
        <p>Options:</p>
        <ul>
          {data.poll.options.map((option) => (
            <li key={option.optionId} className="mb-5">
              <p>{option.description}</p>
              <Button type="button" onClick={() => vote(option.optionId)}>
                Vote
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
