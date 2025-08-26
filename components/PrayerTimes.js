import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
  useColorMode,
  Flex,
  Icon,
  Divider,
  Button,
  Switch,
} from '@chakra-ui/react';
import { 
  IoLocationOutline, 
  IoRefreshOutline,
  IoSunnyOutline,
  IoMoonOutline,
  IoPartlySunnyOutline,
} from 'react-icons/io5';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const prayerIcons = {
  Fajr: IoMoonOutline,
  Sunrise: IoSunnyOutline,
  Dhuhr: IoSunnyOutline,
  Asr: IoPartlySunnyOutline,
  Maghrib: IoPartlySunnyOutline,
  Isha: IoMoonOutline,
};

const prayerNames = {
  Fajr: 'Subuh',
  Sunrise: 'Terbit',
  Dhuhr: 'Dzuhur',
  Asr: 'Ashar',
  Maghrib: 'Maghrib',
  Isha: 'Isya',
};

const defaultAdzanSettings = {
  Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false
};

export default function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [locationName, setLocationName] = useState('Mencari lokasi...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { colorMode } = useColorMode();

  const [adzanSettings, setAdzanSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('adzanSettings');
      return savedSettings ? JSON.parse(savedSettings) : defaultAdzanSettings;
    }
    return defaultAdzanSettings;
  });

  useEffect(() => {
    localStorage.setItem('adzanSettings', JSON.stringify(adzanSettings));
  }, [adzanSettings]);

  const fetchPrayerTimes = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`);
      if (!response.ok) throw new Error('Gagal mengambil data jadwal sholat');
      const data = await response.json();
      if (data.code === 200) {
        setPrayerTimes(data.data);
      } else {
        throw new Error('Data jadwal sholat tidak valid');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung oleh browser ini.');
      setLoading(false);
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=id`);
          if (!geoResponse.ok) throw new Error('Gagal mengambil nama lokasi');
          
          const geoData = await geoResponse.json();
          
          if (geoData.address) {
            const { village, town, city, county, state } = geoData.address;
            const locationParts = [village, town, city, county, state].filter(Boolean);
            setLocationName(locationParts.join(', '));
          } else {
            setLocationName('Lokasi tidak dikenal');
          }
        } catch (e) {
          console.error("Gagal mengambil nama lokasi:", e);
          setLocationName('Gagal mendapatkan nama lokasi');
        }
        
        await fetchPrayerTimes(latitude, longitude);
      },
      (err) => {
        setError('Gagal mendapatkan lokasi. Mohon izinkan akses di browser.');
        setLoading(false);
      }
    );
  };
  
  useEffect(() => {
    getUserLocation();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { nextPrayer, prayers } = useMemo(() => {
    if (!prayerTimes) return { nextPrayer: null, prayers: [] };

    const prayerSchedule = Object.entries(prayerTimes.timings)
      .map(([name, time]) => {
        const [h, m] = time.split(':').map(Number);
        return { name, time, timeInMinutes: h * 60 + m };
      })
      .filter(p => prayerNames[p.name]);
    
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    
    let next = prayerSchedule.find(p => p.timeInMinutes > currentTimeInMinutes);
    if (!next) {
      next = prayerSchedule[0]; // Fajr tomorrow
    }

    return { nextPrayer: next, prayers: prayerSchedule };
  }, [prayerTimes]);


  if (loading) return <Box p={8} textAlign="center"><Spinner size="xl" color="teal.500" /><Text mt={2}>Memuat data...</Text></Box>;
  if (error) return <Box p={8}><Alert status="error"><AlertIcon />{error}</Alert></Box>;
  if (!prayerTimes) return null;

  return (
    <Box p={4} maxW="md" mx="auto" pb="100px">
      <VStack spacing={4} mb={6}>
        <Heading size="lg" textAlign="center"></Heading>
        <VStack spacing={1} textAlign="center">
          <Text fontSize="lg" fontWeight="semibold">{prayerTimes.date.readable}</Text>
          <Text fontSize="2xl" fontWeight="bold" color="teal.500">
            {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </Text>
          <Text fontSize="sm" color="gray.500">{prayerTimes.date.hijri.date} {prayerTimes.date.hijri.month.en} {prayerTimes.date.hijri.year} H</Text>
          {locationName && (
            <HStack spacing={1} color="gray.500" fontSize="sm">
              <Icon as={IoLocationOutline} />
              <Text>{locationName}</Text>
            </HStack>
          )}
        </VStack>
      </VStack>

      {nextPrayer && (
        <Box p={4} bg={colorMode === 'dark' ? 'teal.900' : 'teal.100'} borderRadius="lg" mb={6} textAlign="center">
          <Text fontSize="sm" color={colorMode === 'dark' ? 'teal.200' : 'teal.800'} fontWeight="semibold">SHOLAT SELANJUTNYA</Text>
          <Text fontSize="2xl" fontWeight="bold">{prayerNames[nextPrayer.name]}</Text>
          <Text fontSize="3xl" fontWeight="bold">{nextPrayer.time}</Text>
        </Box>
      )}
      
      <VStack spacing={0} divider={<Divider />}>
        {prayers.map(({ name, time }) => {
          const isNext = nextPrayer && nextPrayer.name === name;
          return (
            <MotionBox key={name} w="full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Flex
                align="center"
                justify="space-between"
                p={4}
                bg={isNext ? (colorMode === 'dark' ? 'gray.700' : 'gray.100') : 'transparent'}
                borderRadius="md"
              >
                <HStack spacing={4}>
                  <Icon as={prayerIcons[name]} boxSize={5} color={isNext ? 'teal.500' : 'gray.500'} />
                  <Text fontWeight={isNext ? 'bold' : 'medium'} fontSize="lg">
                    {prayerNames[name]}
                  </Text>
                </HStack>
                <HStack spacing={4}>
                  <Text fontWeight={isNext ? 'bold' : 'medium'} fontSize="lg">
                    {time}
                  </Text>
                  {name !== 'Sunrise' && (
                    <VStack spacing={0}>
                      <Switch
                        colorScheme="teal"
                        isChecked={adzanSettings[name]}
                        onChange={(e) => {
                          setAdzanSettings(prev => ({ ...prev, [name]: e.target.checked }));
                        }}
                      />
                      <Text fontSize="xs" color="gray.500">Adzan</Text>
                    </VStack>
                  )}
                </HStack>
              </Flex>
            </MotionBox>
          );
        })}
      </VStack>

      <Box textAlign="center" mt={6}>
        <Button leftIcon={<IoRefreshOutline />} variant="ghost" size="sm" onClick={getUserLocation}>
          Perbarui Lokasi
        </Button>
      </Box>
    </Box>
  );
}