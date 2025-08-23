import Head from "next/head";
import Image from "next/image";
import NextLink from "next/link";
import {
  Box,
  Grid,
  Link,
  Text,
  useColorMode,
  VStack,
  Heading,
  Button,
  Circle,
  Flex,
  Container,
  Stack,
  Badge,
  Divider,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiBookOpen, FiStar, FiGrid } from "react-icons/fi";
import PageHeader from "@/components/PageHeader";
import { useLastReadStore } from "stores/LastRead";
import { menuList } from "../data/menuList";

// DITAMBAHKAN: Import Swiper untuk Carousel
import { Swiper, SwiperSlide } from 'swiper/react';
// PERBAIKAN: Hapus 'Navigation' dari sini
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

export default function Home() {
  const { colorMode } = useColorMode();
  const { verseLastRead } = useLastReadStore();

  const bannerImages = [
    '/images/banner.jpg',
    '/images/banner1.jpg', // Pastikan gambar ini ada

  ];
  
  // Ambil hanya 5 item pertama untuk ditampilkan di beranda
  const featuredMenuList = menuList.slice(0, 5);

  // ... (variants animation tidak diubah)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };
  
  const cardVariants = {
    rest: { 
      scale: 1,
      boxShadow: colorMode === "dark" 
        ? "0 4px 12px rgba(0, 0, 0, 0.3)" 
        : "0 4px 12px rgba(0, 0, 0, 0.1)"
    },
    hover: {
      scale: 1.05,
      y: -8,
      boxShadow: colorMode === "dark"
        ? "0 20px 40px rgba(0, 0, 0, 0.4)"
        : "0 20px 40px rgba(0, 0, 0, 0.15)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <Head>
        <title>Al-Quran Online Terjemahan dan Tafsir Ayat | Al-Quran Digital</title>
        {/* ... meta tags ... */}
      </Head>

      <PageHeader />
      
      <Container maxW="7xl" px={{ base: 4, md: 6 }}>
        <MotionFlex
          as="main"
          direction="column"
          py={6}
          gap={8}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section Carousel */}
          <MotionBox variants={itemVariants}>
            <Box
              position="relative"
              w="full"
              h={{ base: "280px", md: "350px" }}
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="xl"
              sx={{
                // Hapus styling untuk tombol navigasi karena tombolnya dihilangkan
                '.swiper-pagination-bullet-active': {
                  background: 'white',
                },
              }}
            >
              <Swiper
                // PERBAIKAN: Hapus 'Navigation' dari modul
                modules={[Autoplay, EffectFade, Pagination]}
                effect="fade"
                // PERBAIKAN: Hapus properti navigation={true}
                // navigation={true} 
                pagination={{ clickable: true }}
                loop={true}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
              >
                {bannerImages.map((img, index) => (
                  <SwiperSlide key={index}>
                    <Image
                      src={img}
                      fill
                      alt={`Banner ${index + 1}`}
                      style={{ objectFit: 'cover' }}
                      priority={index === 0}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* ... (Bagian tulisan di depan tidak diubah) ... */}
              <Box
                position="absolute"
                top={0} left={0} right={0} bottom={0}
                bgGradient="linear(to-t, blackAlpha.800, blackAlpha.400)"
              />
              <Flex
                position="relative"
                zIndex={1}
                h="full"
                direction="column"
                justify="flex-end"
                align="start"
                color="white"
                p={{ base: 6, md: 8 }}
                gap={4}
              >
                <VStack align="start" spacing={2}>
                  <Badge
                    colorScheme="teal"
                    variant="solid"
                    px={3} py={1}
                    borderRadius="full"
                    fontSize="sm"
                  >
                    Selamat Datang
                  </Badge>
                  <Heading
                    as="h1"
                    size={{ base: "lg", md: "xl" }}
                    fontWeight="bold"
                    textShadow="2px 2px 4px rgba(0,0,0,0.5)"
                  >
                    Assalamu'alaikum Warahmatullahi Wabarakatuh
                  </Heading>
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    opacity={0.9}
                    maxW="lg"
                    textShadow="1px 1px 2px rgba(0,0,0,0.5)"
                  >
                    Sudahkahkah Anda Membaca Al-Quran Hari Ini?
                  </Text>
                </VStack>
                {verseLastRead && verseLastRead.nomor && (
                  <MotionBox
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      as={NextLink}
                      href={`/surah/${verseLastRead.nomor}#ayat-${verseLastRead.verse}`}
                      size="lg"
                      colorScheme="teal"
                      variant="solid"
                      leftIcon={<FiClock />}
                      borderRadius="xl"
                      boxShadow="lg"
                    >
                      Lanjutkan Terakhir Dibaca
                    </Button>
                  </MotionBox>
                )}
              </Flex>
            </Box>
          </MotionBox>

          {/* Stats Section (TIDAK DIUBAH) */}
          <MotionBox variants={itemVariants}>
            <HStack
              spacing={{ base: 4, md: 8 }}
              justify="center"
              wrap="wrap"
              py={4}
              bg={colorMode === "dark" ? "gray.700" : "white"}
              borderRadius="xl"
              boxShadow="md"
            >
              <VStack>
                <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="green.500">
                  114
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Surah
                </Text>
              </VStack>
              <Divider orientation="vertical" h="40px" />
              <VStack>
                <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="teal.500">
                  6,236
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Ayat
                </Text>
              </VStack>
              <Divider orientation="vertical" h="40px" />
              <VStack>
                <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="orange.500">
                  30
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Juz
                </Text>
              </VStack>
            </HStack>
          </MotionBox>

          {/* PERUBAHAN DI SINI: Enhanced Menu Section dengan Fitur "Lihat Semua" */}
          <MotionBox variants={itemVariants}>
            <VStack w="full" spacing={6}>
              <HStack w="full" justify="space-between" align="center">
                <VStack align="start" spacing={1}>
                  <Heading as="h2" size="lg" color={colorMode === "dark" ? "white" : "gray.800"}>
                    Pilihan Menu
                  </Heading>
                  <Text color="gray.500" fontSize="md">
                    Jelajahi berbagai fitur Al-Qur'an Digital
                  </Text>
                </VStack>
                <Icon as={FiStar} color="yellow.400" boxSize="24px" />
              </HStack>

              <Grid
                templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
                gap={6}
                w="full"
              >
                {/* Tampilkan 5 menu unggulan */}
                {featuredMenuList.map((menu, index) => (
                  <MotionBox
                    key={menu.text}
                    variants={cardVariants}
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                    custom={index}
                    layout
                  >
                    <Link
                      as={NextLink}
                      href={menu.href}
                      _hover={{ textDecoration: "none" }}
                      h="full"
                    >
                      <VStack
                        spacing={4}
                        p={6}
                        bg={colorMode === "dark" ? "gray.800" : "white"}
                        borderRadius="xl"
                        h="full"
                        position="relative"
                        overflow="hidden"
                        border="1px solid"
                        borderColor={colorMode === "dark" ? "gray.700" : "gray.100"}
                        transition="all 0.3s ease"
                      >
                        <Box
                          position="absolute"
                          top={0}
                          left={0}
                          right={0}
                          h="4px"
                          bgGradient={menu.gradient}
                        />
                        <Circle
                          size="64px"
                          bg={
                            colorMode === "dark"
                              ? `${menu.colorScheme}.900`
                              : `${menu.colorScheme}.50`
                          }
                          border="2px solid"
                          borderColor={
                            colorMode === "dark"
                              ? `${menu.colorScheme}.700`
                              : `${menu.colorScheme}.200`
                          }
                          position="relative"
                          overflow="hidden"
                        >
                          <Box
                            position="absolute"
                            top={0} left={0} right={0} bottom={0}
                            bgGradient={`linear(135deg, ${menu.colorScheme}.400, ${menu.colorScheme}.600)`}
                            opacity={0.1}
                          />
                          <Image
                            src={menu.icon}
                            width={32}
                            height={32}
                            alt={menu.text}
                          />
                        </Circle>
                        <VStack spacing={2} textAlign="center">
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color={colorMode === "dark" ? "white" : "gray.800"}
                          >
                            {menu.text}
                          </Text>
                          <Text
                            fontSize="xs"
                            color="gray.500"
                            lineHeight="1.4"
                          >
                            {menu.description}
                          </Text>
                        </VStack>
                      </VStack>
                    </Link>
                  </MotionBox>
                ))}

                {/* Kartu "Lihat Semua" */}
                <MotionBox
                  variants={cardVariants}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  layout
                >
                  <Link
                    as={NextLink}
                    href="/menu" // Arahkan ke halaman semua menu
                    _hover={{ textDecoration: "none" }}
                    h="full"
                  >
                    <VStack
                      spacing={4}
                      p={6}
                      bg={colorMode === "dark" ? "gray.800" : "gray.50"}
                      borderRadius="xl"
                      h="full"
                      justifyContent="center"
                      border="2px dashed"
                      borderColor={colorMode === "dark" ? "gray.600" : "gray.300"}
                      transition="all 0.3s ease"
                      _hover={{ borderColor: "teal.400" }}
                    >
                      <Circle
                        size="64px"
                        bg={colorMode === "dark" ? "gray.700" : "gray.200"}
                      >
                        <Icon as={FiGrid} boxSize="32px" color="gray.500" />
                      </Circle>
                      <VStack spacing={2} textAlign="center">
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color={colorMode === "dark" ? "white" : "gray.800"}
                        >
                          Lihat Semua
                        </Text>
                        <Text
                          fontSize="xs"
                          color="gray.500"
                          lineHeight="1.4"
                        >
                          Fitur lainnya
                        </Text>
                      </VStack>
                    </VStack>
                  </Link>
                </MotionBox>
              </Grid>
            </VStack>
          </MotionBox>
          
          {/* Call to Action Section (TIDAK DIUBAH) */}
          <MotionBox variants={itemVariants}>
             <Box
               bg={
                 colorMode === "dark"
                   ? "linear-gradient(135deg, #1A202C 0%, #2D3748 100%)"
                   : "linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)"
               }
               borderRadius="2xl"
               p={8}
               textAlign="center"
               border="1px solid"
               borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
             >
               <VStack spacing={4}>
                 <Heading size="md" color={colorMode === "dark" ? "white" : "gray.800"}>
                   Mulai Perjalanan Spiritual Anda
                 </Heading>
                 <Text color="gray.500" maxW="md">
                   Jadikan Al-Qur'an sebagai pedoman hidup dengan membacanya secara rutin setiap hari
                 </Text>
                 <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
                   <Button
                     as={NextLink}
                     href="/surah"
                     colorScheme="green"
                     size="lg"
                     leftIcon={<FiBookOpen />}
                     borderRadius="xl"
                   >
                     Mulai Membaca
                   </Button>
                   <Button
                     as={NextLink}
                     href="/doa-harian"
                     variant="outline"
                     colorScheme="teal"
                     size="lg"
                     borderRadius="xl"
                   >
                     Lihat Do'a Harian
                   </Button>
                 </Stack>
               </VStack>
             </Box>
           </MotionBox>
        </MotionFlex>
      </Container>
    </>
  );
}