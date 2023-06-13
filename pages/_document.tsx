import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head title="Web3Ease - Your go-to Ethereum wallet">
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="title" content="Web3Ease - Your go-to Ethereum wallet" />
        <meta
          name="description"
          content="Your go-to Ethereum wallet for a hassle-free and intuitive experience"
        />

        {/* <!-- Facebook --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://web3-ease.vercel.app/" />
        <meta
          property="og:title"
          content="Web3Ease - Your go-to Ethereum wallet"
        />
        <meta
          property="og:description"
          content="Your go-to Ethereum wallet for a hassle-free and intuitive experience"
        />
        <meta
          property="og:image"
          content="https://web3-ease.vercel.app/splash.png"
        />

        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://web3-ease.vercel.app/" />
        <meta
          property="twitter:title"
          content="Web3Ease - Your go-to Ethereum wallet"
        />
        <meta
          property="twitter:description"
          content="Your go-to Ethereum wallet for a hassle-free and intuitive experience"
        />
        <meta
          property="twitter:image"
          content="https://web3-ease.vercel.app/splash.png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
