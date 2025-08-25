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
        const isFavorite = surahIsFavorite(surah.nomor);
        return (
          <Box
            key={surah.nomor}
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
            >
              <NextLink href={`/surah/${surah.nomor}`} passHref legacyBehavior>
                <HStack as="a" spacing={4} align="center" flex={1} _hover={{ textDecoration: 'none' }}>
                  <Text
                    fontWeight="bold"
                    fontSize="lg"
                    color={colorMode === "dark" ? "cyan.300" : "cyan.600"}
                  >
                    {surah.nomor}
                  </Text>
                  <Box>
                    <Text fontWeight="bold" fontSize="md">
                      {surah.namaLatin}
                    </Text>
                    <Text fontSize="sm" color="gray.500" fontStyle="italic">
                      {surah.arti} ({surah.jumlahAyat} Ayat)
                    </Text>
                  </Box>
                </HStack>
              </NextLink>

              <HStack spacing={4} align="center">
                <NextLink href={`/surah/${surah.nomor}`} passHref legacyBehavior>
                    <Text
                        as="a"
                        fontSize="2xl"
                        fontFamily="Amiri, serif"
                        fontWeight="bold"
                        dir="rtl"
                        _hover={{ textDecoration: 'none' }}
                    >
                        {surah.nama}
                    </Text>
                </NextLink>
                <IconButton
                  aria-label="Tambahkan ke favorit"
                  // ======================================================
                  // PERUBAHAN UTAMA DI SINI
                  // Kita beri warna merah langsung ke ikon BsHeartFill
                  // ======================================================
                  icon={
                    isFavorite ? (
                      <BsHeartFill color="#E53E3E" /> /* Warna merah solid (red.500) */
                    ) : (
                      <BsHeart />
                    )
                  }
                  colorScheme={isFavorite ? "red" : "gray"}
                  // Properti 'color' yang lama kita hapus dari sini karena sudah tidak perlu
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