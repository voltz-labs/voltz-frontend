export class FormResubmitError extends Error {
  public name: "FormResubmitError";

  constructor(message: string) {
    super(message);

    this.name = "FormResubmitError";
  }
}
