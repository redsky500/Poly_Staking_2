const switchNetworkRequest = () =>
  (window as any).ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x1" }],
  });

const addNetworkRequest = () =>
  (window as any).ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "0x1",
        chainName: "ethereum mainnet",
        rpcUrls: ["https://mainnet.infura.io/v3/"],
        blockExplorerUrls: ["https://etherscan.io"],
        nativeCurrency: {
          name: "eth",
          symbol: "ETH",
          decimals: 16,
        },
      },
    ],
  });

export const switchNetwork = async () => {
  if (window as any) {
    try {
      await switchNetworkRequest();
    } catch (error) {
      if ((error as any).code === 4902) {
        try {
          await addNetworkRequest();
          await switchNetworkRequest();
        } catch (addError) {
          console.log(error);
        }
      }
      console.log(error);
    }
  }
};
