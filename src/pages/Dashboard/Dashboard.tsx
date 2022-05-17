import { useUser } from "../../hooks/useUser";
import { DashboardNotWhitelisted } from "./DashboardNotWhitelisted";
import { DashboardWhitelisted } from "./DashboardWhitelisted";

export const Dashboard = () => {
  const { user } = useUser();

  return user.isWhitelisted ? (
    <DashboardWhitelisted />
  ) : (
    <DashboardNotWhitelisted />
  );
};
