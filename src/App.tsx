import { AuthContextProvider } from "./contexts/AuthContext";
import { Router } from "./Router";

export const App = () => {
  return (
    <AuthContextProvider>
      <Router />
    </AuthContextProvider>
  );
};
