import {
  useAccount,
  useBalance,
  useDisconnect,
  useEnsName,
  useNetwork,
} from "wagmi";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: balance } = useBalance({ address: address });
  const { chain } = useNetwork();
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
          <h1 className="text-3xl font-semibold">
            <span className="text-gradient-animate-2">Wallet</span> Detail
          </h1>
          <div className="mt-8 rounded-full border-2 border-gray-100 border-dashed inline-block w-56 h-56 overflow-hidden">
            {/* eslint-disable-next-line */}
            <img
              src="/empty-wallet.gif"
              alt="empty-wallet gif"
              className="mx-auto w-full h-full object-cover"
            />
          </div>
          <div className="mt-6 border-y-2 border-gray-100 border-dashed text-center p-4">
            <p className="text-sm md:text-base font-light text-white">
              Network
            </p>
            <p className="text-sm md:text-base font-semibold text-gradient-2">
              {chain?.name}
            </p>
            <p className="text-sm md:text-base font-light text-white">
              Address
            </p>
            <p className="text-sm md:text-base font-semibold text-gradient-1">
              {ensName ?? address}
            </p>
            <p className="text-sm md:text-base font-light text-white">
              Balance
            </p>
            <p className="text-xl md:text-3xl font-semibold">
              <span className="text-gradient-2">{balance?.formatted}</span>{" "}
              <span className="text-white">{balance?.symbol}</span>
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
