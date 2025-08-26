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
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { 
  IoLocationOutline, 
  IoRefreshOutline,
  IoSunnyOutline,
  IoMoonOutline,
  IoPartlySunnyOutline,
  IoNotificationsOutline,
} from 'react-icons/io5';

// Daftar nama dan ikon sholat
const prayerInfo = {
  Fajr: { name: 'Subuh', icon: IoMoonOutline },
  Sunrise: { name: 'Terbit', icon: IoSunnyOutline },
  Dhuhr: { name: 'Dzuhur', icon: IoSunnyOutline },
  Asr: { name: 'Ashar', icon: IoPartlySunnyOutline },
  Maghrib: { name: 'Maghrib', icon: IoPartlySunnyOutline },
  Isha: { name: 'Isya', icon: IoMoonOutline },
};

export default function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [locationName, setLocationName] = useState('Mencari lokasi...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { colorMode } = useColorMode();
  const [audio, setAudio] = useState(null);

  const [adzanEnabled, setAdzanEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adzanEnabled');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  useEffect(() => {
    // --- FIX 1: GANTI URL DENGAN SUARA ADZAN ASLI ---
    setAudio(new Audio('https://www.islamcan.com/audio/adhan/azan2.mp3'));
  }, []);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adzanEnabled', JSON.stringify(adzanEnabled));
    }
  }, [adzanEnabled]);

  const fetchAndSetData = (latitude, longitude) => {
    setLoading(true);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=id`)
      .then(res => res.json())
      .then(data => {
        if (data && data.address) {
          const { village, town, city, county, state } = data.address;
          const locationString = [village, town, city, county, state].filter(Boolean).join(', ');
          setLocationName(locationString || 'Nama Lokasi Tidak Tersedia'); 
        } else {
          setLocationName('Nama Lokasi Tidak Tersedia');
        }
      }).catch(() => {
        setLocationName('Gagal Memuat Nama Lokasi');
      });

    fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`)
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) setPrayerTimes(data.data);
        else throw new Error('Data jadwal sholat tidak valid');
      }).catch(err => {
        setError(err.message);
      }).finally(() => {
        setLoading(false);
      });
  };

  // --- FIX 2: Minta lokasi dengan akurasi tinggi ---
  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => fetchAndSetData(position.coords.latitude, position.coords.longitude),
      () => setError('Gagal mendapatkan lokasi. Mohon izinkan akses di browser.'),
      { enableHighAccuracy: true } // Minta akurasi terbaik dari browser/GPS
    );
  };

  useEffect(() => {
    getUserLocation();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!adzanEnabled || !prayerTimes || !audio) return;
    const checkTime = () => {
      const now = new Date();
      const currentTimeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      Object.entries(prayerTimes.timings).forEach(([name, time]) => {
        if (name !== 'Sunrise' && time === currentTimeStr) {
          console.log(`Waktu ${name} tiba! Memutar adzan...`);
          audio.play().catch(e => console.error("Gagal memutar audio:", e));
        }
      });
    };
    const adzanChecker = setInterval(checkTime, 30000); 
    return () => clearInterval(adzanChecker);
  }, [adzanEnabled, prayerTimes, audio]);

  const { nextPrayer, prayers } = useMemo(() => {
    if (!prayerTimes) return { nextPrayer: null, prayers: [] };
    const prayerSchedule = Object.entries(prayerTimes.timings)
      .filter(([name]) => prayerInfo[name])
      .map(([name, time]) => {
        const [h, m] = time.split(':').map(Number);
        return { name, time, timeInMinutes: h * 60 + m };
      });
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    let next = prayerSchedule.find(p => p.name !== 'Sunrise' && p.timeInMinutes > currentTimeInMinutes);
    if (!next) next = prayerSchedule.find(p => p.name === 'Fajr');
    return { nextPrayer: next, prayers: prayerSchedule };
  }, [prayerTimes]);

  if (loading) return <Box p={8} textAlign="center"><Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="teal.500" size="xl" /></Box>;
  if (error) return <Box p={8}><Alert status="error"><AlertIcon />{error}</Alert></Box>;
  if (!prayerTimes) return null;

  return (
    <Box p={4} maxW="md" mx="auto" pb="100px">
      <VStack spacing={4} mb={6}>
        <Heading size="lg" textAlign="center">Jadwal Sholat</Heading>
        <VStack spacing={1} textAlign="center">
          <Text fontSize="lg" fontWeight="semibold">{prayerTimes.date.readable}</Text>
          <Text fontSize="2xl" fontWeight="bold" color="teal.500">
            {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {prayerTimes.date.hijri.day} {prayerTimes.date.hijri.month.en} {prayerTimes.date.hijri.year} H
          </Text>
          <HStack spacing={1} color="gray.500" fontSize="sm">
            <Icon as={IoLocationOutline} />
            <Text>{locationName}</Text>
          </HStack>
        </VStack>
        
        <FormControl display='flex' alignItems='center' justifyContent='space-between' p={3} bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'} borderRadius='lg'>
          <HStack>
            <Icon as={IoNotificationsOutline} />
            <FormLabel htmlFor='adzan-alerts' mb='0'>Notifikasi Adzan</FormLabel>
          </HStack>
          <Switch id='adzan-alerts' colorScheme='teal' isChecked={adzanEnabled} onChange={(e) => setAdzanEnabled(e.target.checked)} />
        </FormControl>
      </VStack>

      {nextPrayer && (
        <Box p={4} bg={colorMode === 'dark' ? 'teal.900' : 'teal.100'} borderRadius="lg" mb={6} textAlign="center">
          <Text fontSize="sm" color={colorMode === 'dark' ? 'teal.200' : 'teal.800'} fontWeight="semibold">SHOLAT SELANJUTNYA</Text>
          <Text fontSize="2xl" fontWeight="bold">{prayerInfo[nextPrayer.name].name}</Text>
          <Text fontSize="3xl" fontWeight="bold">{nextPrayer.time}</Text>
        </Box>
      )}
      
      <VStack spacing={0} divider={<Divider />}>
        {prayers.map(({ name, time }) => {
          const isNext = nextPrayer && nextPrayer.name === name;
          return (
            <Box key={name} w="full">
              <Flex
                align="center"
                justify="space-between"
                p={4}
                bg={isNext ? (colorMode === 'dark' ? 'gray.700' : 'gray.100') : 'transparent'}
              >
                <HStack spacing={4}>
                  <Icon as={prayerInfo[name].icon} boxSize={5} color={isNext ? 'teal.500' : 'gray.500'} />
                  <Text fontWeight={isNext ? 'bold' : 'medium'} fontSize="lg">
                    {prayerInfo[name].name}
                  </Text>
                </HStack>
                <Text fontWeight={isNext ? 'bold' : 'medium'} fontSize="lg">
                  {time}
                </Text>
              </Flex>
            </Box>
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