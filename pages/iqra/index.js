import Head from "next/head";
import NextLink from "next/link";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  LinkBox,
  LinkOverlay,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import PageHeader from "@/components/PageHeader";
import iqraData from "../../data/iqra.json"; // Pastikan path ini benar

function IqraSelection() {
  const { colorMode } = useColorMode();

  return (
    <>
      <Head>
        <title>Belajar Iqra' | Al-Quran Digital</title>
      </Head>

      <PageHeader title="Belajar Iqra'" goBack />

      <Box as="main" px={{ base: 4, md: 6 }} py={6}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {iqraData.map((iqra) => (
            <LinkBox
              key={iqra.id}
              p={6}
              bg={colorMode === "dark" ? "gray.700" : "white"}
              borderRadius="lg"
              boxShadow="md"
              transition="all 0.2s ease-in-out"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "lg",
              }}
            >
              <VStack align="start" spacing={2}>
                <Heading size="md">
                  <LinkOverlay as={NextLink} href={`/iqra/${iqra.id}`}>
                    {iqra.title}
                  </LinkOverlay>
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  {iqra.description}
                </Text>
                <Text fontSize="xs" color="gray.400">
                  {iqra.totalPages} Halaman
                </Text>
              </VStack>
            </LinkBox>
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
}

export default IqraSelection;