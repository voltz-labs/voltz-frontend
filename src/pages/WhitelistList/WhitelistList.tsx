import { Badge, Button, Table } from "react-bootstrap";
import { Page } from "../../components/Page";
import { PageContainer } from "../../components/PageContainer";
import { PageFallback } from "../../components/PageFallback";
import { PageTitle } from "../../components/PageTitle";
import { PageTitleText } from "../../components/PageTitleText";
import { gql } from "../../functions/gql";
import { graphql } from "../../functions/graphql";
import { useConfirm } from "../../hooks/useConfirm";
import { GraphQLError } from "../../utils/GraphQLError";
import { useQueryWhitelists } from "./hooks/useQueryWhitelists";

export const WhitelistList = () => {
  const { createConfirm } = useConfirm();

  const Q = useQueryWhitelists();

  if (Q.fallback) {
    return (
      <PageFallback title="Whitelists" errors={Q.errors} loading={Q.loading} />
    );
  }

  const {
    data: { whitelists },
    refetch,
  } = Q;

  const createOnDelete = (userAddress: string) => () => {
    createConfirm({
      message: "Are you sure you want to remove user address from whitelist?",
      onClose: async () => {},
      onConfirm: async () => {
        const { errors } = await graphql({
          query: gql`
            mutation ($input: WhitelistDeleteInput!) {
              whitelistDelete(input: $input) {
                userAddress
              }
            }
          `,
          variables: {
            input: {
              userAddress,
            },
          },
        });

        if (errors) {
          throw new GraphQLError("Failed to remove whitelist", errors);
        }

        refetch();
      },
    });
  };

  return (
    <Page title="Whitelists">
      <PageTitle>
        <PageTitleText>Whitelists</PageTitleText>
      </PageTitle>
      <PageContainer>
        <Table hover responsive>
          <thead>
            <tr>
              <th>User Address</th>
              <th>Is Admin?</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {whitelists.items.map((whitelist) => (
              <tr key={whitelist.userAddress}>
                <td>{whitelist.userAddress}</td>
                <td>
                  {whitelist.isAdmin ? (
                    <Badge bg="primary">Yes</Badge>
                  ) : (
                    <Badge bg="secondary">No</Badge>
                  )}
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={createOnDelete(whitelist.userAddress)}
                    disabled={whitelist.isAdmin}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </PageContainer>
    </Page>
  );
};
