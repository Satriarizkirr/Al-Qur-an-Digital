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
  useDisclosure,
  VStack,
  Divider,
  CloseButton,
  Text,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoArrowBack,
  IoHeartOutline,
  IoHeart,
  IoEllipsisVertical,
  IoMenu,
  IoMoon,
  IoSunny,
} from "react-icons/io5";
import { useFavoriteStore } from "stores/Favorite";
import { usePreferenceStore } from "stores/Preference";
import SelectQari from "./SelectQari";

const MotionIconButton = motion(IconButton);
const MotionBox = motion(Box);

export default function PageHeader({ title, goBack, surah }) {
  const router = useRouter();
  const { surahIsFavorite, toggleFavorite } = useFavoriteStore();
  const { preference, showTranslation, showTafsir } = usePreferenceStore();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isSurahPage = router.pathname.startsWith("/surah/");
  const isFavorite = surah ? surahIsFavorite(surah.nomor) : false;

  const iconVariants = {
    hover: { scale: 1.15 },
    tap: { scale: 0.95 },
  };

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-20px", // Sedikit slide aja
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      <Box position="relative" w="100%">
        <HStack
          as="header"
          position="sticky"
          top={0}
          w="100%"
          h="60px"
          zIndex={999}
          px={4}
          bg={colorMode === "dark" ? "gray.700" : "white"}
          boxShadow="md"
          borderBottomWidth="1px"
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
            <MotionIconButton
              aria-label="Buka Menu"
              icon={<IoMenu size="24px" />}
              variant="ghost"
              onClick={onOpen}
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
            />
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
                <MenuList 
                  minW="280px" 
                  bg={colorMode === "dark" ? "gray.700" : "white"}
                  border="1px solid"
                  borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
                  boxShadow="xl"
                >
                  {/* Mode Gelap */}
                  <MenuItem 
                    onClick={(e) => {
                      e.preventDefault();
                      toggleColorMode();
                    }}
                    bg="transparent"
                    _hover={{ bg: colorMode === "dark" ? "gray.600" : "gray.50" }}
                    _focus={{ bg: colorMode === "dark" ? "gray.600" : "gray.50" }}
                  >
                    <HStack justify="space-between" w="100%">
                      <HStack>
                        {colorMode === "dark" ? <IoSunny size="16px" /> : <IoMoon size="16px" />}
                        <Text fontSize="sm">Mode Gelap</Text>
                      </HStack>
                    </HStack>
                  </MenuItem>
                  
                  {/* Tampilkan Terjemahan */}
                  <MenuItem 
                    onClick={(e) => {
                      e.preventDefault();
                      showTranslation();
                    }}
                    bg="transparent"
                    _hover={{ bg: colorMode === "dark" ? "gray.600" : "gray.50" }}
                    _focus={{ bg: colorMode === "dark" ? "gray.600" : "gray.50" }}
                  >
                    <HStack justify="space-between" w="100%">
                      <Text fontSize="sm">Tampilkan Terjemahan</Text>
                      <Switch
                        isChecked={preference.translation}
                        onChange={showTranslation}
                        colorScheme="teal"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </HStack>
                  </MenuItem>
                  
                  {/* Tampilkan Tafsir */}
                  <MenuItem 
                    onClick={(e) => {
                      e.preventDefault();
                      showTafsir();
                    }}
                    bg="transparent"
                    _hover={{ bg: colorMode === "dark" ? "gray.600" : "gray.50" }}
                    _focus={{ bg: colorMode === "dark" ? "gray.600" : "gray.50" }}
                  >
                    <HStack justify="space-between" w="100%">
                      <Text fontSize="sm">Tampilkan Tafsir</Text>
                      <Switch
                        isChecked={preference.tafsir}
                        onChange={showTafsir}
                        colorScheme="teal"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </HStack>
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          ) : (
            <Box w={{ base: "30px", md: "40px" }} />
          )}
        </HStack>

        {/* Custom Sidebar dengan positioning absolut dalam container */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay - absolut dalam container */}
              <MotionBox
                position="absolute"
                top={0}
                left={0}
                w="100%"
                h="100vh"
                bg="blackAlpha.600"
                backdropFilter="blur(4px)"
                zIndex={998}
                variants={overlayVariants}
                initial="closed"
                animate="open"
                exit="closed"
                onClick={onClose}
              />
              
              {/* Sidebar - absolut dalam container */}
              <MotionBox
                position="absolute"
                top={0}
                left={0}
                w="280px"
                h="100vh"
                bg={colorMode === "dark" ? "gray.800" : "white"}
                boxShadow="xl"
                zIndex={999}
                variants={sidebarVariants}
                initial="closed"
                animate="open"
                exit="closed"
                borderRightWidth="1px"
                borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
              >
                {/* Header Sidebar */}
                <Flex
                  align="center"
                  justify="space-between"
                  px={6}
                  py={4}
                  borderBottomWidth="1px"
                  borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
                  h="60px" // Sama tinggi dengan header utama
                >
                  
                  <CloseButton 
                    onClick={onClose}
                    size="md"
                    color={colorMode === "dark" ? "gray.400" : "gray.600"}
                    _hover={{
                      bg: colorMode === "dark" ? "gray.700" : "gray.100"
                    }}
                  />
                </Flex>

                {/* Content Sidebar */}
                <Box px={6} py={6} overflowY="auto" h="calc(100vh - 60px)">
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <FormLabel fontSize="sm" fontWeight="semibold" mb={3}>
                       
                      </FormLabel>
                      <SelectQari />
                    </Box>
                    
                    <Divider />
                    
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <FormLabel htmlFor="dark-mode-switch" mb="0" fontSize="sm">
                        Mode Gelap
                      </FormLabel>
                      <IconButton
                        aria-label="Toggle theme"
                        icon={colorMode === "dark" ? <IoSunny size="16px" /> : <IoMoon size="16px" />}
                        variant="ghost"
                        size="sm"
                        onClick={toggleColorMode}
                        color={colorMode === "dark" ? "yellow.400" : "blue.400"}
                      />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <FormLabel htmlFor="translation-switch" mb="0" fontSize="sm">
                        Tampilkan Terjemahan
                      </FormLabel>
                      <Switch
                        id="translation-switch"
                        isChecked={preference.translation}
                        onChange={showTranslation}
                        colorScheme="teal"
                        size="md"
                      />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <FormLabel htmlFor="tafsir-switch" mb="0" fontSize="sm">
                        Tampilkan Tafsir
                      </FormLabel>
                      <Switch
                        id="tafsir-switch"
                        isChecked={preference.tafsir}
                        onChange={showTafsir}
                        colorScheme="teal"
                        size="md"
                      />
                    </FormControl>
                  </VStack>
                </Box>
              </MotionBox>
            </>
          )}
        </AnimatePresence>
      </Box>
    </>
  );
}

PageHeader.defaultProps = {
  title: "Al-Quran Digital",
  goBack: false,
  surah: null,
};