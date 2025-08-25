import { Box } from "@chakra-ui/react";
import Head from "next/head";
import About from "../components/About";

export default function TentangPage() {
  return (
    <>
      <Head>
        <title>Tentang - Al-Qur'an Digital</title>
        <meta name="description" content="Informasi tentang pengembang dan sumber Al-Qur'an Digital" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <Box minH="100vh" pb="80px">
        <About />
      </Box>
    </>
  );
}