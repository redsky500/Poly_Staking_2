/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { errorToast, successToast } from "../services/toast-service";
import { gasLimit } from "../config";
import CustomButton from "./CustomButton";
import { useLatestContract } from "../custom-hooks/update-provider";
const BigNumber = require("bignumber.js");

const MintCards = ({ userNFT, initialSyncFunction }: any) => {
  const { address: account } = useAccount();
  const [isStake, setIsStake] = useState<any>(null);
  const [reward, setReward] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { readStake, stake, fee, unstake, getDailyReward } =
    useLatestContract();

  useEffect(() => {
    if (!account) {
      return;
    }
    initialSyncFunc();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setIsStake, account]);

  const initialSyncFunc = async () => {
    const isStake = await readStake(userNFT.tokenId);
    setIsStake(isStake);
    if (isStake) {
      const contractReward = await getDailyReward(userNFT.tokenId);
      const etherValue = new BigNumber(contractReward.toString())
        .dividedBy(new BigNumber("1e18"))
        .toString();
      const currentReward = etherValue / 24;
      setReward(Number(currentReward).toFixed(3));
    } else {
      setReward("Not staked");
    }
  };

  const handleStake = async () => {
    setIsProcessing(true);
    const contractFee = await fee();
    stake([userNFT.tokenId], {
      from: account,
      value: contractFee.toString(),
      gasLimit,
      nonce: undefined,
    })
      .then((res: any) => {
        res
          .wait()
          .then((item: any) => {
            successToast("Stake NFT successfully!");
            setIsStake(true);
            setIsProcessing(false);
            setReward("0.000");
            initialSyncFunction();
          })
          .catch((err: any) => {
            errorToast("transaction failed!");
            setIsProcessing(false);
          });
      })
      .catch((err: any) => {
        errorToast("Stake contract went wrong!");
        setIsProcessing(false);
      });
  };

  const handleUnstake = () => {
    setIsProcessing(true);
    unstake([userNFT.tokenId], {
      gasLimit,
      nonce: undefined,
    })
      .then((res: any) => {
        res
          .wait()
          .then((item: any) => {
            successToast("Unstake NFT successfully!");
            setIsStake(false);
            setIsProcessing(false);
            setReward("Not staked");
            initialSyncFunction();
          })
          .catch((err: any) => {
            errorToast("transaction failed!");
            setIsProcessing(false);
          });
      })
      .catch((err: any) => {
        setIsProcessing(false);
        errorToast("Unstake NFT went wrong!");
      });
  };

  const handleClickEvent = () => {
    !isStake ? handleStake() : handleUnstake();
  };

  return (
    <div className="image-background max-w-sm rounded overflow-hidden shadow-lg min-h-[220px] border-[1px] rounded-xl w-[250px]">
      <div className="flex items-center justify-between mb-2 mt-2">
        <span className="inline-block bg-gray-800 px-3 py-1 mb-2 font-hairline text-white text-xs">
          # {userNFT?.tokenId}
        </span>
        <span className="ellipse-para inline-block bg-gray-800 px-3 py-1 mb-2 font-hairline text-white text-xs">
          Hourly: {reward}
        </span>
      </div>
      <img
        className="rounded-3xl p-2 mx-auto xl:mb-4 mb-5 w-[200px] h-[200px]"
        src={userNFT?.image}
        alt={userNFT?.image}
      />
      <div className="px-2 py-4">
        <CustomButton
          handleClickEvent={handleClickEvent}
          isProcessing={isProcessing}
          text={isStake ? "Unstake NFT" : "Stake NFT"}
        />
      </div>
    </div>
  );
};

export default MintCards;
