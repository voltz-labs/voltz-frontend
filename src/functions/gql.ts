export const gql = (literals: string | readonly string[]) => {
  if (typeof literals === "string") {
    literals = [literals];
  }

  return literals[0];
};
