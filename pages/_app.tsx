import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig, createConfig, configureChains, sepolia } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import dynamic from "next/dynamic";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
// import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
// import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
// import { InjectedConnector } from "wagmi/connectors/injected";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    // new CoinbaseWalletConnector({
    //   chains,
    //   options: {
    //     appName: "wagmi",
    //   },
    // }),
    // new WalletConnectConnector({
    //   chains,
    //   options: {
    //     projectId: "...",
    //   },
    // }),
    // new InjectedConnector({
    //   chains,
    //   options: {
    //     name: "Injected",
    //     shimDisconnect: true,
    //   },
    // }),
  ],
  publicClient,
  webSocketPublicClient,
});

function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
