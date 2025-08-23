import Head from "next/head";
import { useState } from "react";
import { Box, Text, useColorMode } from "@chakra-ui/react";
import PageHeader from "@/components/PageHeader";
import SurahList from "@/components/SurahList";
import SearchInput from "@/components/SearchInput";
import BackToTop from "@/components/BackToTop";

function Surah({ allSurahList }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { colorMode } = useColorMode();

  const surahList = allSurahList.filter((surah) =>
    // PERBAIKAN DI SINI: Ganti properti ke 'namaLatin'
    surah.namaLatin
      .toLowerCase()
      .includes(searchTerm.toLocaleLowerCase())
  );

  return (
    <>
      <Head>
        <title>Daftar Surah Al-Quran Beserta Terjemahan | Maos Quran</title>
        <meta
          name="description"
          content="Daftar Surah Al-Quran Beserta Terjemahan dan Tafsir"
        />
      </Head>

      <PageHeader title="Daftar Surah" goBack />
      <Box px="15px" pt="20px" as="main">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari surah..."
        />

        {surahList.length === 0 && searchTerm && (
          <Text
            fontSize="14px"
            color={colorMode === "dark" ? "gray.200" : "gray.600"}
            mt="20px"
            textAlign="center"
          >
            Surah "{searchTerm}" tidak ditemukan!
          </Text>
        )}

        <SurahList items={surahList} />
      </Box>

      <BackToTop />
    </>
  );
}

export default Surah;

export async function getStaticProps() {
  const res = await fetch("https://equran.id/api/v2/surat");
  const resultJson = await res.json();

  return {
    props: {
      allSurahList: resultJson.data,
    },
  };
}