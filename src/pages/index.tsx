/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Dashboard from "../components/dashboard";
import { Network, Alchemy } from "alchemy-sdk";
import { LOTTERY_CONTRACTADDRESS } from "../config";
import LOTTERYABI from "../../public/abi/LOTTERYABI.json";
const ethers = require("ethers");

const provider =
  typeof window !== "undefined" && window.ethereum
    ? new ethers.providers.Web3Provider(window.ethereum)
    : null;

const Home: NextPage = () => {
  const Signer = provider?.getSigner();
  const LOTTERYContract = new ethers.Contract(
    LOTTERY_CONTRACTADDRESS,
    LOTTERYABI,
    Signer
  );
  const config = {
    apiKey: "6Pt6yOldmFaJl7NqLNy05JPUegbk7Vr3",
    network: Network.MATIC_MAINNET,
  };
  const alchemy = new Alchemy(config);

  return (
    <main className="w-full flex items-center xl:h-[calc(100vh-175px)] h-[calc(100vh-135px)]">
      <Dashboard
        alchemy={alchemy}
        LOTTERYContract={LOTTERYContract}
      ></Dashboard>
    </main>
  );
};

export default Home;
