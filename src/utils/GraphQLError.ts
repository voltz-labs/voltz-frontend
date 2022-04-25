export class GraphQLError extends Error {
  public name: "GraphQLError";
  public errors: Error[];

  constructor(message: string, errors: Error[]) {
    const _message =
      message + "\n" + errors.map((error) => error.message).join("\n");

    super(_message);

    this.name = "GraphQLError";
    this.errors = errors;
  }
}
