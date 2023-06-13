import { readContract, writeContract } from "@wagmi/core";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useEnsName,
  useNetwork,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import ParallaxNetworkContractAbi from "@/utils/ParallaxNetworkContractAbi.json";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useRouter } from "next/router";

const CONTRACT_ADDRESS = "0xe63434289AB72602f4b446e00e716206c9A9B97a";

export default function Home() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { chain, chains } = useNetwork();
  const [mintedCount, setMintedCount] = useState<string>("");
  const [toMintCount, setToMintCount] = useState<number>(1);

  console.log(chain);
  console.log(chains);

  const getTotalSupply = async () => {
    const totalSupply = await readContract({
      address: CONTRACT_ADDRESS,
      abi: ParallaxNetworkContractAbi.abi,
      functionName: "totalSupply",
    });
    setMintedCount((totalSupply as bigint).toString());
  };

  const doMint = async () => {
    try {
      const { hash } = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ParallaxNetworkContractAbi.abi,
        functionName: "safeMint",
        args: [toMintCount],
        value: parseEther(`${0.001 * toMintCount}`),
      });

      console.log("Minted: ", hash);
    } catch (error) {
      console.log(error);
    }
  };

  const toMintCountOnChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setToMintCount(parseInt(e.currentTarget.value));
  };

  useEffect(() => {
    getTotalSupply();
  }, []);

  if (isConnected)
    return (
      <>
        <header className="bg-gray-950 flex justify-between items-center flex-col md:flex-row px-4 py-3">
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
        <div className="bg-gray-950 min-h-screen flex justify-center items-center">
          <div className="flex flex-col items-center">
            <p className="text-lg font-normal text-white">
              Token Minted:{" "}
              <span className="text-lg font-semibold">{mintedCount}</span>
            </p>
            <div className="mt-8">
              <p>To mint:</p>
              <input
                type="number"
                className="border-b border-b-gray-100 bg-transparent w-auto sm:w-96"
                onChange={toMintCountOnChange}
                value={toMintCount}
              />
            </div>
            <div className="mt-2 text-center">
              {chain?.id !== 11155111 && (
                <p className="text-sm text-red-500 mb-1">
                  Your not on Sepolia testnet
                </p>
              )}
              <button
                disabled={chain?.id !== 11155111}
                onClick={() => doMint()}
                className="px-2 py-1 rounded bg-indigo-500 hover:bg-indigo-600 disabled:opacity-80 disabled:cursor-not-allowed transition-colors"
              >
                Mint NFT
              </button>
            </div>
          </div>
        </div>
      </>
    );

  return (
    <div className="bg-gray-950 min-h-screen flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Welcome to Web3Ease!</h1>
        <p className="text-lg font-normal text-white">
          Your go-to Ethereum wallet for a hassle-free and intuitive experience
        </p>

        <div className="mt-6">
          {connectors.map((connector) => (
            <button
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect({ connector })}
              className="px-2 py-1 rounded bg-orange-500 hover:bg-orange-600"
            >
              Connect with {connector.name}
              {!connector.ready && " (unsupported)"}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                " (connecting)"}
            </button>
          ))}

          {error && <div>{error.message}</div>}
        </div>
      </div>
    </div>
  );
}
