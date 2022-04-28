import { AuthContextProvider } from "./contexts/AuthContext";
import { ConfirmContextProvider } from "./contexts/ConfirmContext";
import { ExceptionContextProvider } from "./contexts/ExceptionContext";
import { SuccessContextProvider } from "./contexts/SuccessContext";
import { HelmetProvider } from "react-helmet-async";
import { Router } from "./Router";

export const App = () => {
  return (
    <HelmetProvider>
      <ExceptionContextProvider>
        <ConfirmContextProvider>
          <SuccessContextProvider>
            <AuthContextProvider>
              <Router />
            </AuthContextProvider>
          </SuccessContextProvider>
        </ConfirmContextProvider>
      </ExceptionContextProvider>
    </HelmetProvider>
  );
};
