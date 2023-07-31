import type { NextPage } from "next";
import Dashboard from "../components/dashboard";

const Home: NextPage = () => {
  return (
    <main className="w-full flex items-center xl:h-[calc(100vh-175px)] h-[calc(100vh-135px)]">
      <Dashboard></Dashboard>
    </main>
  );
};

export default Home;
