import { ToastContainer } from "react-toastify";
import { Web3ReactProvider } from "@web3-react/core";
import { motion } from "framer-motion";
import { rainbowConnectors, connectProvider, tokenChains } from "../connecthook/connect"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createClient, WagmiConfig } from "wagmi";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/style.scss";
import "@rainbow-me/rainbowkit/styles.css";

function StakingApp({ Component, pageProps }) {
  const connectors = rainbowConnectors
  const provider = connectProvider

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.9, delay: 0.2 }}
    >
      <Web3ReactProvider>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={tokenChains}>
            <Header />
            <Component {...pageProps} />
            <ToastContainer style={{ fontSize: 14 }} />
            <Footer />
          </RainbowKitProvider>
        </WagmiConfig>
      </Web3ReactProvider>
    </motion.section>
  );
}

export default StakingApp;
