// pages/jadwal-sholat.js
import { Box, useColorMode } from '@chakra-ui/react';
import PageHeader from '../components/PageHeader';
import PrayerTimes from '../components/PrayerTimes';

export default function JadwalSholat() {
  const { colorMode } = useColorMode();

  return (
    <Box 
      minH="100vh" 
      bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}
    >
      <PageHeader 
        title="Jadwal Sholat" 
        goBack={true} 
      />
      
      <Box pb="100px"> {/* Padding bottom untuk navbar */}
        <PrayerTimes />
      </Box>
    </Box>
  );
}