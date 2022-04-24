import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Navbar } from "../components/Navbar";
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
import { GraphQLError } from "./GraphQLError";
import { useRouter } from "../hooks/useRouter";

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
    options: [
      {
        description: "",
      },
    ],
  });

  const { loading: submitLoading, submit } = useSubmit();

  const { createSuccess } = useSuccess();

  const router = useRouter();

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
    <div>
      <Navbar />
      <Container className="py-5">
        <h2 className="border-bottom">Create New Poll</h2>
        <Form className="mb-3" onSubmit={onSubmit()}>
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
          <div className="mb-4">
            <h3 className="border-bottom">Options</h3>
            {fields.options.map((field, index) => (
              <Form.Group className="mb-3" key={index}>
                <Form.Label htmlFor="description">
                  Option {index + 1}
                </Form.Label>
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
      </Container>
    </div>
  );
};
