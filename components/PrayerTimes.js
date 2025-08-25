import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  useColorMode,
  Flex,
  Icon,
  Divider,
  Button,
} from '@chakra-ui/react';
import { 
  IoLocationOutline, 
  IoTimeOutline, 
  IoRefreshOutline,
  IoSunnyOutline,
  IoMoonOutline,
  IoPartlySunnyOutline,
} from 'react-icons/io5';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

// Prayer icons mapping
const prayerIcons = {
  Fajr: IoMoonOutline,
  Sunrise: IoSunnyOutline,
  Dhuhr: IoSunnyOutline,
  Asr: IoPartlySunnyOutline,
  Maghrib: IoPartlySunnyOutline,
  Isha: IoMoonOutline,
};

// Prayer names in Indonesian
const prayerNames = {
  Fajr: 'Subuh',
  Sunrise: 'Terbit',
  Dhuhr: 'Dzuhur',
  Asr: 'Ashar',
  Maghrib: 'Maghrib',
  Isha: 'Isya',
};

export default function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const { colorMode } = useColorMode();

  // Get user location
  const getUserLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung oleh browser ini');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        await fetchPrayerTimes(latitude, longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Gagal mendapatkan lokasi. Pastikan lokasi diizinkan.');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  // Fetch prayer times from API
  const fetchPrayerTimes = async (lat, lng) => {
    try {
      const today = new Date();
      const dateString = today.toISOString().split('T')[0];
      
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${dateString}?latitude=${lat}&longitude=${lng}&method=2&school=0`
      );
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data jadwal sholat');
      }
      
      const data = await response.json();
      
      if (data.code === 200) {
        setPrayerTimes(data.data);
        calculateNextPrayer(data.data.timings);
      } else {
        throw new Error('Data jadwal sholat tidak valid');
      }
    } catch (err) {
      console.error('Error fetching prayer times:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate next prayer
  const calculateNextPrayer = (timings) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayers = [
      { name: 'Fajr', time: timings.Fajr },
      { name: 'Sunrise', time: timings.Sunrise },
      { name: 'Dhuhr', time: timings.Dhuhr },
      { name: 'Asr', time: timings.Asr },
      { name: 'Maghrib', time: timings.Maghrib },
      { name: 'Isha', time: timings.Isha },
    ];

    for (let prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTime = hours * 60 + minutes;
      
      if (prayerTime > currentTime) {
        const timeLeft = prayerTime - currentTime;
        const hoursLeft = Math.floor(timeLeft / 60);
        const minutesLeft = timeLeft % 60;
        
        setNextPrayer({
          ...prayer,
          timeLeft: { hours: hoursLeft, minutes: minutesLeft }
        });
        return;
      }
    }
    
    // If no prayer left today, set to Fajr tomorrow
    const fajrTomorrow = prayers[0];
    const [hours, minutes] = fajrTomorrow.time.split(':').map(Number);
    const fajrTime = hours * 60 + minutes;
    const timeLeft = (24 * 60) - currentTime + fajrTime;
    const hoursLeft = Math.floor(timeLeft / 60);
    const minutesLeft = timeLeft % 60;
    
    setNextPrayer({
      ...fajrTomorrow,
      timeLeft: { hours: hoursLeft, minutes: minutesLeft },
      tomorrow: true
    });
  };

  // Format time to 24-hour format
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  // Auto refresh every minute to update next prayer
  useEffect(() => {
    const interval = setInterval(() => {
      if (prayerTimes) {
        calculateNextPrayer(prayerTimes.timings);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [prayerTimes]);

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner size="lg" color="teal.500" />
        <Text mt={4} color="gray.500">
          Mengambil jadwal sholat...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={6}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box flex="1">
            <Text fontSize="sm">{error}</Text>
          </Box>
        </Alert>
        <Button
          mt={4}
          leftIcon={<IoRefreshOutline />}
          colorScheme="teal"
          variant="outline"
          onClick={getUserLocation}
          size="sm"
        >
          Coba Lagi
        </Button>
      </Box>
    );
  }

  if (!prayerTimes) return null;

  const prayers = [
    { key: 'Fajr', time: prayerTimes.timings.Fajr },
    { key: 'Sunrise', time: prayerTimes.timings.Sunrise },
    { key: 'Dhuhr', time: prayerTimes.timings.Dhuhr },
    { key: 'Asr', time: prayerTimes.timings.Asr },
    { key: 'Maghrib', time: prayerTimes.timings.Maghrib },
    { key: 'Isha', time: prayerTimes.timings.Isha },
  ];

  return (
    <Box p={6} maxW="md" mx="auto">
      {/* Header with date and location */}
      <VStack spacing={4} mb={6}>
        <Heading size="lg" textAlign="center">
      
        </Heading>
        
        <VStack spacing={2} textAlign="center">
          <Text fontSize="md" fontWeight="semibold">
            {prayerTimes.date.readable}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {prayerTimes.date.hijri.day} {prayerTimes.date.hijri.month.en} {prayerTimes.date.hijri.year} H
          </Text>
          
          {location && (
            <HStack spacing={1} color="gray.500" fontSize="sm">
              <Icon as={IoLocationOutline} />
              <Text>
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </Text>
            </HStack>
          )}
        </VStack>
      </VStack>

      {/* Next Prayer Countdown */}
      {nextPrayer && (
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          mb={6}
        >
          <Box
            p={4}
            bg={colorMode === 'dark' ? 'teal.900' : 'teal.50'}
            border="2px solid"
            borderColor="teal.200"
            borderRadius="lg"
            textAlign="center"
          >
            <Text fontSize="sm" color="teal.600" fontWeight="semibold">
              SHOLAT SELANJUTNYA
            </Text>
            <HStack justify="center" spacing={2} mt={2}>
              <Icon as={prayerIcons[nextPrayer.name]} boxSize={5} color="teal.500" />
              <Text fontSize="lg" fontWeight="bold" color="teal.600">
                {prayerNames[nextPrayer.name]}
              </Text>
            </HStack>
            <Text fontSize="2xl" fontWeight="bold" mt={1}>
              {formatTime(nextPrayer.time)}
            </Text>
            {nextPrayer.timeLeft && (
              <Text fontSize="sm" color="gray.600" mt={1}>
                {nextPrayer.timeLeft.hours > 0 && `${nextPrayer.timeLeft.hours} jam `}
                {nextPrayer.timeLeft.minutes} menit lagi
                {nextPrayer.tomorrow && ' (besok)'}
              </Text>
            )}
          </Box>
        </MotionBox>
      )}

      {/* Prayer Times List */}
      <VStack spacing={3}>
        {prayers.map((prayer, index) => {
          const IconComponent = prayerIcons[prayer.key];
          const isNext = nextPrayer && nextPrayer.name === prayer.key;
          
          return (
            <MotionBox
              key={prayer.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              w="full"
            >
              <Flex
                align="center"
                justify="space-between"
                p={4}
                bg={isNext 
                  ? (colorMode === 'dark' ? 'gray.700' : 'gray.50')
                  : 'transparent'
                }
                borderRadius="md"
                border={isNext ? '1px solid' : 'none'}
                borderColor={isNext ? 'teal.200' : 'transparent'}
              >
                <HStack spacing={3}>
                  <Icon 
                    as={IconComponent} 
                    boxSize={5} 
                    color={isNext ? 'teal.500' : 'gray.500'} 
                  />
                  <Text 
                    fontWeight={isNext ? 'bold' : 'medium'}
                    color={isNext ? 'teal.600' : undefined}
                  >
                    {prayerNames[prayer.key]}
                  </Text>
                  {isNext && (
                    <Badge colorScheme="teal" size="sm">
                      Selanjutnya
                    </Badge>
                  )}
                </HStack>
                
                <Text 
                  fontWeight={isNext ? 'bold' : 'medium'}
                  fontSize={isNext ? 'lg' : 'md'}
                  color={isNext ? 'teal.600' : undefined}
                >
                  {formatTime(prayer.time)}
                </Text>
              </Flex>
              
              {index < prayers.length - 1 && (
                <Divider opacity={0.3} />
              )}
            </MotionBox>
          );
        })}
      </VStack>

      {/* Refresh button */}
      <Box textAlign="center" mt={6}>
        <Button
          leftIcon={<IoRefreshOutline />}
          variant="ghost"
          size="sm"
          onClick={getUserLocation}
          colorScheme="teal"
        >
          Perbarui Lokasi
        </Button>
      </Box>
    </Box>
  );
}