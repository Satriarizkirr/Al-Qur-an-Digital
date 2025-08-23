// File: components/IqraViewer.js

import { Box, Spinner, VStack, Text, useColorMode } from "@chakra-ui/react";
import { Document, Page, pdfjs } from "react-pdf";

// Konfigurasi worker
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

export default function IqraViewer({ file, currentPage, onDocumentLoadSuccess }) {
  const { colorMode } = useColorMode();

  return (
    <Box
      w="full"
      maxW="700px"
      bg={colorMode === "dark" ? "gray.700" : "white"}
      borderRadius="lg"
      boxShadow="lg"
      overflow="hidden"
      // PERBAIKAN: Beri tinggi minimal yang cukup besar untuk mencegah 'lompat'
      // Nilai ini bisa disesuaikan, tapi 50vh (50% tinggi layar) biasanya aman
      minH={{ base: "50vh", md: "60vh" }}
      display="flex"
      justifyContent="center"
    >
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <VStack w="full" h="full" minH="inherit" justifyContent="center">
            <Spinner size="xl" />
          </VStack>
        }
        error={
          <VStack w="full" h="full" minH="inherit" justifyContent="center">
            <Text>Gagal memuat PDF.</Text>
          </VStack>
        }
      >
        <Page 
          pageNumber={currentPage} 
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </Box>
  );
}