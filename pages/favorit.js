import Head from "next/head";
import Image from "next/image";
import {
  Box,
  Text,
  Flex, // Saya ganti Flex jadi VStack untuk placeholder
  VStack, // agar lebih pas secara semantik
  Heading,
  useColorMode,
} from "@chakra-ui/react";
import { useFavoriteStore } from "stores/Favorite";
import PageHeader from "@/components/PageHeader";
import SurahList from "@/components/SurahList";

function FavoriteSurah() {
  // Menggunakan nama state yang benar dari kode kamu: 'surahFavorites'
  const favoriteSurahList = useFavoriteStore((state) => state.surahFavorites);
  const { colorMode } = useColorMode();

  return (
    <>
      <Head>
        <title>Daftar Surah Favorit | Al-Quran Digital</title>
      </Head>

      <PageHeader title="Surah Favorit" goBack />

      <Box px="15px" pt="20px" as="main">
        {/* IMPROVEMENT: Logika tampilan diubah pakai "ternary operator".
          Ini lebih bersih: JIKA list ada isinya, TAMPILKAN list, JIKA TIDAK, TAMPILKAN placeholder.
        */}
        {favoriteSurahList.length > 0 ? (
          <>
            <Heading
              as="h2"
              color={colorMode === "dark" ? "gray.100" : "gray.600"}
              fontSize="2xl"
              mb={4} // Beri sedikit jarak ke bawah
            >
              Surah favorit kamu:
            </Heading>
            <SurahList items={favoriteSurahList} />
          </>
        ) : (
          <VStack spacing={4} mt="50px" textAlign="center">
            <Image
              src="/images/joyride.svg"
              // PERBAIKAN UTAMA: Ubah "300px" menjadi {300} dan "200px" menjadi {200}
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
          </VStack>
        )}
      </Box>
    </>
  );
}

export default FavoriteSurah;