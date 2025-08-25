import { Box, Flex } from "@chakra-ui/react"; // PERUBAHAN: Import Flex
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    // PERUBAHAN: Box diubah menjadi Flex, dan diatur sebagai kolom vertikal
    // yang mengisi minimal seluruh tinggi layar (100vh)
    <Flex direction="column" minH="100vh" maxW="576px" m="auto">
      
      {/* Konten utama (children) kita buat 'memuai' untuk mengisi ruang kosong */}
      <Box as="main" flex="1" pb="120px"> 
        {/* PERUBAHAN: 
          - Wrapper untuk children diberi prop flex="1" agar memuai.
          - mb="120px" diubah menjadi pb="120px" (padding-bottom) agar konten 
            paling bawah tidak tertutup oleh navbar yang posisinya fixed.
        */}
        {children}
      </Box>

      <Navbar />
    </Flex>
  );
}

export default Layout;