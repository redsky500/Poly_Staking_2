import { useEffect, useState, useCallback } from "react";
import { useLatestContract } from "../custom-hooks/update-provider";
import { useAccount, useNetwork } from "wagmi";
import MintCards from "./MintCards";
import { errorToast, successToast } from "../services/toast-service";
import Loader from "react-spinners/HashLoader";
import Tab from "./tab";
import CustomButton from "./CustomButton";
import { gasLimit } from "../config";
import { alchemyConnect } from "../connecthook/connect";
const BigNumber = require("bignumber.js");

const loader = (
  <div className="flex items-center justify-center w-full">
    <Loader color={"white"} />
  </div>
);
const itemsPerPage = 50;
let currentPage = 1;
const filterContract = "0xA7807d70E0574249b0BF945698dbeCB60768d13b";

const Dashboard = () => {
  const { address: account } = useAccount();
  const [userNFTs, setUserNFTs] = useState([]);
  const [pageLoad, setPageLoad] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMoreButtonProcessing, setIsMoreButtonProcessing] = useState(false);
  const [isStakeAllProcessing, setIsStakeAllProcessing] = useState(false);
  const [isUnstakeAllProcessing, setIsUnstakeAllProcessing] = useState(false);
  const [isClaimAllProcessing, setIsClaimAllProcessing] = useState(false);
  const [paginationNFT, setMintCards] = useState<any[]>([]);
  const [reward, setReward] = useState<any>(null);
  const [bgStyle, setBgStyle] = useState("");
  const { chain } = useNetwork();
  const { readStake, readAmount, fee, stake, unstake, claimAll } = useLatestContract();

  useEffect(() => {
    const networkName = chain?.name;
    setBgStyle("wolf-image");

    if (!account) {
      setIsLoggedIn(false);
      setUserNFTs([]);
      return;
    }

    if (networkName && networkName !== "Polygon") {
      setIsLoggedIn(false);
      errorToast("Please connect to Polygon net");
      return;
    }

    if (networkName == "Polygon" && account) {
      setBgStyle("");
      initialSyncFunction();
    }
  }, [account, setUserNFTs, chain?.name]);

  useEffect(() => {
    const interval = setInterval(async () => {
      getRewardPrize();
    }, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const initialSyncFunction = async () => {
    setPageLoad(true);
    const getNFTs = await filteredNFTs(account!);
    const matchedNFTs = getNFTs.ownedNfts.filter(
      (item: any) =>
        item.contract?.address?.toLowerCase() == filterContract.toLowerCase()
    );
    const convertedAllNFTs: any = [];
    if (matchedNFTs?.length) {
      matchedNFTs.map(async (item: any, index: number) => {
        const image = item?.rawMetadata?.image?.includes("ipfs://")
          ? item?.rawMetadata?.image?.replace(
            "ipfs://",
            "https://ipfs.io/ipfs/"
          )
          : item?.rawMetadata?.image;
        const isStaked = await readStake(item.tokenId);
        convertedAllNFTs.push({
          tokenId: item.tokenId,
          image,
          isStaked,
        });
        if (matchedNFTs.length - 1 == index) {
          setUserNFTs(convertedAllNFTs);
          handleTabs("tab-1", convertedAllNFTs);
        }
      });
    } else {
      setPageLoad(false);
    }
  };

  const filteredNFTs = useCallback(async (account: string) => {
    const items = await alchemyConnect.nft.getNftsForOwner(account, { contractAddresses: [filterContract] });
    return items;
  }, []);

  const paginate = (items: any, itemsPerPage: number, currentPage: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);
    return paginatedItems;
  };

  const updatePagination = (items: any, currentTab: boolean = false) => {
    const paginatedItems = paginate(items, itemsPerPage, currentPage);
    const combinedFilteredNFTs = currentTab ? [...paginationNFT, ...paginatedItems] : paginatedItems
    setMintCards(combinedFilteredNFTs);
  };

  const handleNFTPagination = () => {
    setIsMoreButtonProcessing(true);
    const totalPages = Math.ceil(userNFTs.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      updatePagination(userNFTs, true);
    } else {
      errorToast(`You have total ${userNFTs.length} NFTs`);
    }
    setIsMoreButtonProcessing(false);
  };

  const handleTabs = async (currentTab: string, allNFTs: any = []) => {
    const userAllNFTs = allNFTs?.length ? allNFTs : userNFTs;
    const handledNFTs = userAllNFTs.filter((item: any) => {
      return currentTab == "tab-1" ? !item.isStaked : item.isStaked;
    });
    updatePagination(handledNFTs, false);
    setPageLoad(false);
    setIsLoggedIn(true);
    if (currentTab == "tab-2") {
      getRewardPrize();
    }
  };

  const getRewardPrize = async () => {
    const allRewardNFTPrize = userNFTs
      .filter((item: any) => item.isStaked)
      .map((item: any) => item.tokenId);
    if (allRewardNFTPrize && allRewardNFTPrize?.length) {
      const currentReward = await readAmount(allRewardNFTPrize);
      const etherValue = new BigNumber(currentReward.toString())
        .dividedBy(new BigNumber("1e18"))
        .toString();

      setReward(Number(etherValue).toFixed(3));
    }
  };

  const handleStakeAll = async () => {
    setIsStakeAllProcessing(true);
    const allStakeNFT = userNFTs.filter((item: any) => !item.isStaked).map((item: any) => item.tokenId);
    const contractFee = await fee();

    stake(allStakeNFT, {
      from: account,
      value: contractFee.toString(),
      gasLimit: 6000000,
      nonce: undefined,
    })
      .then((res: any) => {
        res
          .wait()
          .then(() => {
            initialSyncFunction();
            setIsStakeAllProcessing(false);
          })
          .catch((error: any) => {
            debugger;
            errorToast("transaction failed!");
            setIsStakeAllProcessing(false);
          });
      })
      .catch(() => {
        errorToast("Stake contract went wrong!");
        setIsStakeAllProcessing(false);
      });
  };

  const handleUnstakeAll = () => {
    setIsUnstakeAllProcessing(true);
    const allStakeNFT = userNFTs
      .filter((item: any) => item.isStaked)
      .map((item: any) => item.tokenId);

    unstake(allStakeNFT, {
      gasLimit,
      nonce: undefined,
    })
      .then((res: any) => {
        res
          .wait()
          .then(() => {
            initialSyncFunction();
            setIsUnstakeAllProcessing(false);
            successToast("Unstaked All successfully");
          })
          .catch(() => {
            setIsUnstakeAllProcessing(false);
            errorToast(
              "Something wrong with the transaction. Unstake All didn't transferred"
            );
          });
      })
      .catch(() => {
        setIsUnstakeAllProcessing(false);
        errorToast(
          "Something wrong with the contract. Unstake All not working"
        );
      });
  };

  const handleClaimAll = () => {
    setIsClaimAllProcessing(true);
    const allStakeNFT = userNFTs
      .filter((item: any) => item.isStaked)
      .map((item: any) => item.tokenId);

    claimAll(allStakeNFT, {
      gasLimit,
      nonce: undefined,
    })
      .then((res: any) => {
        res
          .wait()
          .then(() => {
            initialSyncFunction();
            setIsClaimAllProcessing(false);
            successToast("Claim all successfully");
          })
          .catch(() => {
            setIsClaimAllProcessing(false);
            errorToast(
              "Something wrong with the transaction. Claim All didn't transferred"
            );
          });
      })
      .catch(() => {
        setIsClaimAllProcessing(false);
        errorToast("Something wrong with the contract. Claim All not working");
      });
  };

  return (
    <>
      {pageLoad ? (
        loader
      ) : (
        <div
          className={`${bgStyle} w-full h-full overflow-auto px-4 sm:px-16 py-8 font-inter text-center text-[20px]`}
        >
          <div className="max-w-[1440px] xl:flex flex-col sm:p-10 p-0 m-auto mt-0 min-h-full">
            <div className="flex flex-wrap justify-center items-center xl:w-full gap-[20px] px-[16px]">
              {!isLoggedIn && (
                <div className="dashboard-content-wrapper">
                  <div className="meta-wolf-wrapper text-left">
                    <span>Metaland</span>
                    <br />
                    <span>Wolfpack</span>
                  </div>
                  <div className="mt-5">
                    <p className="wolf-para text-left">
                      Welcome to Metaland Wolfpacks staking platform powered by
                      Juice Vendor Labs. Connect your wallet and stake your MWP
                      NFTs for $WOLF. $WOLF can be used for various ecosystem
                      benefits!
                    </p>
                  </div>
                </div>
              )}
              {isLoggedIn && (
                <Tab
                  NFTCards={paginationNFT.map((mint: any) => (
                    <MintCards
                      key={mint.tokenId}
                      userNFT={mint}
                      initialSyncFunction={initialSyncFunction}
                    />
                  ))}
                  moreButton={
                    userNFTs.length > 0 && (
                      <CustomButton
                        handleClickEvent={handleNFTPagination}
                        isProcessing={isMoreButtonProcessing}
                        text={"More"}
                      />
                    )
                  }
                  handleTabs={handleTabs}
                  handleStakeAll={
                    <div className="w-[150px] mx-auto mb-[25px]">
                      <CustomButton
                        handleClickEvent={handleStakeAll}
                        isProcessing={isStakeAllProcessing}
                        text={"Stake All"}
                      />
                    </div>
                  }
                  handleUnstakeAll={
                    <div className="w-full lg:justify-between flex justify-center items-center flex-wrap gap-[30px] mb-[25px]">
                      <div className="w-[250px]">
                        <CustomButton
                          handleClickEvent={handleUnstakeAll}
                          isProcessing={isUnstakeAllProcessing}
                          text={"Unstake All"}
                        />
                      </div>
                      <div className="w-[150px] text-white">
                        Reward: {reward}
                      </div>
                      <div className="w-[250px]">
                        <CustomButton
                          handleClickEvent={handleClaimAll}
                          isProcessing={isClaimAllProcessing}
                          text={"Claim All"}
                        />
                      </div>
                    </div>
                  }
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
