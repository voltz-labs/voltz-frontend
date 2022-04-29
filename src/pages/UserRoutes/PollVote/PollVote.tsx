import { Button, Form } from "react-bootstrap";
import { Fallback } from "../../../components/Fallback";
import { nanoid } from "../../../functions/nanoid";
import { useRouter } from "../../../hooks/useRouter";
import { useState } from "react";
import { useSubmit } from "../../../hooks/useSubmit";
import { GraphQLError } from "../../../utils/GraphQLError";
import { useSuccess } from "../../../hooks/useSuccess";
import { downloadAsJson } from "../../../functions/downloadAsJson";
import { Page } from "../../../components/Page";
import { useQueryPollVote } from "./hooks/useQueryPollVote";
import { PageTitle } from "../../../components/PageTitle";
import { PageTitleText } from "../../../components/PageTitleText";
import { signContent } from "../../../functions/signContent";
import { createVote } from "./functions/createVote";
import { useUser } from "../../../hooks/useUser";

export const PollVote = () => {
  const { params } = useRouter();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const router = useRouter();

  const { loading: submitLoading, submit } = useSubmit();

  const { createSuccess } = useSuccess();

  const { user } = useUser();

  const pollId = params.pollId!;

  const Q = useQueryPollVote({
    id: {
      pollId,
    },
    input: {
      voterAddress: user.address,
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
      {poll.votedOption || poll.expired ? (
        <ul>
          {poll.options.map((option) => {
            const optionResult = poll.results.voteResults.find(
              (result) => result.optionId === option.optionId
            );

            let percentage: number;
            let voteNumber: number;
            if (poll.results.voteCount > 0) {
              voteNumber = optionResult?.voteCount || 0;
              percentage = voteNumber / poll.results.voteCount;
            } else {
              voteNumber = 0;
              percentage = 0;
            }

            return (
              <li key={option.optionId}>
                {option.description}
                {poll.votedOption?.optionId === option.optionId ? "✓" : ""}
                {optionResult
                  ? ` ${percentage * 100}% (${voteNumber} vote${
                      voteNumber === 1 ? "" : "s"
                    })`
                  : ""}
              </li>
            );
          })}
        </ul>
      ) : (
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
      )}
    </Page>
  );
};
