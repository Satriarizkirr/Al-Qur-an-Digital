import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Button,
  Text,
  useColorMode,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import Layout from "../../components/Layout";
import IqraViewer from "../../components/IqraViewer";

// Custom Chevron Icons (gak perlu @chakra-ui/icons)
const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
  </svg>
);

export default function IqraBook() {
  const router = useRouter();
  const { bookId } = router.query;
  const { colorMode } = useColorMode();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Reset page ketika bookId berubah
  useEffect(() => {
    if (bookId) {
      setCurrentPage(1);
      setLoading(true);
    }
  }, [bookId]);

  // Handle document load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  // Navigation functions
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(numPages);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowLeft") goToPrevPage();
      if (event.key === "ArrowRight") goToNextPage();
      if (event.key === "Home") goToFirstPage();
      if (event.key === "End") goToLastPage();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, numPages]);

  if (!bookId) {
    return (
      <Layout>
        <Container maxW="container.lg" py={8}>
          <Text>Loading...</Text>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxW="container.lg" py={6}>
        <VStack spacing={6}>
          {/* Header */}
          <Box textAlign="center">
            <Button
              leftIcon={<ChevronLeftIcon />}
              variant="ghost"
              onClick={() => router.push("/iqra")}
              mb={4}
            >
              Kembali ke Daftar Iqra
            </Button>
            
            <Heading size="lg" color={colorMode === "dark" ? "white" : "gray.800"}>
              Iqra {bookId.replace("iqra", "")}
            </Heading>
            
            {!loading && (
              <Text color={colorMode === "dark" ? "gray.300" : "gray.600"} mt={2}>
                Total {numPages} halaman
              </Text>
            )}
          </Box>

          {/* PDF Viewer */}
          <Box>
            <IqraViewer
              bookId={bookId}
              currentPage={currentPage}
              onDocumentLoadSuccess={onDocumentLoadSuccess}
            />
          </Box>

          {/* Navigation Controls */}
          {!loading && numPages > 0 && (
            <Box>
              <VStack spacing={4}>
                {/* Page Info */}
                <Text fontSize="sm" color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                  Halaman {currentPage} dari {numPages}
                </Text>

                {/* Navigation Buttons */}
                <HStack spacing={2}>
                  <IconButton
                    icon={<ChevronLeftIcon />}
                    onClick={goToFirstPage}
                    isDisabled={currentPage === 1}
                    size="sm"
                    aria-label="Halaman pertama"
                    title="Halaman pertama (Home)"
                  />
                  
                  <Button
                    leftIcon={<ChevronLeftIcon />}
                    onClick={goToPrevPage}
                    isDisabled={currentPage === 1}
                    size="sm"
                  >
                    Sebelumnya
                  </Button>

                  <Box px={4}>
                    <Text fontWeight="medium" color={colorMode === "dark" ? "white" : "gray.800"}>
                      {currentPage}
                    </Text>
                  </Box>

                  <Button
                    rightIcon={<ChevronRightIcon />}
                    onClick={goToNextPage}
                    isDisabled={currentPage === numPages}
                    size="sm"
                  >
                    Berikutnya
                  </Button>

                  <IconButton
                    icon={<ChevronRightIcon />}
                    onClick={goToLastPage}
                    isDisabled={currentPage === numPages}
                    size="sm"
                    aria-label="Halaman terakhir"
                    title="Halaman terakhir (End)"
                  />
                </HStack>

                {/* Keyboard Shortcut Info */}
                <Text fontSize="xs" color={colorMode === "dark" ? "gray.500" : "gray.500"} textAlign="center">
                  Gunakan ← → untuk navigasi | Home/End untuk halaman pertama/terakhir
                </Text>
              </VStack>
            </Box>
          )}

          {/* Loading State */}
          {loading && (
            <Box textAlign="center" py={8}>
              <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                Memuat Iqra {bookId.replace("iqra", "")}...
              </Text>
            </Box>
          )}
        </VStack>
      </Container>
    </Layout>
  );
}