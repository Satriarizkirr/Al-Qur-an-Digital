import Head from "next/head";
import Image from "next/image"; // DITAMBAHKAN: Import komponen Image dari Next.js
import NextLink from "next/link";
import {
  Box,
  Grid,
  Link,
  Text,
  useColorMode,
  VStack,
  Heading,
  Circle,
  Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { menuList } from "../data/menuList";
import { FiGrid } from "react-icons/fi";

const MotionBox = motion(Box);

export default function AllMenu() {
  const { colorMode } = useColorMode();

  return (
    <>
      <Head>
        <title>Semua Menu | Al-Quran Digital</title>
      </Head>
      <PageHeader title="Semua Menu" goBack />
      <Box as="main" p={{ base: 4, md: 6 }}>
        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }}
          gap={6}
          w="full"
        >
          {menuList.map((menu) => (
            <MotionBox
              key={menu.text}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
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
                  border="1px solid"
                  borderColor={colorMode === "dark" ? "gray.700" : "gray.100"}
                  justifyContent="center"
                >
                  <Circle
                    size="64px"
                    bg={colorMode === 'dark' ? `${menu.colorScheme}.900` : `${menu.colorScheme}.50`}
                  >
                    <Image src={menu.icon} width={32} height={32} alt={menu.text} />
                  </Circle>
                  <VStack spacing={1} textAlign="center">
                    <Text fontWeight="bold">{menu.text}</Text>
                    <Text fontSize="xs" color="gray.500">{menu.description}</Text>
                  </VStack>
                </VStack>
              </Link>
            </MotionBox>
          ))}
        </Grid>
      </Box>
    </>
  );
}