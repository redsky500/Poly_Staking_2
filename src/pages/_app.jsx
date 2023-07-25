import { ToastContainer } from "react-toastify";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { LOTTERY_CONTRACTADDRESS } from "../config";
import LOTTERYABI from "../../public/abi/LOTTERYABI.json";
import {
  polygon,
} from "wagmi/chains";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/style.scss";
import "@rainbow-me/rainbowkit/styles.css";
import React from "react";

const appProvider =
  typeof window !== "undefined" && window?.ethereum
    ? new ethers.providers.Web3Provider(window.ethereum)
    : null;

function StakingApp({ Component, pageProps }) {
  const { chains, provider } = configureChains(
    [
      polygon,
    ],
    [
      alchemyProvider({ apiKey: "A2lxdLrej8vanUUK4wAY3pniny2FEL5L" }),
      publicProvider(),
    ]
  );
  const { connectors } = getDefaultWallets({
    appName: "poly_staking",
    projectId: "1c51f2d9d7c80d3498ff852fcf8ac825",
    chains,
  });
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });
  const Signer = appProvider?.getSigner();
  const LOTTERYContract = new ethers.Contract(
    LOTTERY_CONTRACTADDRESS,
    LOTTERYABI,
    Signer
  );

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.9, delay: 0.2 }}
    >
      <Web3ReactProvider>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <Header />
            <Component {...pageProps} LOTTERYContract={LOTTERYContract} />
            <ToastContainer style={{ fontSize: 14 }} />
            <Footer />
          </RainbowKitProvider>
        </WagmiConfig>
      </Web3ReactProvider>
    </motion.section>
  );
}

export default StakingApp;
