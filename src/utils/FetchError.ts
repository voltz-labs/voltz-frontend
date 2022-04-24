export type ResponseData =
  | ResponseDataJSON
  | ResponseDataText
  | ResponseDataEmpty;

export interface ResponseDataJSON {
  type: "application/json";
  body: Record<string, any>;
}

export interface ResponseDataText {
  type: "plain";
  body: string;
}

export interface ResponseDataEmpty {
  type: "empty";
}

export class FetchError extends Error {
  public name: "FetchError";
  public status: number;
  public data: ResponseData;

  private static async getResponseData(
    response: Response
  ): Promise<ResponseData> {
    const contentType =
      response.headers.get("content-type") ||
      response.headers.get("Content-Type");

    if (!contentType) {
      return {
        type: "empty",
      };
    }

    if (contentType.includes("application/json")) {
      const body = await response.json();

      return {
        type: "application/json",
        body,
      };
    }

    const body = await response.text();

    return {
      type: "plain",
      body,
    };
  }

  public static async create(response: Response): Promise<FetchError> {
    const data = await FetchError.getResponseData(response);

    return new FetchError(response, data);
  }

  constructor(response: Response, data: ResponseData) {
    let message = `FetchError: Falha ao requisitar "${response.url}" com status "${response.status}".`;

    if (data.type === "application/json") {
      if (data.body.message) {
        message = data.body.message;
      } else {
        message += `\n${JSON.stringify(data.body, null, 2)}`;
      }
    } else if (data.type === "plain") {
      message += `\n${data.body}`;
    }

    super(message);

    this.name = "FetchError";
    this.status = response.status;
    this.data = data;
  }
}
