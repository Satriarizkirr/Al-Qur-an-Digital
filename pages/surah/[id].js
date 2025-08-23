// pages/surah/[id].js

import Head from "next/head";
import { useState } from "react";
import NextLink from "next/link";
import {
  Box,
  Text,
  Flex,
  Heading,
  Spacer,
  VisuallyHidden,
  Link,
  useToast,
  useColorMode,
  VStack,
  StackDivider,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import {
  IoPlayOutline,
  IoPauseOutline,
  IoBookmarkOutline,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import { useLastReadStore } from "stores/LastRead";
import { usePreferenceStore } from "stores/Preference";
import PageHeader from "@/components/PageHeader";
import BackToTop from "@/components/BackToTop";

// KOMPONEN UTAMA
function Surah({ surah, prevSurah, nextSurah }) {
  const [playing, setPlaying] = useState(false);
  const { colorMode } = useColorMode();
  const { markLastRead } = useLastReadStore();
  const { preference } = usePreferenceStore();
  const toast = useToast();
  const { ayat: verses } = surah;

  const togglePlay = (audioId) => {
    const audios = document.querySelectorAll("audio");
    audios.forEach((audio) => {
      if (audio.id === audioId) {
        if (audio.paused) {
          audio.play();
          setPlaying(audio.id);
        } else {
          audio.pause();
          setPlaying(false);
        }
      } else {
        audio.pause();
      }
    });
  };

  // FUNGSI INI DIPINDAHKAN KE DALAM KOMPONEN AGAR BISA MENGAKSES STATE & PROPS
  const handleBookmarkClick = (verseNumber) => {
    markLastRead({
      nama: surah.nama,
      namaLatin: surah.namaLatin,
      nomor: surah.nomor,
      verse: verseNumber,
    });

    toast({
      description: `QS. ${surah.namaLatin}: ${verseNumber} telah ditandai.`,
      position: "top-right",
      status: "success",
      isClosable: true,
    });
  };

  return (
    <>
      <Head>
        <title>
          Surah {surah.namaLatin} | Al-Qur'an Digital
        </title>
        <meta
          name="description"
          content={`Baca Surah ${surah.namaLatin} lengkap dengan terjemahan dan tafsir.`}
        />
      </Head>

      <PageHeader title={surah.namaLatin} goBack surah={surah} />
      
      <Box as="main" px="15px" pb="100px">
        {/* Header Info Surah */}
        <Flex
          py="30px"
          bgGradient="linear(to-r, teal.500, green.500)"
          mt="15px"
          borderRadius="lg"
          flexDirection="column"
          align="center"
          justify="center"
          color="white"
          shadow="lg"
          textAlign="center"
          px={4}
        >
          <Heading as="h2" size="xl">
            {surah.namaLatin}
          </Heading>
          <Text my="8px" fontSize="lg">
            ({surah.arti})
          </Text>
          <Text fontSize="sm" color="whiteAlpha.800">
            {surah.tempatTurun} • {surah.jumlahAyat} Ayat
          </Text>
          {surah.bismillah && (
            <Text
              mt="25px"
              fontSize="3xl"
              fontFamily="Amiri, serif"
              dir="rtl"
              fontWeight="700"
            >
              {surah.bismillah.arab}
            </Text>
          )}
        </Flex>

        {/* Daftar Ayat */}
        <VStack
          divider={
            <StackDivider
              borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
            />
          }
          spacing={10}
          align="stretch"
          mt="50px"
        >
          {verses.map((verse) => (
            <Box key={verse.nomorAyat} id={`ayat-${verse.nomorAyat}`}>
              <Flex
                minH="47px"
                bg={colorMode === "dark" ? "gray.700" : "gray.50"}
                borderRadius="lg"
                py="10px"
                px="15px"
                align="center"
                columnGap={2}
              >
                <Box color={colorMode === "dark" ? "teal.300" : "teal.600"} fontWeight="bold" fontSize="lg">
                  {surah.nomor}:{verse.nomorAyat}
                </Box>
                <Spacer />
                <IconButton
                  aria-label="Audio ayat"
                  icon={
                    playing === `audio-${verse.nomorAyat}` ? (
                      <IoPauseOutline />
                    ) : (
                      <IoPlayOutline />
                    )
                  }
                  onClick={() => togglePlay(`audio-${verse.nomorAyat}`)}
                  colorScheme="teal"
                  variant="ghost"
                  isRound
                />
                <VisuallyHidden>
                  <audio
                    src={verse.audio["01"]}
                    id={`audio-${verse.nomorAyat}`}
                    onEnded={() => setPlaying(false)}
                  ></audio>
                </VisuallyHidden>
                <IconButton
                  aria-label="Tandai terakhir dibaca"
                  icon={<IoBookmarkOutline />}
                  onClick={() => handleBookmarkClick(verse.nomorAyat)}
                  colorScheme="teal"
                  variant="ghost"
                  isRound
                />
              </Flex>
              <Box pt="30px">
                <Text
                  fontFamily="Amiri, serif"
                  dir="rtl"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  color={colorMode === "dark" ? "gray.100" : "gray.800"}
                  lineHeight="2.5"
                >
                  {verse.teksArab}
                </Text>
                <Text
                  mt="35px"
                  color={colorMode === "dark" ? "gray.400" : "gray.500"}
                  fontSize="md"
                  fontStyle="italic"
                >
                  {verse.teksLatin}
                </Text>

                {preference.translation && (
                  <Box mt="20px">
                    <Text
                      mb="5px"
                      color={colorMode === "dark" ? "gray.100" : "gray.800"}
                      fontWeight="600"
                    >
                      Terjemahan:
                    </Text>
                    <Text
                      color={colorMode === "dark" ? "gray.200" : "gray.700"}
                      fontSize="sm"
                      fontStyle="italic"
                    >
                      "{verse.teksIndonesia}"
                    </Text>
                  </Box>
                )}
                
                {/* DITAMBAHKAN KEMBALI: Blok untuk menampilkan tafsir */}
                {preference.tafsir && (
                  <Box mt="20px">
                    <Text
                      mb="5px"
                      color={colorMode === "dark" ? "gray.100" : "gray.800"}
                      fontWeight="600"
                    >
                      Tafsir (Kemenag):
                    </Text>
                    <Text
                      color={colorMode === "dark" ? "gray.300" : "gray.600"}
                      fontSize="sm"
                      lineHeight="tall"
                    >
                      {verse.tafsir}
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Navigasi Bawah */}
      <Box
        h="50px"
        position="fixed"
        inset="auto 0 10px 0"
        maxW="500px"
        mx="auto"
        px="15px"
        zIndex={900}
      >
        <Flex
          h="100%"
          bg={colorMode === "dark" ? "gray.700" : "white"}
          borderRadius="full"
          shadow="lg"
          align="center"
          justify="space-between"
          border="1px solid"
          borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
        >
          {prevSurah && (
            <Link as={NextLink} href={`/surah/${prevSurah.nomor}`} flex={1} _hover={{ textDecoration: 'none' }}>
              <HStack color={colorMode === "dark" ? "white" : "gray.600"} p={3} justify="start">
                <IoChevronBack size={18} />
                <Text isTruncated>{prevSurah.namaLatin}</Text>
              </HStack>
            </Link>
          )}
          <Spacer />
          {nextSurah && (
            <Link as={NextLink} href={`/surah/${nextSurah.nomor}`} flex={1} _hover={{ textDecoration: 'none' }}>
              <HStack color={colorMode === "dark" ? "white" : "gray.600"} p={3} justify="end">
                <Text isTruncated>{nextSurah.namaLatin}</Text>
                <IoChevronForward size={18} />
              </HStack>
            </Link>
          )}
        </Flex>
      </Box>

      <BackToTop />
    </>
  );
}

export default Surah;

// FUNGSI UNTUK GENERATE SEMUA HALAMAN SURAH
export async function getStaticPaths() {
  const response = await fetch("https://equran.id/api/v2/surat");
  const resultJson = await response.json();
  const surahList = resultJson.data;

  const paths = surahList.map((surah) => ({
    params: { id: surah.nomor.toString() },
  }));

  return { paths, fallback: false };
}

// FUNGSI UNTUK MENGAMBIL DATA TIAP SURAH (TERMASUK TAFSIR)
export async function getStaticProps({ params }) {
  const { id } = params;

  // 1. Ambil data surah dan tafsir secara bersamaan
  const [surahRes, tafsirRes] = await Promise.all([
    fetch(`https://equran.id/api/v2/surat/${id}`),
    fetch(`https://equran.id/api/v2/tafsir/${id}`),
  ]);

  const [surahJson, tafsirJson] = await Promise.all([
    surahRes.json(),
    tafsirRes.json(),
  ]);

  if (!surahJson.data || !tafsirJson.data) {
    return { notFound: true }; // Handle jika API gagal
  }
  
  const surah = surahJson.data;
  const tafsir = tafsirJson.data;

  // 2. Gabungkan data tafsir ke dalam setiap ayat
  const mergedAyat = surah.ayat.map(ayat => {
    const tafsirAyat = tafsir.tafsir.find(t => t.ayat === ayat.nomorAyat);
    return {
      ...ayat,
      tafsir: tafsirAyat ? tafsirAyat.teks : "Tafsir tidak ditemukan.",
    };
  });
  
  surah.ayat = mergedAyat;

  // Logika untuk surah sebelum dan sesudahnya
  let prevSurah = null;
  if (id > 1) {
    const prevSurahRes = await fetch(`https://equran.id/api/v2/surat/${Number(id) - 1}`);
    const prevSurahJson = await prevSurahRes.json();
    prevSurah = prevSurahJson.data;
  }

  let nextSurah = null;
  if (id < 114) {
    const nextSurahRes = await fetch(`https://equran.id/api/v2/surat/${Number(id) + 1}`);
    const nextSurahJson = await nextSurahRes.json();
    nextSurah = nextSurahJson.data;
  }

  return {
    props: {
      surah,
      prevSurah,
      nextSurah,
    },
    revalidate: 3600, // Re-generate halaman setiap jam
  };
}