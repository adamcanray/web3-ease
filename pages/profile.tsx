import { useAccount, useBalance, useDisconnect, useEnsName } from "wagmi";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: balance } = useBalance({ address: address });
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (!isConnected) {
      router.replace("/");
      return;
    }
  }, [isConnected]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-gray-950">
      <div className="min-h-screen flex flex-col justify-center items-center relative w-full max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="absolute top-3 left-3 px-3 py-2 flex items-center justify-center rounded-full bg-gray-900 hover:bg-white active:bg-white text-white hover:text-gray-900 active:text-gray-900"
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

        <div className="text-center px-4">
          <div className="rounded-full border-2 border-gray-100 border-dashed inline-block">
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
          <div className="mt-6 border-y-2 border-gray-100 border-dashed text-center p-4">
            <p className="text-sm md:text-base font-light text-white">
              Address
            </p>
            <p className="text-sm md:text-base font-semibold text-gradient-1">
              {ensName ?? address}
            </p>
            <p className="text-sm md:text-base font-light text-white">
              Balance
            </p>
            <p className="text-sm md:text-base font-semibold text-gradient-2">
              {balance?.formatted} {balance?.symbol}
            </p>
          </div>
          <div className="mt-8 w-full">
            <button
              className="w-full px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors text-base md:text-lg"
              onClick={() => disconnect()}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
