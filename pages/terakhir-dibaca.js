import Head from "next/head";
import NextLink from "next/link";
import {
  Box,
  Heading,
  Link,
  Text,
  useColorMode,
  Flex, // PERBAIKAN: Tambahkan 'Flex' di sini
} from "@chakra-ui/react";
import { useLastReadStore } from "stores/LastRead";
import PageHeader from "@/components/PageHeader";

function VerseLastRead() {
  const verseLastRead = useLastReadStore((state) => state.verseLastRead);
  const { colorMode } = useColorMode();

  return (
    <>
      <Head>
        <title>Ayat Terakhir Dibaca | Al-Quran Digital</title>
      </Head>

      <PageHeader title="Terakhir Dibaca" goBack />

      <Box as="main" px="15px" pt="20px">
        <Heading
          as="h2"
          color={colorMode === "dark" ? "gray.100" : "gray.600"}
          fontSize="2xl"
        >
          {verseLastRead ? "Ayat terakhir dibaca:" : "Belum ada ayat yang ditandai"}
        </Heading>

        {verseLastRead && (
          <NextLink
            href={`/surah/${verseLastRead.nomor}#ayat-${verseLastRead.verse}`}
            passHref
          >
            <Link
              display="block"
              bg={colorMode === "dark" ? "gray.700" : "white"}
              borderRadius="lg"
              boxShadow="base"
              p="20px"
              mt="20px"
              _hover={{ textDecoration: 'none', boxShadow: 'md' }}
            >
              <Flex justifyContent="space-between" align="center">
                <Box>
                  <Text
                    color={colorMode === "dark" ? "gray.100" : "gray.700"}
                    fontWeight="bold"
                    fontSize="lg"
                  >
                    {verseLastRead.namaLatin}
                  </Text>
                  <Text
                    color="gray.500"
                    fontWeight="500"
                    fontSize="md"
                  >
                    Ayat ke {verseLastRead.verse}
                  </Text>
                </Box>
                <Box textAlign="right">
                  <Text
                    dir="rtl"
                    fontSize="3xl"
                    fontFamily="Amiri, serif"
                    color={colorMode === "dark" ? "gray.100" : "gray.700"}
                  >
                    {verseLastRead.nama}
                  </Text>
                </Box>
              </Flex>
            </Link>
          </NextLink>
        )}
      </Box>
    </>
  );
}

export default VerseLastRead;