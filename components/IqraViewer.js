import { Box, Spinner, VStack, Text, useColorMode, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function IqraViewer({ file, currentPage, onDocumentLoadSuccess }) {
  const { colorMode } = useColorMode();
  const [useIframe, setUseIframe] = useState(false);
  const [pdfComponents, setPdfComponents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        const mobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        setIsMobile(mobile);
        
        // Untuk mobile, langsung gunakan iframe
        if (mobile) {
          setUseIframe(true);
          setLoading(false);
          return;
        }
      }
    };

    const loadPdfComponents = async () => {
      try {
        if (useIframe) {
          setLoading(false);
          return;
        }

        checkMobile();
        if (isMobile || useIframe) {
          setLoading(false);
          return;
        }

        const pdfModule = await import('react-pdf');
        const { Document, Page, pdfjs } = pdfModule;
        
        // Setup worker
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
        
        setPdfComponents({ Document, Page });
      } catch (err) {
        console.error('PDF components failed, switching to iframe:', err);
        setUseIframe(true);
      } finally {
        setLoading(false);
      }
    };

    loadPdfComponents();
  }, [useIframe, isMobile]);

  const switchToIframe = () => {
    setUseIframe(true);
  };

  if (loading) {
    return (
      <Box
        w="full"
        maxW="700px"
        bg={colorMode === "dark" ? "gray.700" : "white"}
        borderRadius="lg"
        boxShadow="lg"
        minH={{ base: "50vh", md: "60vh" }}
        display="flex"
        justifyContent="center"
      >
        <VStack w="full" h="full" minH="inherit" justifyContent="center">
          <Spinner size="xl" />
          <Text fontSize="sm" color="gray.500">Menyiapkan PDF viewer...</Text>
        </VStack>
      </Box>
    );
  }

  // Iframe fallback (selalu berhasil)
  if (useIframe || isMobile) {
    return (
      <Box
        w="full"
        maxW="700px"
        bg={colorMode === "dark" ? "gray.700" : "white"}
        borderRadius="lg"
        boxShadow="lg"
        overflow="hidden"
        minH={{ base: "50vh", md: "60vh" }}
        position="relative"
      >
        {/* Header info untuk iframe mode */}
        <Box 
          p={2} 
          bg={colorMode === "dark" ? "gray.600" : "gray.100"}
          textAlign="center"
        >
          <Text fontSize="xs" color={colorMode === "dark" ? "gray.300" : "gray.600"}>
            {isMobile ? "Mode Mobile" : "Mode Kompatibilitas"} - Halaman {currentPage}
          </Text>
        </Box>
        
        <Box h="calc(100% - 40px)" position="relative">
          <iframe
            src={`${file}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            width="100%"
            height="100%"
            style={{
              border: 'none',
              borderRadius: '0 0 8px 8px'
            }}
            title="PDF Viewer"
            onLoad={() => {
              if (onDocumentLoadSuccess) {
                // Simulasi callback untuk compatibility
                onDocumentLoadSuccess({ numPages: 1 });
              }
            }}
          />
        </Box>
      </Box>
    );
  }

  // react-pdf mode
  if (!pdfComponents) {
    return (
      <Box
        w="full"
        maxW="700px"
        bg={colorMode === "dark" ? "gray.700" : "white"}
        borderRadius="lg"
        boxShadow="lg"
        minH={{ base: "50vh", md: "60vh" }}
        display="flex"
        justifyContent="center"
        p={6}
      >
        <VStack w="full" h="full" minH="inherit" justifyContent="center" spacing={4}>
          <Text color="orange.500" textAlign="center">
            PDF viewer tidak dapat dimuat
          </Text>
          <Button colorScheme="blue" size="sm" onClick={switchToIframe}>
            Gunakan Mode Kompatibilitas
          </Button>
        </VStack>
      </Box>
    );
  }

  const { Document, Page } = pdfComponents;

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
        onLoadError={(error) => {
          console.error('PDF Load Error, switching to iframe:', error);
          switchToIframe();
        }}
        loading={
          <VStack w="full" h="full" minH="inherit" justifyContent="center">
            <Spinner size="xl" />
            <Text fontSize="sm" color="gray.500">Memuat PDF...</Text>
          </VStack>
        }
        error={
          <VStack w="full" h="full" minH="inherit" justifyContent="center" p={4} spacing={3}>
            <Text color="red.500" textAlign="center">
              Gagal dengan PDF viewer
            </Text>
            <Button size="sm" colorScheme="blue" onClick={switchToIframe}>
              Coba Mode Kompatibilitas
            </Button>
          </VStack>
        }
      >
        <Page 
          pageNumber={currentPage} 
          renderTextLayer={false}
          renderAnnotationLayer={false}
          scale={1.0}
          width={typeof window !== 'undefined' ? Math.min(window.innerWidth - 40, 700) : 700}
        />
      </Document>
    </Box>
  );
}
