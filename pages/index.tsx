import { readContract, writeContract } from "@wagmi/core";
import { useAccount, useConnect, useNetwork } from "wagmi";
import ParallaxNetworkContractAbi from "@/utils/ParallaxNetworkContractAbi.json";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useRouter } from "next/router";

const CONTRACT_ADDRESS = "0xe63434289AB72602f4b446e00e716206c9A9B97a";
const NETWORK_CHAIN_ID = 11155111;

export default function Home() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const {
    connect,
    connectors,
    error,
    isLoading,
    pendingConnector,
    isError: connectIsError,
  } = useConnect({ chainId: NETWORK_CHAIN_ID });
  const { chain } = useNetwork();
  const [mintedCount, setMintedCount] = useState<string>("");
  const [toMintCount, setToMintCount] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [mintIsLoading, setMintIsLoading] = useState<boolean>(false);

  const getTotalSupply = async () => {
    setErrorMessage("");
    try {
      const totalSupply = await readContract({
        address: CONTRACT_ADDRESS,
        abi: ParallaxNetworkContractAbi.abi,
        functionName: "totalSupply",
      });
      setMintedCount((totalSupply as bigint).toString());
    } catch (error) {
      console.log(error);
      setErrorMessage((error as Error).name);
    }
  };

  const doMint = async () => {
    setErrorMessage("");
    setMintIsLoading(true);
    try {
      const { hash } = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ParallaxNetworkContractAbi.abi,
        functionName: "safeMint",
        args: [toMintCount],
        value: parseEther(`${0.001 * toMintCount}`),
      });

      console.log("Minted: ", hash);
      setMintIsLoading(false);
    } catch (error) {
      console.log(error);
      setErrorMessage((error as Error).name);
      setMintIsLoading(false);
    }
  };

  const toMintCountOnChange = (e: React.FormEvent<HTMLInputElement>): void => {
    if (parseInt(e.currentTarget.value) >= 0) {
      setToMintCount(parseInt(e.currentTarget.value));
    }
  };

  useEffect(() => {
    getTotalSupply();
  }, []);

  if (connectIsError) {
    return (
      <div className="bg-gray-950 min-h-screen flex justify-center items-center">
        <p className="text-lg font-semibold text-red-500">
          Something went wrong
        </p>
      </div>
    );
  }

  if (isConnected)
    return (
      <div className="bg-gray-950">
        <header className="flex justify-between items-center flex-col md:flex-row px-4 py-3 w-full max-w-5xl mx-auto">
          <div className="">
            <p className="text-xl font-semibold text-white">Web3Ease</p>
          </div>
          <button
            onClick={() => router.push("/profile")}
            className="text-base font-normal text-white hover:text-gray-950 border rounded-full border-white hover:bg-white p-1 mt-2 md:mt-0"
          >
            {address ? (
              <p>
                {" "}
                Wallet: {address.slice(0, 6)}...
                {address.slice(-4)}{" "}
              </p>
            ) : (
              <p> Not connected </p>
            )}
          </button>
        </header>
        <div className="min-h-screen flex justify-center items-center px-4">
          <div className="flex flex-col items-center w-full max-w-md">
            {/* eslint-disable-next-line */}
            <img src="/observing.gif" alt="observing gif" className="mx-auto" />
            <div className="mt-4 border border-gray-100 w-full p-3">
              <p className="text-lg font-normal text-white">Token Minted:</p>
              <span className="mt-1 text-lg font-semibold">
                {mintedCount || "-"}
              </span>
            </div>
            <div className="mt-8 w-full">
              <p className="text-white text-lg">To mint:</p>
              <input
                type="number"
                className="border-b border-b-gray-100 bg-transparent w-full p-2 text-lg focus:outline-none"
                onChange={toMintCountOnChange}
                value={toMintCount}
              />
            </div>
            <div className="mt-2 text-center w-full">
              <p className="text-sm text-red-500 mb-1">{errorMessage}</p>
              {chain?.id !== NETWORK_CHAIN_ID && (
                <p className="text-sm text-red-500 mb-1">
                  Your not on Sepolia testnet
                </p>
              )}
              <button
                disabled={chain?.id !== NETWORK_CHAIN_ID}
                onClick={() => doMint()}
                className="w-full px-2 py-1 rounded bg-indigo-500 hover:bg-indigo-600 disabled:opacity-80 disabled:cursor-not-allowed transition-colors"
              >
                Mint NFT {mintIsLoading ? "(loading..)" : ""}
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="bg-gray-950 min-h-screen flex justify-center items-center px-4">
      <div className="text-center">
        {/* eslint-disable-next-line */}
        <img src="/mth.gif" alt="mth gif" className="mx-auto" />
        <h1 className="mt-4 text-2xl font-bold text-white">
          Welcome to Web3Ease!
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
              className="px-2 py-1 rounded bg-orange-500 hover:bg-orange-600"
            >
              Connect with {connector.name}
              {!connector.ready && " (unsupported)"}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                " (connecting..)"}
            </button>
          ))}

          {error && <div>{error.message}</div>}
        </div>
      </div>
    </div>
  );
}
