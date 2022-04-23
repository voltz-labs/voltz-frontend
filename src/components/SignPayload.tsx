import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { convertStringToHex } from "../functions/convertStringToHex";
import { UserProps } from "../models/User";
import {
  BYTE_INDICATOR_HEX_BYTE_STRING,
  BYTE_INDICATOR_MICHELINE_EXPRESSION,
} from "../utils/constants";
import { wallet } from "../utils/wallet";
import { SigningType } from "@airgap/beacon-sdk";
import { convertNumberToHex } from "../functions/convertNumberToHex";

export interface SignPayloadProps {
  user: UserProps;
}

export interface ResultStateProps {
  payload: string;
  signature: string;
}

export const SignPayload = ({ user }: SignPayloadProps) => {
  const [fields, setFields] = useState({
    message: "",
  });
  const [result, setResult] = useState<ResultStateProps | null>(null);

  const signPayload = async (e: React.FormEvent) => {
    e.preventDefault();

    const bytes = convertStringToHex(fields.message);

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

    setResult({ payload, signature });
  };

  return (
    <div>
      <h4 className="mb-3">Sign Payload Demo</h4>
      <Form className="mb-3" onSubmit={signPayload}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="message">Message Payload</Form.Label>
          <Form.Control
            id="message"
            name="message"
            type="text"
            placeholder="Message Payload..."
            value={fields.message}
            onChange={(e) =>
              setFields((fields) => ({
                ...fields,
                message: e.target.value,
              }))
            }
          />
          <Form.Text className="text-muted">
            The message that will be sent to your wallet to be signed.
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          Sign Payload
        </Button>
      </Form>
      {result ? (
        <div className="my-3 p-3 bg-body rounded shadow-sm">
          <h6 className="border-bottom pb-2 mb-0">Result</h6>
          <div className="d-flex text-muted pt-3">
            <div className="pb-3 mb-0 small lh-sm w-100">
              <strong className="text-gray-dark">Address</strong>
              <span className="d-block text-break">{user.address}</span>
            </div>
          </div>
          <div className="d-flex text-muted pt-3">
            <div className="pb-3 mb-0 small lh-sm w-100">
              <strong className="text-gray-dark">Public Key</strong>
              <span className="d-block text-break">{user.publicKey}</span>
            </div>
          </div>
          <div className="d-flex text-muted pt-3">
            <div className="pb-3 mb-0 small lh-sm w-100">
              <strong className="text-gray-dark">Payload</strong>
              <span className="d-block text-break">{result.payload}</span>
            </div>
          </div>
          <div className="d-flex text-muted pt-3">
            <div className="pb-3 mb-0 small lh-sm w-100">
              <strong className="text-gray-dark">Signature</strong>
              <span className="d-block text-break">{result.signature}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
