const ethers = require("ethers");
import { useCallback } from 'react';
import { LOTTERY_CONTRACTADDRESS } from "../config";
import LOTTERYABI from "../../public/abi/LOTTERYABI.json";

export const useLatestContract = () => {
    const web3Provider = useCallback(() => {
        const appProvider =
            typeof window !== "undefined" && window?.ethereum
                ? new ethers.providers.Web3Provider(window.ethereum)
                : null;
        return appProvider
    }, []);

    const getLotteryContract = useCallback(() => {
        const web3Instance = web3Provider();
        const Signer = web3Instance?.getSigner();
        const LOTTERYContract = new ethers.Contract(
            LOTTERY_CONTRACTADDRESS,
            LOTTERYABI,
            Signer
        );
        return LOTTERYContract;
    }, [web3Provider]);

    const readStake = useCallback(
        async (tokenId) => {
            try {
                const lotteryContract = getLotteryContract();
                const isStake = await lotteryContract.readStake(Number(tokenId))
                return isStake;
            } catch (error) {
                console.log(error)
            }
        },
        [getLotteryContract],
    );

    const readAmount = useCallback(
        async (allRewardNFTPrize) => {
            try {
                const lotteryContract = getLotteryContract();
                const getRewardAmount = await lotteryContract.rewardAmount(allRewardNFTPrize)
                return getRewardAmount;
            } catch (error) {
                console.log(error)
            }
        },
        [getLotteryContract],
    );

    const fee = useCallback(
        async () => {
            try {
                const lotteryContract = getLotteryContract();
                const getFee = await lotteryContract.fee()
                return getFee;
            } catch (error) {
                console.log(error)
            }
        },
        [getLotteryContract],
    );

    const stake = useCallback(
        async (allStakeNFT, accountInfo) => {
            try {
                const lotteryContract = getLotteryContract();
                const stacked = await lotteryContract.stake(allStakeNFT, accountInfo)
                return stacked;
            } catch (error) {
                console.log(error)
            }
        },
        [getLotteryContract],
    );

    const unstake = useCallback(
        async (allStakeNFT, accountInfo) => {
            try {
                const lotteryContract = getLotteryContract();
                const unstaked = await lotteryContract.unstake(allStakeNFT, accountInfo)
                return unstaked;
            } catch (error) {
                console.log(error)
            }
        },
        [getLotteryContract],
    );

    const claimAll = useCallback(
        async (allStakeNFT, accountInfo) => {
            try {
                const lotteryContract = getLotteryContract();
                const unstaked = await lotteryContract.claimAll(allStakeNFT, accountInfo)
                return unstaked;
            } catch (error) {
                console.log(error)
            }
        },
        [getLotteryContract],
    );

    const getDailyReward = useCallback(
        async (tokenId) => {
            try {
                const lotteryContract = getLotteryContract();
                const dailyReward = await lotteryContract.getDailyReward(tokenId)
                return dailyReward;
            } catch (error) {
                console.log(error)
            }
        },
        [getLotteryContract],
    );

    const setFee = useCallback(
        async (feesWeiToWei, accountInfo) => {
            try {
                const lotteryContract = getLotteryContract();
                const setFee = await lotteryContract.setFee(feesWeiToWei, accountInfo)
                return setFee;
            } catch (error) {
                console.log(error)
            }
        },
        [getLotteryContract],
    );

    const setReward = useCallback(
        async (prizeWeiToWei, accountInfo) => {
            try {
                const lotteryContract = getLotteryContract();
                const reward = await lotteryContract.setReward(prizeWeiToWei, accountInfo)
                return reward;
            } catch (error) {
                console.log(error)
            }
        },
        [getLotteryContract],
    );

    return {
        readStake,
        readAmount,
        fee,
        stake,
        unstake,
        claimAll,
        getDailyReward,
        setFee,
        setReward
    };
};
