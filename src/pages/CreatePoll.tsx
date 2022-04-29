import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { convertNumberToHex } from "../functions/convertNumberToHex";
import { convertStringToHex } from "../functions/convertStringToHex";
import { gql } from "../functions/gql";
import { graphql } from "../functions/graphql";
import { nanoid } from "../functions/nanoid";
import { UserProps } from "../models/User";
import {
  BYTE_INDICATOR_HEX_BYTE_STRING,
  BYTE_INDICATOR_MICHELINE_EXPRESSION,
} from "../utils/constants";
import { wallet } from "../utils/wallet";
import { SigningType } from "@airgap/beacon-sdk";
import { useSubmit } from "../hooks/useSubmit";
import { useSuccess } from "../hooks/useSuccess";
import { GraphQLError } from "../utils/GraphQLError";
import { useRouter } from "../hooks/useRouter";
import { fetchCurrentBlockQuote } from "../functions/fetchCurrentBlockQuote";
import { parseDateToDateTimeLocalValue } from "../functions/parseDateToDateTimeLocalValue";
import { parseDateTimeLocalValueToDate } from "../functions/parseDateTimeLocalValueToDate";
import { Page } from "../components/Page";

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
  };
}

export const MUTATION_CREATE_POLL = gql`
  mutation ($input: PollCreateInput!) {
    pollCreate(input: $input) {
      pollId
    }
  }
`;

export interface CreatePollProps {
  user: UserProps;
}

export const CreatePoll = ({ user }: CreatePollProps) => {
  const [fields, setFields] = useState({
    title: "",
    description: "",
    minimalBalanceRequiredToVote: 0,
    expirationDate: null as Date | null,
    expirationBlockQuote: null as number | null,
    options: [
      {
        description: "",
      },
    ],
  });

  const [currentBlockQuote, setCurrentBlockQuote] = useState<number | null>(
    null
  );

  const { loading: submitLoading, submit } = useSubmit();

  const { createSuccess } = useSuccess();

  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(
      (function fn() {
        fetchCurrentBlockQuote().then((blockQuote) =>
          setCurrentBlockQuote(blockQuote)
        );

        return fn;
      })(),
      5000
    );

    return () => clearInterval(interval);
  }, []);

  const onSubmit = submit(async () => {
    const pollId = nanoid();

    const options = fields.options.map((option) => ({
      optionId: nanoid(),
      ...option,
    }));

    const content = {
      pollId,
      title: fields.title,
      description: fields.description,
      creatorAddress: user.address,
      minimalBalanceRequiredToVote: fields.minimalBalanceRequiredToVote,
      expirationDate: fields.expirationDate,
      expirationBlockQuote: fields.expirationBlockQuote,
      options,
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
      MutationCreatePoll,
      MutationCreatePollVariables
    >({
      query: MUTATION_CREATE_POLL,
      variables: {
        input: {
          ...content,
          payload,
          signature,
        },
      },
    });

    if (errors) {
      throw new GraphQLError("Failed to create a poll", errors);
    }

    createSuccess({
      message: `Poll "${data.pollCreate.pollId}" created with success`,
      onClose: async () => {
        router.push({
          path: "/",
        });
      },
    });
  });

  return (
    <Page title="Create Poll">
      <h2 className="border-bottom">Create New Poll</h2>
      <Form className="mb-3" onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="title">Poll Title</Form.Label>
          <Form.Control
            id="title"
            name="title"
            type="text"
            placeholder="Poll Title..."
            value={fields.title}
            onChange={(e) =>
              setFields((fields) => ({
                ...fields,
                title: e.target.value,
              }))
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="description">Description</Form.Label>
          <Form.Control
            id="description"
            name="description"
            as="textarea"
            rows={3}
            placeholder="Description..."
            value={fields.description}
            onChange={(e) =>
              setFields((fields) => ({
                ...fields,
                description: e.target.value,
              }))
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="minimalBalanceRequiredToVote">
            Minimal Balance
          </Form.Label>
          <Form.Control
            id="minimalBalanceRequiredToVote"
            name="minimalBalanceRequiredToVote"
            type="number"
            placeholder="0.0"
            step="0.000001"
            min="0"
            value={fields.minimalBalanceRequiredToVote}
            onChange={(e) =>
              setFields((fields) => ({
                ...fields,
                minimalBalanceRequiredToVote: +e.target.value,
              }))
            }
          />
          <Form.Text className="text-muted">
            The minimal amount in Tezos (ꜩ) required to cast a vote, 0 to allow
            anyone.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="expirationDate">Expires at</Form.Label>
          <Form.Control
            id="expirationDate"
            name="expirationDate"
            type="datetime-local"
            value={parseDateToDateTimeLocalValue(fields.expirationDate)}
            onChange={(event) =>
              setFields((fields) => ({
                ...fields,
                expirationDate: parseDateTimeLocalValueToDate(
                  event.target.value
                ),
              }))
            }
          />
          <Form.Text className="text-muted">
            The max date to allow votes to be cast, leave it blank for no
            expiration.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="expirationBlockQuote">
            Expires at Block Quote
            {currentBlockQuote && ` (Current ${currentBlockQuote})`}
          </Form.Label>
          <Form.Control
            id="expirationBlockQuote"
            name="expirationBlockQuote"
            type="number"
            placeholder="0"
            step="1"
            min="0"
            value={fields.expirationBlockQuote || 0}
            onChange={(e) =>
              setFields((fields) => ({
                ...fields,
                expirationBlockQuote: +e.target.value ? +e.target.value : null,
              }))
            }
          />
          <Form.Text className="text-muted">
            The max block quote level allowed to votes to be casted, leave it 0
            to no expiration.
          </Form.Text>
        </Form.Group>
        <div className="mb-4">
          <h3 className="border-bottom">Options</h3>
          {fields.options.map((field, index) => (
            <Form.Group className="mb-3" key={index}>
              <Form.Label htmlFor="description">Option {index + 1}</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  id="description"
                  name="description"
                  type="text"
                  placeholder="Description..."
                  value={fields.options[index].description}
                  onChange={(e) => {
                    const newOption = { description: e.target.value };

                    const newOptions = [...fields.options];

                    newOptions[index] = newOption;

                    setFields((fields) => ({
                      ...fields,
                      options: newOptions,
                    }));
                  }}
                />
                <Button
                  variant="danger"
                  onClick={() =>
                    setFields((fields) => ({
                      ...fields,
                      options: [
                        ...fields.options.filter((_, i) => i !== index),
                      ],
                    }))
                  }
                >
                  Remove
                </Button>
              </div>
            </Form.Group>
          ))}
          <Button
            onClick={() =>
              setFields((fields) => ({
                ...fields,
                options: [...fields.options, { description: "" }],
              }))
            }
            type="button"
          >
            Add Option
          </Button>
        </div>
        <Button variant="primary" type="submit" disabled={submitLoading}>
          Create Poll
        </Button>
      </Form>
    </Page>
  );
};
