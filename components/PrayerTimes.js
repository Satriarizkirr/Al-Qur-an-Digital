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
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { 
  IoLocationOutline, 
  IoRefreshOutline,
  IoSunnyOutline,
  IoMoonOutline,
  IoPartlySunnyOutline,
  IoGlobeOutline,
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

const defaultAdzanSettings = {
  Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false
};

export default function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [useLocalTime, setUseLocalTime] = useState(true);
  const [userTimezone, setUserTimezone] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // SOLUSI MASALAH #1: Ambil settingan dari localStorage pas pertama kali load
  const [adzanSettings, setAdzanSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('adzanSettings');
      return savedSettings ? JSON.parse(savedSettings) : defaultAdzanSettings;
    } catch (error) {
      console.error("Failed to parse adzan settings from localStorage", error);
      return defaultAdzanSettings;
    }
  });

  const [playingAdzan, setPlayingAdzan] = useState(false);
  const [locationName, setLocationName] = useState('');
  const { colorMode } = useColorMode();

  // SOLUSI MASALAH #1: Simpan settingan ke localStorage setiap kali ada perubahan
  useEffect(() => {
    try {
      localStorage.setItem('adzanSettings', JSON.stringify(adzanSettings));
    } catch (error) {
      console.error("Failed to save adzan settings to localStorage", error);
    }
  }, [adzanSettings]);

  // Get location name, timezone, etc. (fungsi-fungsi lain tetap sama)
  const getLocationName = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=id`, {
        headers: { 'User-Agent': 'PrayerTimesApp/1.0' }
      });
      if (!response.ok) throw new Error("Geocoding failed");
      const data = await response.json();
      if (data.address) {
        const { village, town, city, state } = data.address;
        setLocationName([village, town, city, state].filter(Boolean).join(', '));
      } else {
        setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    } catch (error) {
      console.error('Error getting location name:', error);
      setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };
  
  const getUserTimezone = () => {
    try {
      setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch (error) {
      console.error('Error getting timezone:', error);
    }
  };

  const playAdzan = (prayerName) => {
    if (!adzanSettings[prayerName] || playingAdzan) return;
    setPlayingAdzan(true);
    const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'); // Ganti URL Adzan asli
    audio.play().catch(e => {
      console.error("Audio play failed:", e);
      setPlayingAdzan(false);
    });
    audio.onended = () => setPlayingAdzan(false);
  };
  
  const checkPrayerTime = (timings) => {
    const now = new Date();
    const currentTimeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    Object.keys(timings).forEach(prayerKey => {
      if (adzanSettings[prayerKey] && timings[prayerKey] === currentTimeStr) {
        playAdzan(prayerKey);
      }
    });
  };

  const fetchPrayerTimes = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2`);
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
    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung oleh browser ini');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        getLocationName(latitude, longitude);
        fetchPrayerTimes(latitude, longitude);
      },
      (err) => {
        setError('Gagal mendapatkan lokasi. Mohon izinkan akses lokasi.');
      }
    );
  };

  useEffect(() => {
    getUserTimezone();
    getUserLocation();
  }, []);

  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    const prayerCheckInterval = setInterval(() => {
      if (prayerTimes) checkPrayerTime(prayerTimes.timings);
    }, 60000); // Cek tiap menit

    return () => {
      clearInterval(timeInterval);
      clearInterval(prayerCheckInterval);
    };
  }, [prayerTimes, adzanSettings]);
  
  useEffect(() => {
    if (!prayerTimes) return;
  
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
  
    const prayerSchedule = Object.entries(prayerTimes.timings)
      .map(([name, time]) => {
        const [h, m] = time.split(':').map(Number);
        return { name, time, timeInMinutes: h * 60 + m };
      })
      .filter(p => prayerNames[p.name]);
  
    let next = prayerSchedule.find(p => p.timeInMinutes > currentTimeInMinutes);
  
    if (!next) {
      next = prayerSchedule[0]; // Fajr tomorrow
    }
    
    setNextPrayer(next);
  
  }, [currentTime, prayerTimes]);


  if (loading) return <Box p={6} textAlign="center"><Spinner size="xl" /></Box>;
  if (error) return <Box p={6}><Alert status="error"><AlertIcon />{error}</Alert></Box>;
  if (!prayerTimes) return null;

  const prayers = Object.entries(prayerTimes.timings)
    .filter(([key]) => prayerNames[key])
    .map(([key, time]) => ({ key, time }));

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
          <Text fontSize="sm" color="teal.600" fontWeight="semibold">SHOLAT SELANJUTNYA</Text>
          <Text fontSize="2xl" fontWeight="bold">{prayerNames[nextPrayer.name]}</Text>
          <Text fontSize="3xl" fontWeight="bold">{nextPrayer.time}</Text>
        </Box>
      )}

      {/* SOLUSI MASALAH #2: Pastikan blok .map() ini HANYA ADA SATU KALI */}
      <VStack spacing={3} divider={<Divider />}>
        {prayers.map(({ key, time }) => {
          const isNext = nextPrayer && nextPrayer.name === key;
          return (
            <MotionBox
              key={key}
              w="full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Flex
                align="center"
                justify="space-between"
                p={3}
                bg={isNext ? (colorMode === 'dark' ? 'gray.700' : 'gray.100') : 'transparent'}
                borderRadius="md"
              >
                <HStack spacing={4}>
                  <Icon as={prayerIcons[key]} boxSize={5} color={isNext ? 'teal.500' : 'gray.500'} />
                  <Text fontWeight={isNext ? 'bold' : 'medium'} fontSize="lg">
                    {prayerNames[key]}
                  </Text>
                </HStack>
                <HStack spacing={4}>
                  <Text fontWeight={isNext ? 'bold' : 'medium'} fontSize="lg">
                    {time}
                  </Text>
                  {key !== 'Sunrise' && (
                    <Switch
                      colorScheme="teal"
                      isChecked={adzanSettings[key]}
                      onChange={(e) => {
                        setAdzanSettings(prev => ({ ...prev, [key]: e.target.checked }));
                      }}
                    />
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