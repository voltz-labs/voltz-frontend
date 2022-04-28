import { Navbar } from "../components/Navbar";
import { Col, Container, Row } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import { SignPayload } from "../components/SignPayload";
import { VerifyPayload } from "../components/VerifyPayload";
import { RecentPolls } from "../components/RecentPolls";
import { gql } from "../functions/gql";
import { useQuery } from "../hooks/useQuery";
import { Fallback } from "../components/Fallback";
import { RecentVotes } from "../components/RecentVotes";

export interface QueryDashboard {
  polls: {
    totalCount: number;
    items: {
      pollId: string;
      title: string;
      description: string;
      creator: {
        address: string;
      };
      options: {
        optionId: string;
        description: string;
      }[];
      expired: boolean;
    }[];
  };
  votes: {
    items: {
      voteId: string;
      poll: {
        title: string;
      };
      option: {
        description: string;
      };
      voter: {
        address: string;
      };
    }[];
  };
}

export const QUERY_DASHBOARD = gql`
  query {
    polls {
      items {
        pollId
        title
        description
        creator {
          address
        }
        options {
          optionId
          description
        }
        expired
      }
    }
    votes {
      items {
        voteId
        poll {
          title
        }
        option {
          description
        }
        voter {
          address
        }
      }
    }
  }
`;

export const Dashboard = () => {
  const { user } = useAuth();

  const Q = useQuery<QueryDashboard>({
    query: QUERY_DASHBOARD,
  });

  if (Q.fallback) {
    return (
      <div>
        <Navbar />

        <Fallback loading={Q.loading} errors={Q.errors} />
      </div>
    );
  }

  const { data } = Q;

  return (
    <div>
      <Navbar />
      <Container className="py-5">
        {user ? (
          <div className="d-none">
            <h1 className="pb-2 mb-3 border-bottom">Voltz Demo</h1>
            <Row>
              <Col>
                <SignPayload user={user} />
              </Col>
              <Col>
                <VerifyPayload />
              </Col>
            </Row>
          </div>
        ) : null}
        <RecentPolls polls={data.polls.items} />
        <RecentVotes votes={data.votes.items} />
      </Container>
    </div>
  );
};
