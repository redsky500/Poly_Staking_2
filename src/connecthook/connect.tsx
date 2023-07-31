import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { Alchemy, Network } from "alchemy-sdk";
import { configureChains, goerli } from "wagmi";
import { polygon } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const config = {
  apiKey: "A2lxdLrej8vanUUK4wAY3pniny2FEL5L",
  network: Network.MATIC_MAINNET,
};

const { chains, provider } = configureChains(
  [polygon],
  [
    alchemyProvider({
      apiKey: "A2lxdLrej8vanUUK4wAY3pniny2FEL5L",
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "poly_staking",
  projectId: "1c51f2d9d7c80d3498ff852fcf8ac825",
  chains,
});

const alchemy = new Alchemy(config);

export const alchemyConnect = alchemy;
export const rainbowConnectors = connectors;
export const tokenChains = chains;
export const connectProvider = provider;
