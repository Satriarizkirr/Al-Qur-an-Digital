import { Html, Head, Main, NextScript } from "next/document";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "src/theme";

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        {/* ====================================================== */}
        {/* PENAMBAHAN UNTUK PWA */}
        {/* ====================================================== */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png"></link>
        <meta name="theme-color" content="#1A202C" /> {/* Warna gelap untuk address bar */}
      </Head>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}