import { Button, Container, Form } from "react-bootstrap";
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
import { useState } from "react";
import { useSubmit } from "../hooks/useSubmit";
import { GraphQLError } from "./GraphQLError";
import { useSuccess } from "../hooks/useSuccess";

export interface MutationVoteCreate {
  voteCreate: {
    voteId: string;
  };
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

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const router = useRouter();

  const { loading: submitLoading, submit } = useSubmit();

  const { createSuccess } = useSuccess();

  const pollId = params.pollId!;

  const Q = useQuery<PollQuery>({
    query: POLL_QUERY,
    variables: {
      id: {
        pollId,
      },
    },
  });

  if (Q.fallback) {
    return (
      <div>
        <Navbar />

        <Fallback loading={Q.loading} errors={Q.errors} />
      </div>
    );
  }

  const {
    data: {
      poll: { ...poll },
    },
  } = Q;

  const onSubmit = submit(async () => {
    if (!selectedOption) {
      return;
    }

    const optionId = selectedOption;

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

    if (errors) {
      throw new GraphQLError("Failed to vote", errors);
    }

    createSuccess({
      message: `Vote "${data.voteCreate.voteId}" cast with success`,
      onClose: async () => {
        router.push({
          path: "/",
        });
      },
    });
  });

  return (
    <div>
      <Navbar />
      <Container className="py-5">
        <h2 className="border-bottom mb-2">{poll.title}</h2>
        <Form onSubmit={onSubmit()}>
          <section>
            <strong>Description:</strong>
            <p>{poll.description}</p>
          </section>
          <section>
            <strong>Options:</strong>
            <ul>
              {poll.options.map((option) => (
                <li key={option.optionId}>
                  <Form.Check
                    type="radio"
                    id={`option-${option.optionId}`}
                    name="optionId"
                    value={option.optionId}
                    label={option.description}
                    checked={selectedOption === option.optionId}
                    onChange={(e) =>
                      e.target.checked && setSelectedOption(option.optionId)
                    }
                  />
                </li>
              ))}
            </ul>
          </section>
          <Button variant="primary" type="submit" disabled={submitLoading}>
            Vote
          </Button>
        </Form>
      </Container>
    </div>
  );
};
