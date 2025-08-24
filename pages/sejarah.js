// Contoh komponen, misal di pages/sejarah.js

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
} from '@chakra-ui/react';

export default function SejarahIslamSearch() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    setAnswer('');
    setError('');

    try {
      // Panggil "pintu belakang" kita, bukan API Google
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
    <VStack spacing={4} p={8} align="stretch">
      <Heading>Tanya Jawab Sejarah Islam</Heading>
      <Text>Ajukan pertanyaan tentang sejarah Islam, dan AI akan menjawabnya.</Text>
      
      <HStack>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Contoh: Kapan Perang Badar terjadi?"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} isLoading={loading} colorScheme="teal">
          Tanya
        </Button>
      </HStack>

      {loading && <Spinner />}

      {error && <Text color="red.500">Error: {error}</Text>}

      {answer && (
        <Box p={4} mt={4} bg="gray.100" borderRadius="md">
          <Text whiteSpace="pre-wrap">{answer}</Text>
        </Box>
      )}
    </VStack>
  );
}