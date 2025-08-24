import { Box, Spinner, VStack, Text, useColorMode } from "@chakra-ui/react";
import { Document, Page, pdfjs } from "react-pdf";

// Pake CDN kalau di production, pake local kalau di development
const isProd = process.env.NODE_ENV === "production";
pdfjs.GlobalWorkerOptions.workerSrc = isProd
  ? `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
  : "/pdf.worker.min.js";

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
