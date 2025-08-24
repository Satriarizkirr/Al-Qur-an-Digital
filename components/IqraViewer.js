import { Box, useColorMode, Text, Button, Image as ChakraImage, Spinner } from "@chakra-ui/react"; // PERUBAHAN 1: Ganti nama 'Image' dari Chakra UI
import { useState, useEffect } from "react";

export default function IqraViewer({ bookId, currentPage, onDocumentLoadSuccess }) {
  const { colorMode } = useColorMode();
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FUNGSI INI SUDAH DISIMPAN TAPI TIDAK DIPAKAI DI JSX, JADI SAYA HAPUS SEMENTARA
  // const [isMobile, setIsMobile] = useState(false);
  // useEffect(() => {
  //   const checkMobile = () => { /* ... */ };
  //   checkMobile();
  //   window.addEventListener('resize', checkMobile);
  //   return () => window.removeEventListener('resize', checkMobile);
  // }, []);

  // Efek ini akan berjalan setiap kali buku atau halaman berubah
  useEffect(() => {
    // Pastikan kita punya bookId dan currentPage sebelum melakukan apa pun
    if (!bookId || !currentPage) {
        setLoading(false);
        return;
    }
    
    setLoading(true);
    setError(null);
    
    // =======================================================================
    // PERUBAHAN 2: Sederhanakan path gambar. Hapus tebak-tebakan.
    // Kita tetapkan SATU format nama file yang benar dan konsisten.
    // =======================================================================
    // PENTING: Pastikan struktur folder dan file kamu di dalam folder `public`
    // SAMA PERSIS SEPERTI INI (semua huruf kecil untuk amannya):
    // -> public/images/iqra1/iqra1-01.png
    // -> public/images/iqra2/iqra2-01.png
    // -> dst...
    // =======================================================================

    const pageNumber = currentPage.toString().padStart(2, '0');
    const imagePath = `/images/iqra${bookId}/iqra${bookId}-${pageNumber}.png`;

    console.log(`Mencoba memuat gambar dari path: ${imagePath}`);

    // Perintah 'new Image()' sekarang aman karena namanya tidak bentrok lagi
    const img = new Image();
    
    img.onload = () => {
      console.log(`SUKSES! Gambar dimuat dari: ${imagePath}`);
      setImageUrl(imagePath);
      setLoading(false);
    };
    
    img.onerror = () => {
      const errorMessage = `Gagal memuat: ${imagePath}. Pastikan file ada & nama sudah benar (termasuk huruf besar/kecil).`;
      console.error(errorMessage);
      setError(errorMessage);
      setLoading(false);
    };
    
    img.src = imagePath;

    // Fungsi cleanup untuk mencegah error
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [bookId, currentPage]);


  // NOTE: Fungsi 'calculateTotalPages' ini sangat tidak efisien karena melakukan banyak 'fetch'.
  // Untuk sementara kita biarkan, tapi jika ingin lebih cepat, jumlah halaman sebaiknya
  // didefinisikan secara manual seperti di solusi saya sebelumnya.
  useEffect(() => {
    const calculateTotalPages = async () => {
      let pages = 0;
      const basePath = `/images/iqra${bookId}`; // Kita pakai satu format path yang konsisten
      let foundPages = 0;

      for (let i = 1; i <= 40; i++) { // Maksimal cek 40 halaman
        try {
          const pageNumber = i.toString().padStart(2, '0');
          const format = `${basePath}/iqra${bookId}-${pageNumber}.png`;
          const response = await fetch(format, { method: 'HEAD' });
          if (response.ok) {
            foundPages = i;
          } else {
            break; // Berhenti jika halaman tidak ditemukan
          }
        } catch {
          break;
        }
      }
      pages = foundPages;
      if (onDocumentLoadSuccess && pages > 0) {
        onDocumentLoadSuccess({ numPages: pages });
      }
    };

    if (bookId) {
      calculateTotalPages();
    }
  }, [bookId, onDocumentLoadSuccess]);

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
        justifyContent="center" // Pusatkan teks
        alignItems="center"
      >
        <Text fontSize="sm" color={colorMode === "dark" ? "gray.300" : "gray.600"}>
          Halaman {currentPage}
        </Text>
      </Box>
      
      {/* Content Area */}
      <Box p={4} minH="450px" display="flex" alignItems="center" justifyContent="center">
        {loading && (
          <Box textAlign="center">
            <Spinner size="xl" color="blue.500" />
            <Text mt={4}>Memuat halaman {currentPage}...</Text>
          </Box>
        )}
        
        {error && (
          <Box textAlign="center">
            <Text color="red.500" mb={4} fontSize="lg">
              📄 {error}
            </Text>
          </Box>
        )}
        
        {imageUrl && !loading && !error && (
          // PERUBAHAN 3: Gunakan nama komponen 'ChakraImage' yang baru
          <ChakraImage 
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