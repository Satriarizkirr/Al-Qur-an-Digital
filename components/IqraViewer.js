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

  // Load image dengan debugging yang lebih baik
  const loadImage = () => {
    setLoading(true);
    setError(null);
    
    // Format nomor halaman dengan leading zero (01, 02, etc)
    const pageNumber = currentPage.toString().padStart(2, '0');
    
    // Berdasarkan screenshot GitHub: Iqra1/Iqra1-01.png format
    const possiblePaths = [
      `/images/Iqra${bookId}/Iqra${bookId}-${pageNumber}.png`,
      `/images/Iqra${bookId}/iqra${bookId}-${pageNumber}.png`,
      `/images/iqra${bookId}/Iqra${bookId}-${pageNumber}.png`,
      `/images/iqra${bookId}/iqra${bookId}-${pageNumber}.png`,
      `/images/Iqra${bookId}/page-${currentPage}.png`,
      `/images/Iqra${bookId}/page-${currentPage}.jpg`,
    ];
    
    console.log('Attempting to load image for bookId:', bookId, 'page:', currentPage);
    console.log('Trying paths:', possiblePaths);
    
    // Try each path sequentially
    const tryPaths = (pathIndex = 0) => {
      if (pathIndex >= possiblePaths.length) {
        console.error('All paths failed for bookId:', bookId, 'page:', currentPage);
        setError(`Halaman ${currentPage} tidak ditemukan. Semua path gagal.`);
        setLoading(false);
        return;
      }
      
      const imagePath = possiblePaths[pathIndex];
      console.log(`Trying path ${pathIndex + 1}/${possiblePaths.length}:`, imagePath);
      
      const img = document.createElement('img');
      
      img.onload = () => {
        console.log('SUCCESS! Image loaded from:', imagePath);
        setImageUrl(imagePath);
        setLoading(false);
      };
      
      img.onerror = (error) => {
        console.error(`Failed to load: ${imagePath}`, error);
        // Try next path
        tryPaths(pathIndex + 1);
      };
      
      img.src = imagePath;
    };
    
    tryPaths();
  };

  // Hitung total pages dengan multiple format checking
  useEffect(() => {
    const calculateTotalPages = async () => {
      let pages = 0;
      
      // Array of possible folder structures
      const possibleBasePaths = [
        `/images/Iqra${bookId}`,
        `/images/iqra${bookId}`,
      ];
      
      for (const basePath of possibleBasePaths) {
        let foundPages = 0;
        
        for (let i = 1; i <= 40; i++) {
          try {
            const pageNumber = i.toString().padStart(2, '0');
            
            // Try different naming conventions
            const namingFormats = [
              `${basePath}/Iqra${bookId}-${pageNumber}.png`,
              `${basePath}/iqra${bookId}-${pageNumber}.png`,
              `${basePath}/page-${i}.jpg`,
            ];
            
            let pageFound = false;
            for (const format of namingFormats) {
              try {
                const response = await fetch(format, { method: 'HEAD' });
                if (response.ok) {
                  foundPages = i;
                  pageFound = true;
                  break;
                }
              } catch (error) {
                // Continue to next format
                continue;
              }
            }
            
            if (!pageFound) {
              break;
            }
          } catch {
            break;
          }
        }
        
        if (foundPages > pages) {
          pages = foundPages;
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
              BookId: {bookId}, Page: {currentPage}
            </Text>
            <Text fontSize="xs" color={colorMode === "dark" ? "gray.500" : "gray.500"}>
              Cek console untuk detail debugging
            </Text>
            <Button
              size="sm"
              mt={2}
              onClick={() => window.open(`https://github.com/Satriarizkirr/Al-Qur-an-Digital/tree/main/public/images/Iqra${bookId}`, '_blank')}
            >
              Cek GitHub Folder
            </Button>
          </Box>
        )}
        
        {imageUrl && !loading && (
          <Image 
            src={imageUrl}
            alt={`Iqra ${bookId} - Halaman ${currentPage}`}
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