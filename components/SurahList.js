// components/SurahList.js

import NextLink from "next/link";
import {
  Flex,
  Box,
  Text,
  VStack,
  IconButton,
  useColorMode,
  HStack,
} from "@chakra-ui/react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { useFavoriteStore } from "stores/Favorite";

function SurahList({ items }) {
  const { surahIsFavorite, toggleFavorite } = useFavoriteStore();
  const { colorMode } = useColorMode();

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <VStack spacing={3} align="stretch" mt={5}>
      {items.map((surah) => {
        const isFavorite = surahIsFavorite(surah.nomor); // DIGANTI: surah.number -> surah.nomor
        return (
          <Box
            key={surah.nomor} // DIGANTI: surah.number -> surah.nomor
            bg={colorMode === "dark" ? "gray.700" : "white"}
            borderRadius="lg"
            boxShadow="base"
            transition="transform 0.2s ease, box-shadow 0.2s ease"
            _hover={{
              transform: "translateY(-4px)",
              boxShadow: "md",
            }}
          >
            <Flex
              p={4}
              justify="space-between"
              align="center"
              as={NextLink}
              href={`/surah/${surah.nomor}`} // DIGANTI: surah.number -> surah.nomor
              passHref
              _hover={{ textDecoration: 'none' }}
            >
              <HStack spacing={4} align="center">
                <Text
                  fontWeight="bold"
                  fontSize="lg"
                  color={colorMode === "dark" ? "cyan.300" : "cyan.600"}
                >
                  {surah.nomor} {/* DIGANTI: surah.number -> surah.nomor */}
                </Text>
                <Box>
                  <Text fontWeight="bold" fontSize="md">
                    {surah.namaLatin} {/* DIGANTI: surah.englishName -> surah.namaLatin */}
                  </Text>
                  <Text fontSize="sm" color="gray.500" fontStyle="italic">
                    {surah.arti} ({surah.jumlahAyat} Ayat)
                    {/* DIGANTI: surah.englishNameTranslation -> surah.arti */}
                    {/* DIGANTI: surah.numberOfAyahs -> surah.jumlahAyat */}
                  </Text>
                </Box>
              </HStack>

              <HStack spacing={4} align="center">
                <Text
                  fontSize="2xl"
                  fontFamily="Amiri, serif"
                  fontWeight="bold"
                  dir="rtl"
                >
                  {surah.nama} {/* DIGANTI: surah.name -> surah.nama */}
                </Text>
                <IconButton
                  aria-label="Tambahkan ke favorit"
                  icon={isFavorite ? <BsHeartFill /> : <BsHeart />}
                  colorScheme={isFavorite ? "red" : "gray"}
                  variant="ghost"
                  isRound
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(surah);
                  }}
                />
              </HStack>
            </Flex>
          </Box>
        );
      })}
    </VStack>
  );
}

export default SurahList;