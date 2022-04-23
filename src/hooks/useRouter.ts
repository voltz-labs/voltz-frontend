import { useParams } from "react-router";
import { useLocation, useNavigate } from "react-router";
import { parseQuery } from "../functions/parseQuery";

export interface NavigateProps {
  path: string;
  query?: Record<string, string | undefined>;
  state?: any;
}

export interface SetLocationProps extends NavigateProps {
  replace: boolean;
}

export const useRouter = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const query = parseQuery(location.search);

  const params = useParams();

  const setLocation = ({ path, query, state, replace }: SetLocationProps) => {
    const newSearch = new URLSearchParams();

    if (query) {
      for (const key of Object.keys(query)) {
        const value = query[key];

        if (value) {
          newSearch.set(key, value);
        }
      }
    }

    const pathname = `${path}?${newSearch.toString()}`;

    navigate(pathname, { replace, state });
  };

  const push = ({ path, query, state }: NavigateProps) =>
    setLocation({ path, query, state, replace: false });

  const replace = ({ path, query, state }: NavigateProps) =>
    setLocation({ path, query, state, replace: true });

  return {
    path: location.pathname,
    query,
    params,
    state: location.state,
    push,
    replace,
  };
};
