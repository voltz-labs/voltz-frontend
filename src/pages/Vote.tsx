import { Button, Form } from "react-bootstrap";
import { Fallback } from "../components/Fallback";
import { Navbar } from "../components/Navbar";
import { convertHexToString } from "../functions/convertHexToString";
import { gql } from "../functions/gql";
import { useQuery } from "../hooks/useQuery";
import { useRouter } from "../hooks/useRouter";
import { useSubmit } from "../hooks/useSubmit";
import { verifySignature } from "@taquito/utils";
import { useState } from "react";
import { Page } from "../components/Page";

export interface QueryVote {
  vote: {
    voteId: string;
    pollId: string;
    optionId: string;
    voterAddress: string;
    payload: string;
    signature: string;
    poll: {
      title: string;
    };
    option: {
      description: string;
    };
    voter: {
      address: string;
      publicKey: string;
    };
  };
}

export interface QueryVoteVariables {
  id: {
    voteId: string;
  };
}

export const QUERY_VOTE = gql`
  query ($id: VoteID!) {
    vote(id: $id) {
      voteId
      pollId
      optionId
      voterAddress
      payload
      signature
      poll {
        title
      }
      option {
        description
      }
      voter {
        address
        publicKey
      }
    }
  }
`;

export interface ResultStateProps {
  verified: boolean;
}

export const Vote = () => {
  const router = useRouter();

  const voteId = router.params.voteId!;

  const [result, setResult] = useState<ResultStateProps | null>(null);

  const { loading: submitLoading, submit } = useSubmit();

  const Q = useQuery<QueryVote, QueryVoteVariables>({
    query: QUERY_VOTE,
    variables: {
      id: {
        voteId,
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
    data: { vote },
  } = Q;

  const verifyPayload = submit(async () => {
    setResult(null);

    try {
      const verified = verifySignature(
        vote.payload,
        vote.voter.publicKey,
        vote.signature
      );
      setResult({ verified });
    } catch (err) {
      setResult({ verified: false });
    }
  });

  return (
    <Page title="Vote">
      <Form onSubmit={verifyPayload}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="poll">Poll Title</Form.Label>
          <Form.Control
            id="poll"
            name="poll"
            type="text"
            placeholder="Poll Title..."
            value={vote.poll.title}
            readOnly
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="option">Option</Form.Label>
          <Form.Control
            id="option"
            name="option"
            type="text"
            placeholder="Option..."
            value={vote.option.description}
            readOnly
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="voter">Voter</Form.Label>
          <Form.Control
            id="voter"
            name="voter"
            type="text"
            placeholder="Voter..."
            value={vote.voter.address}
            readOnly
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="publicKey">Voter Public Key</Form.Label>
          <Form.Control
            id="publicKey"
            name="publicKey"
            type="text"
            placeholder="Voter Public Key..."
            value={vote.voter.publicKey}
            readOnly
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="payload">Payload</Form.Label>
          <Form.Control
            id="payload"
            name="payload"
            type="text"
            placeholder="Payload..."
            value={vote.payload}
            readOnly
          />
          <Form.Text className="text-muted">
            {/^([0-9a-f]{2})+$/.test(vote.payload.slice(12))
              ? ` Decoded: ${convertHexToString(vote.payload.slice(12))}`
              : ""}
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="signature">Signature</Form.Label>
          <Form.Control
            id="signature"
            name="signature"
            type="text"
            placeholder="Signature..."
            value={vote.signature}
            readOnly
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={submitLoading}>
          Verify Signature
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
    </Page>
  );
};
