import Head from "next/head";
import { useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Spinner, // Kita tetap butuh spinner untuk loading state
} from "@chakra-ui/react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import PageHeader from "@/components/PageHeader";
import iqraData from "../../data/iqra.json";

// Import 'dynamic' dari Next.js
import dynamic from "next/dynamic";

// Panggil komponen IqraViewer secara dinamis dan matikan SSR
const DynamicIqraViewer = dynamic(() => import("../../components/IqraViewer"), {
  ssr: false, // INI KUNCINYA
  loading: () => <VStack my={20}><Spinner size="xl" /></VStack>,
});


function IqraReader({ book }) {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  const handleNext = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Head>
        <title>{book.title} | Al-Qur'an Digital</title>
      </Head>

      <PageHeader title={book.title} goBack />

      <VStack as="main" spacing={4} py={6}>
        <HStack w="full" justify="space-between" px={4}>
          <Text fontSize="sm" color="gray.500">
            Halaman {currentPage} dari {numPages || "..."}
          </Text>
        </HStack>

        {/* Gunakan komponen dinamis di sini */}
        <DynamicIqraViewer
          file={`/pdfs/iqra${book.id}.pdf`}
          currentPage={currentPage}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
        />

        {numPages && (
          <HStack w="full" justify="space-between" px={4}>
            <Button
              onClick={handlePrev}
              isDisabled={currentPage === 1}
              leftIcon={<IoChevronBack />}
            >
              Sebelumnya
            </Button>
            <Button
              onClick={handleNext}
              isDisabled={currentPage === numPages}
              rightIcon={<IoChevronForward />}
              colorScheme="teal"
            >
              Berikutnya
            </Button>
          </HStack>
        )}
      </VStack>
    </>
  );
}

export default IqraReader;


// getStaticPaths dan getStaticProps tidak perlu diubah
export async function getStaticPaths() {
  const paths = iqraData.map((book) => ({
    params: { bookId: book.id.toString() },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const book = iqraData.find(b => b.id.toString() === params.bookId);
  return {
    props: {
      book,
    },
  };
}