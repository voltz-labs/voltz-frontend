import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { verifySignature } from "@taquito/utils";

export interface ResultStateProps {
  verified: boolean;
}

export const VerifyPayload = () => {
  const [fields, setFields] = useState({
    publicKey: "",
    payload: "",
    signature: "",
  });
  const [result, setResult] = useState<ResultStateProps | null>(null);

  const verifyPayload = async (e: React.FormEvent) => {
    e.preventDefault();

    const verified = verifySignature(
      fields.payload,
      fields.publicKey,
      fields.signature
    );

    setResult({ verified });
  };

  return (
    <div>
      <Form className="mb-3" onSubmit={verifyPayload}>
        <h4 className="mb-3">Verify Payload Demo</h4>
        <Form.Group className="mb-2">
          <Form.Label htmlFor="publicKey">Public Key</Form.Label>
          <Form.Control
            id="publicKey"
            name="publicKey"
            type="text"
            placeholder="Public Key..."
            value={fields.publicKey}
            onChange={(e) =>
              setFields((fields) => ({
                ...fields,
                publicKey: e.target.value,
              }))
            }
          />
          <Form.Text className="text-muted">
            The public key of the wallet that signed the payload.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label htmlFor="payload">Payload</Form.Label>
          <Form.Control
            id="payload"
            name="payload"
            type="text"
            placeholder="Payload..."
            value={fields.payload}
            onChange={(e) =>
              setFields((fields) => ({
                ...fields,
                payload: e.target.value,
              }))
            }
          />
          <Form.Text className="text-muted">The hexbyte payload.</Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="signature">Signature</Form.Label>
          <Form.Control
            id="signature"
            name="signature"
            type="text"
            placeholder="Signature..."
            value={fields.signature}
            onChange={(e) =>
              setFields((fields) => ({
                ...fields,
                signature: e.target.value,
              }))
            }
          />
          <Form.Text className="text-muted">
            The signature of created by the wallet for the payload.
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          Verify Payload
        </Button>
      </Form>
      {result ? (
        <div className="my-3 p-3 bg-body rounded shadow-sm">
          <h6 className="border-bottom pb-2 mb-0">Result</h6>
          <div className="d-flex text-muted pt-3">
            <div className="pb-3 mb-0 small lh-sm w-100">
              <strong className="text-gray-dark">Verified?</strong>
              <span className="d-block text-break">
                {result.verified ? "Valid" : "Invalid"}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
