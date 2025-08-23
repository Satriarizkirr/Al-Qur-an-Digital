// File: pages/juz-amma.js

import Head from "next/head";
import { useState } from "react";
import { Box, Text, useColorMode } from "@chakra-ui/react";
import PageHeader from "@/components/PageHeader";
import SearchInput from "@/components/SearchInput";
import SurahList from "@/components/SurahList";

function JuzAmma({ allSurahList }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { colorMode } = useColorMode();

  const surahList = allSurahList.filter((surah) =>
    // PERBAIKAN: Sesuaikan dengan format data baru
    surah.namaLatin
      .toLowerCase()
      .includes(searchTerm.toLocaleLowerCase())
  );

  return (
    <>
      <Head>
        <title>Al-Quran Juz 30 (Juz Amma) | Al-Quran Digital</title>
        <meta
          name="description"
          content="Baca surah-surah dalam Juz 30 (Juz Amma) dari Al-Qur'an."
        />
      </Head>

      <PageHeader title="Juz Amma" goBack />
      <Box px="15px" pt="20px" as="main">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari surah di Juz Amma"
        />

        {surahList.length === 0 && searchTerm && ( // Ditambah kondisi 'searchTerm'
          <Text
            fontSize="14px"
            color={colorMode === "dark" ? "gray.200" : "gray.600"}
            mt="20px"
            textAlign="center"
          >
            Surah "{searchTerm}" tidak ditemukan!
          </Text>
        )}

        {/* Komponen SurahList sudah siap menerima format data baru */}
        <SurahList items={surahList} />
      </Box>
    </>
  );
}

export default JuzAmma;

export async function getStaticProps() {
  // PERBAIKAN: Gunakan API yang aktif dan benar
  const res = await fetch("https://equran.id/api/v2/surat");
  const resultJson = await res.json();

  // PERBAIKAN: Filter berdasarkan properti 'nomor', bukan 'number'
  const allSurahList = resultJson.data.filter((surah) => surah.nomor >= 78);

  return {
    props: {
      allSurahList,
    },
  };
}