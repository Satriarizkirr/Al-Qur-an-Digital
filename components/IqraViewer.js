import { Box, Spinner, VStack, Text, useColorMode, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function IqraViewer({ file, currentPage, onDocumentLoadSuccess }) {
  const { colorMode } = useColorMode();
  const [pdfComponents, setPdfComponents] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPdfComponents = async () => {
      try {
        setLoading(true);
        
        // Dynamic import untuk avoid SSR issues
        const pdfModule = await import('react-pdf');
        const { Document, Page, pdfjs } = pdfModule;
        
        // Setup worker dengan fallback
        try {
          // Coba local worker dulu
          pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
        } catch (workerError) {
          console.warn('Local worker failed, using CDN:', workerError);
          // Fallback ke CDN dengan HTTPS
          pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
        }
        
        setPdfComponents({ Document, Page });
        setError(null);
      } catch (err) {
        console.error('Failed to load PDF components:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPdfComponents();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Reload components
    window.location.reload();
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
          <Text fontSize="sm" color="gray.500">Memuat PDF viewer...</Text>
        </VStack>
      </Box>
    );
  }

  if (error || !pdfComponents) {
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
          <Text color="red.500" textAlign="center" fontSize="lg">
            PDF Viewer tidak dapat dimuat
          </Text>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Masalah kompatibilitas dengan browser atau jaringan
          </Text>
          <Button colorScheme="blue" size="sm" onClick={handleRetry}>
            Coba Lagi
          </Button>
          <Text fontSize="xs" color="gray.400" textAlign="center">
            Atau buka file PDF langsung di browser dengan mengklik{' '}
            <a href={file} target="_blank" rel="noopener noreferrer" style={{color: 'blue', textDecoration: 'underline'}}>
              di sini
            </a>
          </Text>
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
      position="relative"
    >
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => {
          console.error('PDF Document Load Error:', error);
        }}
        loading={
          <VStack w="full" h="full" minH="inherit" justifyContent="center">
            <Spinner size="xl" />
            <Text fontSize="sm" color="gray.500">Memuat dokumen PDF...</Text>
          </VStack>
        }
        error={
          <VStack w="full" h="full" minH="inherit" justifyContent="center" p={4} spacing={3}>
            <Text color="red.500" textAlign="center">
              Gagal memuat dokumen PDF
            </Text>
            <Button 
              size="sm" 
              colorScheme="blue" 
              onClick={() => window.open(file, '_blank')}
            >
              Buka di Tab Baru
            </Button>
          </VStack>
        }
        options={{
          enableXfa: false,
          useSystemFonts: false,
          disableRange: false,
          disableStream: false,
        }}
      >
        <Page 
          pageNumber={currentPage} 
          renderTextLayer={false}
          renderAnnotationLayer={false}
          scale={1.0}
          width={typeof window !== 'undefined' ? Math.min(window.innerWidth - 40, 700) : 700}
          loading={
            <VStack justifyContent="center" p={4}>
              <Spinner size="lg" />
              <Text fontSize="sm" color="gray.500">Memuat halaman...</Text>
            </VStack>
          }
          error={
            <VStack justifyContent="center" p={4}>
              <Text color="red.500" fontSize="sm">Gagal memuat halaman</Text>
            </VStack>
          }
        />
      </Document>
    </Box>
  );
}
