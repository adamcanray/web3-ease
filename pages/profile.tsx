import { readContract } from "@wagmi/core";
import { useAccount, useBalance, useDisconnect, useEnsName } from "wagmi";
import ParallaxNetworkContractAbi from "@/utils/ParallaxNetworkContractAbi.json";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const CONTRACT_ADDRESS = "0xe63434289AB72602f4b446e00e716206c9A9B97a";

export default function Home() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: balance } = useBalance({ address: address });
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (!isConnected) {
      router.replace("/");
    }
  }, [isConnected]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-gray-950">
      <div className="min-h-screen flex flex-col justify-center items-center relative w-full max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="absolute top-3 left-3 px-3 py-1 flex items-center justify-center rounded-full bg-gray-950 hover:bg-gray-900 active:bg-gray-900"
        >
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
              d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
            />
          </svg>
          <p className="ml-2">Back</p>
        </button>

        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-56 h-56"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        <p className="text-base font-light text-white">Address</p>
        <p className="text-base font-semibold text-white">
          {ensName ?? address}
        </p>
        <p className="text-base font-light text-white">Balance</p>
        <p className="text-base font-semibold text-white">
          {balance?.formatted}
        </p>

        <div className="mt-8">
          <button
            className="px-2 py-1 rounded bg-red-500 hover:bg-red-600 transition-colors"
            onClick={() => disconnect()}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
