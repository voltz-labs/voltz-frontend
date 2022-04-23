export const parseQuery = (queryString: string) => {
  const search = new URLSearchParams(queryString);

  const query: Record<string, string> = {};

  for (const key of Array.from(search.keys())) {
    const item = search.get(key);

    if (item) {
      query[key] = item;
    }
  }

  return query;
};
