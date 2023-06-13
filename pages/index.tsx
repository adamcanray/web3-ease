import { readContract, writeContract, watchContractEvent } from "@wagmi/core";
import { useAccount, useConnect, useNetwork } from "wagmi";
import ParallaxNetworkContractAbi from "@/utils/ParallaxNetworkContractAbi.json";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

const CONTRACT_ADDRESS = "0xe63434289AB72602f4b446e00e716206c9A9B97a";
const NETWORK_CHAIN_ID = 11155111;

export default function Home() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const {
    connect,
    connectors,
    error: connectError,
    isLoading,
    pendingConnector,
    isError: connectIsError,
  } = useConnect({ chainId: NETWORK_CHAIN_ID });
  const { chain } = useNetwork();
  const [mintedCount, setMintedCount] = useState<string>("");
  const [balanceOf, setBalanceOf] = useState<string>("");
  const [toMintCount, setToMintCount] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [mintIsLoading, setMintIsLoading] = useState<boolean>(false);
  const [refetchIsLoading, setRefetchIsLoading] = useState<boolean>(false);

  const getTotalSupply = async () => {
    setErrorMessage("");
    try {
      const totalSupply = await readContract({
        address: CONTRACT_ADDRESS,
        abi: ParallaxNetworkContractAbi.abi,
        functionName: "totalSupply",
        chainId: NETWORK_CHAIN_ID,
      });
      const balanceOf = await readContract({
        address: CONTRACT_ADDRESS,
        abi: ParallaxNetworkContractAbi.abi,
        functionName: "balanceOf",
        args: [address],
        chainId: NETWORK_CHAIN_ID,
      });
      setMintedCount((totalSupply as bigint).toString());
      setBalanceOf((balanceOf as bigint).toString());
    } catch (error) {
      console.log(error);
      setErrorMessage((error as Error).name);
    }
  };

  const doMint = async () => {
    setErrorMessage("");
    setMintIsLoading(true);

    if (toMintCount < 0) {
      setErrorMessage("Only accept >= 0");
      setMintIsLoading(false);
      return;
    }

    try {
      const { hash } = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ParallaxNetworkContractAbi.abi,
        functionName: "safeMint",
        args: [toMintCount],
        value: parseEther(`${0.001 * toMintCount}`),
        chainId: NETWORK_CHAIN_ID,
      });

      console.log("Minted: ", hash);
      setMintIsLoading(false);
      setRefetchIsLoading(true);
    } catch (error) {
      console.log(error);
      setErrorMessage((error as Error).name);
      setMintIsLoading(false);
    }
  };

  const toMintCountOnChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setToMintCount(parseInt(e.currentTarget.value));
    setErrorMessage("");
  };

  useEffect(() => {
    if (!isConnected) return;
    const _ = watchContractEvent(
      {
        address: CONTRACT_ADDRESS,
        abi: ParallaxNetworkContractAbi.abi,
        eventName: "Transfer",
        chainId: NETWORK_CHAIN_ID,
      },
      (log) => {
        console.log("Transfer event: ", log);
        getTotalSupply();
        setRefetchIsLoading(false);
      }
    );
    getTotalSupply();
  }, [isConnected]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Renders this UI on connection error, unless the code equals 4001
   */
  if (
    connectIsError &&
    (connectError as Error & { code: number }).code !== 4001
  ) {
    return (
      <div className="bg-gray-950 min-h-screen flex flex-col justify-center items-center">
        <p className="text-xl font-medium text-white">Something went wrong</p>
        <p className="text-base font-normal text-white">
          You maybe want to refresh this page
        </p>
        <p className="mt-2 text-sm font-normal text-red-500">
          {connectError?.message}
        </p>
      </div>
    );
  } else if (isConnected) {
    return (
      <div className="bg-gray-950">
        <header className="flex justify-between items-center flex-col sm:flex-row px-4 py-3 w-full max-w-5xl mx-auto">
          <div className="">
            <Link
              href={{ pathname: "/" }}
              className="text-3xl font-semibold text-gradient-animate-1"
            >
              Web3Ease
            </Link>
          </div>
          <button
            onClick={() => router.push("/profile")}
            className="text-base font-normal text-white hover:text-gray-950 rounded-full bg-gray-900 hover:bg-white p-1 mt-2 md:mt-0"
          >
            {address ? (
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                  />
                </svg>
                <span className="ml-1">Wallet: </span>
                <span className="text-gradient-1">
                  {address.slice(0, 6)}...
                  {address.slice(-4)}{" "}
                </span>
              </p>
            ) : (
              <p> Not connected </p>
            )}
          </button>
        </header>
        <div className="min-h-screen flex justify-center items-center px-4">
          <div className="flex flex-col items-center w-full max-w-md text-center">
            {/* eslint-disable-next-line */}
            <img src="/observing.gif" alt="observing gif" className="mx-auto" />
            <div className="border-x-2 border-b-2 border-gray-100 w-full p-3 border-dashed">
              <p className="text-lg font-normal text-white">Token Supply:</p>
              <span className="mt-1 text-2xl font-semibold text-gradient-1 inline-flex items-center relative">
                {mintedCount || "-"}{" "}
                {refetchIsLoading && (
                  <Image
                    src="/loading-three-dots.svg"
                    width={24}
                    height={6}
                    alt="loading-three-dots"
                    className="ml-2 absolute -right-8"
                  />
                )}
              </span>
              <p className="text-lg font-normal text-white">Minted:</p>
              <span className="mt-1 text-2xl font-semibold text-gradient-2 inline-flex items-center relative">
                {balanceOf || "-"}{" "}
                {refetchIsLoading && (
                  <Image
                    src="/loading-three-dots.svg"
                    width={24}
                    height={6}
                    alt="loading-three-dots"
                    className="ml-2 absolute -right-8"
                  />
                )}
              </span>
            </div>
            <div className="border-l-2 border-gray-100 border-dashed h-8"></div>
            <div className="mt-2 w-full">
              <p className="text-white text-lg">To mint:</p>
              <input
                type="number"
                className="border-b-2 border-b-gray-100 bg-transparent w-full p-2 text-2xl focus:outline-none text-center border-dashed text-gradient-2"
                onChange={toMintCountOnChange}
                value={toMintCount}
              />
            </div>
            <div className="mt-2 text-center w-full">
              <p className="text-sm text-red-500 mb-1">{errorMessage}</p>
              {chain?.id !== NETWORK_CHAIN_ID && (
                <p className="text-sm text-red-500 mb-1">
                  You are not on Sepolia test network
                </p>
              )}
              <button
                disabled={chain?.id !== NETWORK_CHAIN_ID}
                onClick={() => doMint()}
                className="w-full px-3 py-2 text-lg rounded-lg bg-gradient-1 disabled:opacity-80 disabled:cursor-not-allowed font-semibold"
              >
                Mint NFT {mintIsLoading ? "(loading..)" : ""}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen flex justify-center items-center px-4">
      <div className="text-center w-full max-w-5xl mx-auto">
        {/* eslint-disable-next-line */}
        <img src="/mth.gif" alt="mth gif" className="mx-auto" />
        <div className="flex justify-center">
          <div className="border-l-2 border-gray-100 border-dashed h-8"></div>
        </div>
        <h1 className="mt-2 text-4xl font-bold text-white">
          Welcome to <span className="text-gradient-animate-1">Web3Ease</span>!
        </h1>
        <p className="text-lg font-normal text-white">
          Your go-to Ethereum wallet for a hassle-free and intuitive experience
        </p>

        <div className="mt-6">
          {connectors.map((connector) => (
            <button
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => {
                connect({ connector });
              }}
              className="px-3 py-2 text-lg rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-80 disabled:cursor-not-allowed"
            >
              Connect with {connector.name}
              {!connector.ready && " (unsupported)"}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                " (connecting..)"}
            </button>
          ))}

          {connectError && (
            <p className="mt-2 text-sm font-normal text-red-500">
              {connectError.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
