import { Navbar } from "../components/Navbar";
import { Loading as LoadingComponent } from "../components/Loading";

export const Loading = () => {
  return (
    <div>
      <Navbar />
      <LoadingComponent />
    </div>
  );
};
