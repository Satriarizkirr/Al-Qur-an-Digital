import Head from "next/head";
import Image from "next/image";
import {
  Box,
  Text,
  VStack,
  Heading,
  useColorMode,
  Spinner, // Import Spinner
} from "@chakra-ui/react";
import { useFavoriteStore } from "stores/Favorite";
import PageHeader from "@/components/PageHeader";
import SurahList from "@/components/SurahList";
import { motion } from "framer-motion";
import { useState, useEffect } from "react"; // Import hook

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionVStack = motion(VStack);

function FavoriteSurah() {
  const favoriteSurahList = useFavoriteStore((state) => state.surahFavorites);
  const { colorMode } = useColorMode();
  
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (!hasMounted) {
    return (
        <>
            <Head>
                <title>Daftar Surah Favorit | Al-Quran Digital</title>
            </Head>
            <PageHeader title="Surah Favorit" goBack />
            <VStack justify="center" align="center" h="50vh">
                <Spinner />
            </VStack>
        </>
    );
  }

  return (
    <>
      <Head>
        <title>Daftar Surah Favorit | Al-Quran Digital</title>
      </Head>

      <PageHeader title="Surah Favorit" goBack />

      <MotionBox
        px="15px"
        pt="20px"
        as="main"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {favoriteSurahList.length > 0 ? (
          <>
            <MotionHeading
              variants={itemVariants}
              as="h2"
              color={colorMode === "dark" ? "gray.100" : "gray.600"}
              fontSize="2xl"
              mb={4}
            >
              Surah favorit kamu:
            </MotionHeading>
            <SurahList items={favoriteSurahList} />
          </>
        ) : (
          <MotionVStack
            variants={itemVariants}
            spacing={4}
            mt="50px"
            textAlign="center"
          >
            <Image
              src="/images/joyride.svg"
              width={300}
              height={200}
              alt="Joyride Icon"
            />
            <Text
              color={colorMode === "dark" ? "gray.200" : "gray.700"}
              mt="30px"
            >
              Anda belum punya surah yang ditandai sebagai favorit.
            </Text>
          </MotionVStack>
        )}
      </MotionBox>
    </>
  );
}

export default FavoriteSurah;