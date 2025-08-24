import { Box, useColorMode, Text, Button, Image, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function IqraViewer({ bookId, currentPage, onDocumentLoadSuccess }) {
  const { colorMode } = useColorMode();
  const [isMobile, setIsMobile] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    // Detect mobile
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load image dari folder public/images
  const loadImage = () => {
    setLoading(true);
    setError(null);
    
    // Format nomor halaman dengan leading zero (01, 02, etc)
    const pageNumber = currentPage.toString().padStart(2, '0');
    
    // Path ke gambar berdasarkan struktur folder yang ada
    // /images/Iqra1/iqra1-01.png
    const imagePath = `/images/Iqra${bookId}/iqra${bookId}-${pageNumber}.png`;
    
    // Gunakan DOM Image constructor, bukan Chakra UI Image
    const img = document.createElement('img');
    img.onload = () => {
      setImageUrl(imagePath);
      setLoading(false);
    };
    img.onerror = () => {
      // Coba dengan format alternatif: page-1.jpg
      const altPath = `/images/Iqra${bookId}/page-${currentPage}.jpg`;
      const altImg = document.createElement('img');
      altImg.onload = () => {
        setImageUrl(altPath);
        setLoading(false);
      };
      altImg.onerror = () => {
        setError(`Halaman ${currentPage} tidak ditemukan`);
        setLoading(false);
      };
      altImg.src = altPath;
    };
    img.src = imagePath;
  };

  // Hitung total pages
  useEffect(() => {
    const calculateTotalPages = async () => {
      let pages = 0;
      // Untuk Iqra biasanya ada sekitar 20-30 halaman per buku
      for (let i = 1; i <= 40; i++) {
        try {
          // Format nomor dengan leading zero
          const pageNumber = i.toString().padStart(2, '0');
          
          // Cek format: iqra1-01.png
          const response = await fetch(`/images/Iqra${bookId}/iqra${bookId}-${pageNumber}.png`, { method: 'HEAD' });
          if (response.ok) {
            pages = i;
          } else {
            // Coba format alternatif: page-1.jpg
            const altResponse = await fetch(`/images/Iqra${bookId}/page-${i}.jpg`, { method: 'HEAD' });
            if (altResponse.ok) {
              pages = i;
            } else {
              break;
            }
          }
        } catch {
          break;
        }
      }
      
      setTotalPages(pages);
      if (onDocumentLoadSuccess && pages > 0) {
        onDocumentLoadSuccess({ numPages: pages });
      }
    };

    if (bookId) {
      calculateTotalPages();
    }
  }, [bookId, onDocumentLoadSuccess]);

  useEffect(() => {
    if (bookId && currentPage) {
      loadImage();
    }
  }, [bookId, currentPage]);

  return (
    <Box
      w="full"
      maxW="800px"
      mx="auto"
      bg={colorMode === "dark" ? "gray.700" : "white"}
      borderRadius="lg"
      boxShadow="lg"
      overflow="hidden"
      minH="500px"
      position="relative"
    >
      {/* Header */}
      <Box 
        p={3} 
        bg={colorMode === "dark" ? "gray.600" : "gray.100"}
        textAlign="center"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize="sm" color={colorMode === "dark" ? "gray.300" : "gray.600"}>
          Halaman {currentPage} {totalPages > 0 && `dari ${totalPages}`}
        </Text>
      </Box>
      
      {/* Content Area */}
      <Box p={4} minH="450px" display="flex" alignItems="center" justifyContent="center">
        {loading && (
          <Box textAlign="center">
            <Spinner size="xl" color="blue.500" />
            <Text mt={4} color={colorMode === "dark" ? "gray.300" : "gray.600"}>
              Memuat halaman {currentPage}...
            </Text>
          </Box>
        )}
        
        {error && (
          <Box textAlign="center">
            <Text color="red.500" mb={4} fontSize="lg">
              📄 {error}
            </Text>
            <Text mb={4} color={colorMode === "dark" ? "gray.400" : "gray.600"}>
              Pastikan gambar ada di: public/images/Iqra{bookId}/iqra{bookId}-{currentPage.toString().padStart(2, '0')}.png
            </Text>
          </Box>
        )}
        
        {imageUrl && !loading && (
          <Image 
            src={imageUrl}
            alt={`${bookId} - Halaman ${currentPage}`}
            maxW="100%"
            maxH="400px"
            objectFit="contain"
            borderRadius="md"
          />
        )}
      </Box>
    </Box>
  );
}