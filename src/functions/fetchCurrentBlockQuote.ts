import { TZKT_API_URL } from "../utils/constants";

export const fetchCurrentBlockQuote = async () => {
  const url = new URL(TZKT_API_URL);

  url.pathname = "/v1/blocks/count";

  const response = await fetch(url.toString());

  const data = await response.json();

  if (response.status !== 200) {
    throw new Error(
      `Failed to get current block quote with status ${
        response.status
      }. (${JSON.stringify(data)})`
    );
  }

  return data;
};
