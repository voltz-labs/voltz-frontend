import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";
import { Polls } from "./pages/Polls";
import { Poll } from "./pages/Poll";
import { CreatePoll } from "./pages/CreatePoll";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/polls" element={<Polls />} />
        <Route path="/polls/new" element={<CreatePoll />} />
        <Route path="/polls/:id" element={<Poll />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
