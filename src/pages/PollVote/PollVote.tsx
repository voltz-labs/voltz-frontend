import { Button, Form } from "react-bootstrap";
import { Fallback } from "../../components/Fallback";
import { nanoid } from "../../functions/nanoid";
import { useRouter } from "../../hooks/useRouter";
import { UserProps } from "../../models/User";
import { useState } from "react";
import { useSubmit } from "../../hooks/useSubmit";
import { GraphQLError } from "../../utils/GraphQLError";
import { useSuccess } from "../../hooks/useSuccess";
import { downloadAsJson } from "../../functions/downloadAsJson";
import { Page } from "../../components/Page";
import { useQueryPollVote } from "./hooks/useQueryPollVote";
import { PageTitle } from "../../components/PageTitle";
import { PageTitleText } from "../../components/PageTitleText";
import { signContent } from "../../functions/signContent";
import { createVote } from "./functions/createVote";

export interface PollProps {
  user: UserProps;
}

export const PollVote = ({ user }: PollProps) => {
  const { params } = useRouter();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const router = useRouter();

  const { loading: submitLoading, submit } = useSubmit();

  const { createSuccess } = useSuccess();

  const pollId = params.pollId!;

  const Q = useQueryPollVote({
    id: {
      pollId,
    },
  });

  if (Q.fallback) {
    return (
      <Page title="Poll Vote">
        <Fallback loading={Q.loading} errors={Q.errors} />
      </Page>
    );
  }

  const {
    data: {
      poll: { ...poll },
    },
  } = Q;

  const vote = (optionId: string) =>
    submit(async () => {
      const voteId = nanoid();

      const content = {
        voteId,
        pollId: poll.pollId,
        optionId,
        voterAddress: user.address,
      };

      const { payload, signature } = await signContent(content, user.address);

      const { data, errors } = await createVote({
        input: {
          ...content,
          payload,
          signature,
        },
      });

      if (errors) {
        throw new GraphQLError("Failed to vote", errors);
      }

      createSuccess({
        message: `Vote "${data.voteCreate.voteId}" cast with success`,
        onClose: async () => {
          downloadAsJson(data.voteCreate.voteId + ".json", {
            voteId: data.voteCreate.voteId,
            content,
            payload,
            signature,
          });
          router.push({
            path: "/",
          });
        },
      });
    });

  return (
    <Page title="Poll">
      <PageTitle>
        <PageTitleText>{poll.title}</PageTitleText>
      </PageTitle>
      <Form onSubmit={selectedOption ? vote(selectedOption) : undefined}>
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
    </Page>
  );
};
