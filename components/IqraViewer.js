import { Box, Spinner, VStack, Text, useColorMode, useBreakpointValue } from "@chakra-ui/react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

export default function IqraViewer({ file, currentPage, onDocumentLoadSuccess }) {
  const { colorMode } = useColorMode();
  const pageWidth = useBreakpointValue({ base: 300, sm: 400, md: 600 }); // dinamis

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
          width={pageWidth} // <— KUNCI SUPAYA MOBILE KE-RENDER
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </Box>
  );
}
