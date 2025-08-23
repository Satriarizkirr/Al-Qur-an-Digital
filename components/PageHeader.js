// File: components/PageHeader.js

import { useRouter } from "next/router";
import {
  Box,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  FormControl,
  FormLabel,
  Switch,
  useColorMode,
  HStack,
  IconButton,
  Spacer,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  IoArrowBack,
  IoHeartOutline,
  IoHeart,
  IoEllipsisVertical,
} from "react-icons/io5";
import { useFavoriteStore } from "stores/Favorite";
import { usePreferenceStore } from "stores/Preference";

const MotionIconButton = motion(IconButton);

export default function PageHeader({ title, goBack, surah }) {
  const router = useRouter();
  const { surahIsFavorite, toggleFavorite } = useFavoriteStore();
  const { preference, showTranslation, showTafsir } = usePreferenceStore();
  const { colorMode } = useColorMode();

  const isSurahPage = router.pathname.startsWith("/surah/");
  const isFavorite = surah ? surahIsFavorite(surah.nomor) : false;

  const iconVariants = {
    hover: { scale: 1.15 },
    tap: { scale: 0.95 },
  };

  return (
    // DIKEMBALIKAN: Strukturnya kembali ke HStack full-width yang menempel di atas
    <HStack
      as="header"
      position="sticky"
      top={0}
      w="100%"
      h="60px"
      zIndex="sticky"
      px={4}
      bg={colorMode === "dark" ? "gray.700" : "white"}
      // DIUBAH: Bayangan dibuat lebih tegas (sm -> md) untuk efek 'timbul'
      boxShadow="md"
      // DIUBAH: Garis bawah sekarang aktif di light & dark mode untuk pemisah
      borderBottomWidth="1px"
      // DIUBAH: Warna border disesuaikan untuk light & dark mode
      borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
    >
      {goBack ? (
        <MotionIconButton
          aria-label="Kembali"
          icon={<IoArrowBack size="24px" />}
          variant="ghost"
          onClick={() => router.back()}
          variants={iconVariants}
          whileHover="hover"
          whileTap="tap"
        />
      ) : (
        <Box w={{ base: "30px", md: "40px" }} />
      )}

      <Spacer />
      
      <HStack>
        <Heading as="h1" fontSize="lg" fontWeight="semibold" textAlign="center" isTruncated>
          {title}
        </Heading>
        {router.pathname === "/" && (
          <Badge colorScheme="teal" variant="solid" fontSize="0.6em">
            V1.0
          </Badge>
        )}
      </HStack>

      <Spacer />

      {isSurahPage && surah ? (
        <HStack spacing={1}>
          <MotionIconButton
            aria-label="Tambahkan ke favorit"
            icon={isFavorite ? <IoHeart /> : <IoHeartOutline />}
            color={isFavorite ? "red.400" : "currentColor"}
            variant="ghost"
            onClick={() => toggleFavorite(surah)}
            fontSize="22px"
            variants={iconVariants}
            whileHover="hover"
            whileTap="tap"
          />
          <Menu isLazy>
            <MenuButton
              as={MotionIconButton}
              aria-label="Opsi"
              icon={<IoEllipsisVertical />}
              variant="ghost"
              fontSize="22px"
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
            />
            <MenuList minW="220px" bg={colorMode === "dark" ? "gray.700" : "white"}>
              <MenuItem closeOnSelect={false} _hover={{ bg: colorMode === "dark" ? "gray.600" : "gray.100" }}>
                <Flex w="100%" justifyContent="space-between" alignItems="center">
                  <FormLabel htmlFor="translation-switch" mb={0} cursor="pointer">
                    Tampilkan Terjemahan
                  </FormLabel>
                  <Switch
                    id="translation-switch"
                    isChecked={preference.translation}
                    onChange={showTranslation}
                    colorScheme="teal"
                  />
                </Flex>
              </MenuItem>
              <MenuItem closeOnSelect={false} _hover={{ bg: colorMode === "dark" ? "gray.600" : "gray.100" }}>
                <Flex w="100%" justifyContent="space-between" alignItems="center">
                  <FormLabel htmlFor="tafsir-switch" mb={0} cursor="pointer">
                    Tampilkan Tafsir
                  </FormLabel>
                  <Switch
                    id="tafsir-switch"
                    isChecked={preference.tafsir}
                    onChange={showTafsir}
                    colorScheme="teal"
                  />
                </Flex>
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      ) : (
        <Box w={{ base: "30px", md: "40px" }} />
      )}
    </HStack>
  );
}

PageHeader.defaultProps = {
  title: "Al-Quran Digital",
  goBack: false,
  surah: null,
};