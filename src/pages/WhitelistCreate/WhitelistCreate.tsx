import { useState } from "react";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import { Page } from "../../components/Page";
import { PageContainer } from "../../components/PageContainer";
import { PageTitle } from "../../components/PageTitle";
import { PageTitleText } from "../../components/PageTitleText";
import { gql } from "../../functions/gql";
import { graphql } from "../../functions/graphql";
import { useRouter } from "../../hooks/useRouter";
import { useSubmit } from "../../hooks/useSubmit";
import { useSuccess } from "../../hooks/useSuccess";
import { GraphQLError } from "../../utils/GraphQLError";

interface GraphQLMutationWhitelistCreate {
  whitelistCreate: {
    userAddress: string;
  };
}

interface GraphQLMutationWhitelistCreateVariables {
  input: {
    userAddress: string;
  };
}

const GRAPHQL_MUTATION_WHITELIST_CREATE = gql`
  mutation ($input: WhitelistCreateInput!) {
    whitelistCreate(input: $input) {
      userAddress
    }
  }
`;

export const WhitelistCreate = () => {
  const [fields, setFields] = useState({ userAddress: "" });

  const { loading, submit } = useSubmit();

  const { createSuccess } = useSuccess();

  const router = useRouter();

  const onSubmit = submit(async () => {
    const { data, errors } = await graphql<
      GraphQLMutationWhitelistCreate,
      GraphQLMutationWhitelistCreateVariables
    >({
      query: GRAPHQL_MUTATION_WHITELIST_CREATE,
      variables: {
        input: {
          userAddress: fields.userAddress,
        },
      },
    });

    if (errors) {
      throw new GraphQLError("Failed to create whitelist", errors);
    }

    createSuccess({
      message: `Whitelist address create with success for ${data.whitelistCreate.userAddress}`,
      onClose: async () => {
        router.push({
          path: "/whitelists",
        });
      },
    });
  });

  return (
    <Page title="Whitelist Create">
      <PageTitle>
        <PageTitleText>Create Whitelist</PageTitleText>
      </PageTitle>
      <PageContainer>
        <Form onSubmit={onSubmit}>
          <FormGroup className="mb-3">
            <FormLabel htmlFor="userAddress">User Address</FormLabel>
            <FormControl
              id="userAddress"
              name="userAddress"
              type="text"
              placeholder="User Address..."
              value={fields.userAddress}
              onChange={(e) =>
                setFields((fields) => ({
                  ...fields,
                  userAddress: e.target.value,
                }))
              }
            />
          </FormGroup>
          <Button variant="primary" type="submit" disabled={loading}>
            Create
          </Button>
        </Form>
      </PageContainer>
    </Page>
  );
};
