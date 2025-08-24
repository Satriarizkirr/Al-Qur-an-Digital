// file: components/SejarahIslamSearch.js

import { useState } from 'react';
import {
  Box,
  Input,
  Button,
  Text,
  VStack,
  Heading,
  Spinner,
  HStack,
  useColorMode,
  Icon,
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';

export default function SejarahIslamSearch() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { colorMode } = useColorMode();

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    setAnswer('');
    setError('');

    try {
      const response = await fetch('/api/search-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan');
      }

      setAnswer(data.answer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      bg={colorMode === "dark" ? "gray.800" : "white"}
      borderRadius="xl"
      p={{ base: 6, md: 8 }}
      boxShadow="md"
      border="1px solid"
      borderColor={colorMode === "dark" ? "gray.700" : "gray.100"}
    >
      <VStack spacing={5} align="stretch">
        <VStack align="start">
          <Heading as="h3" size="lg">Tanya Jawab Sejarah Islam</Heading>
          <Text color="gray.500">
            Didukung oleh AI. Ajukan pertanyaan tentang peristiwa, tokoh, atau tempat dalam sejarah Islam.
          </Text>
        </VStack>
        
        <HStack>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Contoh: Siapakah sahabat nabi yang pertama masuk Islam?"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            size="lg"
            focusBorderColor="teal.500"
          />
          <Button 
            onClick={handleSearch} 
            isLoading={loading} 
            colorScheme="teal" 
            size="lg"
            px={8}
            leftIcon={<FiSearch />}
          >
            Tanya
          </Button>
        </HStack>

        {loading && <Spinner alignSelf="center" color="teal.500" />}

        {error && <Text color="red.500">Error: {error}</Text>}

        {answer && (
          <Box 
            p={5} 
            mt={4} 
            bg={colorMode === "dark" ? "gray.700" : "gray.50"} 
            borderRadius="md"
            border="1px solid"
            borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
          >
            <Text whiteSpace="pre-wrap">{answer}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}