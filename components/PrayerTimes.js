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
  IoTimeOutline, 
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

export default function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [useLocalTime, setUseLocalTime] = useState(true); // New state for local time toggle
  const [userTimezone, setUserTimezone] = useState(null); // User's timezone
  const [currentTime, setCurrentTime] = useState(new Date()); // Current time state
  const [adzanSettings, setAdzanSettings] = useState({
    Fajr: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false
  }); // Adzan settings per prayer
  const [playingAdzan, setPlayingAdzan] = useState(false); // Currently playing adzan
  const [locationName, setLocationName] = useState(''); // User's location name
  const { colorMode } = useColorMode();

  // Get location name from coordinates
  const getLocationName = async (lat, lng) => {
    try {
      // Try multiple geocoding services as fallbacks
      const services = [
        // Service 1: OpenStreetMap Nominatim (free, no key required)
        {
          url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=id`,
          parser: (data) => {
            if (data.address) {
              const parts = [];
              if (data.address.village) parts.push(data.address.village);
              if (data.address.town) parts.push(data.address.town);
              if (data.address.city) parts.push(data.address.city);
              if (data.address.state) parts.push(data.address.state);
              return parts.join(', ') || data.display_name?.split(',')[0] || 'Lokasi Tidak Diketahui';
            }
            return 'Lokasi Tidak Diketahui';
          }
        },
        // Service 2: BigDataCloud (fallback)
        {
          url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`,
          parser: (data) => {
            const locationParts = [];
            if (data.locality) locationParts.push(data.locality);
            if (data.city && data.city !== data.locality) locationParts.push(data.city);
            if (data.principalSubdivision) locationParts.push(data.principalSubdivision);
            return locationParts.join(', ') || 'Lokasi Tidak Diketahui';
          }
        }
      ];

      for (const service of services) {
        try {
          const response = await fetch(service.url, {
            headers: {
              'User-Agent': 'PrayerTimesApp/1.0'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            const locationName = service.parser(data);
            if (locationName !== 'Lokasi Tidak Diketahui') {
              setLocationName(locationName);
              return;
            }
          }
        } catch (serviceError) {
          console.log(`Service failed, trying next:`, serviceError.message);
          continue;
        }
      }

      // If all services fail, use coordinates as fallback
      setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      
    } catch (error) {
      console.error('Error getting location name:', error);
      // Use coordinates as ultimate fallback
      setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  const getUserTimezone = () => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTimezone(timezone);
      return timezone;
    } catch (error) {
      console.error('Error getting timezone:', error);
      return null;
    }
  };

  // Convert UTC time to user's local timezone
  const convertToLocalTime = (utcTimeString, sourceTimezone = 'UTC') => {
    try {
      // Create a date object assuming the time is in the source timezone
      const [hours, minutes] = utcTimeString.split(':').map(Number);
      const today = new Date();
      
      // Create date in source timezone
      const sourceDate = new Date();
      sourceDate.setHours(hours, minutes, 0, 0);
      
      // If we have location, we can get more accurate timezone conversion
      // For now, we'll use a simple offset calculation
      const userTimezoneOffset = new Date().getTimezoneOffset();
      const jakartaOffset = -420; // Jakarta is UTC+7 (420 minutes behind UTC)
      
      // Calculate the difference
      const offsetDiff = jakartaOffset - userTimezoneOffset;
      const localDate = new Date(sourceDate.getTime() + (offsetDiff * 60000));
      
      const localHours = localDate.getHours().toString().padStart(2, '0');
      const localMinutes = localDate.getMinutes().toString().padStart(2, '0');
      
      return `${localHours}:${localMinutes}`;
    } catch (error) {
      console.error('Error converting time:', error);
      return utcTimeString; // Return original if conversion fails
    }
  };

  // Play adzan sound for specific prayer
  const playAdzan = (prayerName) => {
    if (!adzanSettings[prayerName]) return;
    
    setPlayingAdzan(prayerName);
    
    // Create audio element for adzan
    const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'); // You can replace with actual adzan audio URL
    audio.volume = 0.7;
    
    audio.play().then(() => {
      console.log(`Playing adzan for ${prayerName}...`);
    }).catch((error) => {
      console.error('Error playing adzan:', error);
      setPlayingAdzan(false);
    });
    
    audio.onended = () => {
      setPlayingAdzan(false);
    };
    
    // Stop after 3 minutes max
    setTimeout(() => {
      audio.pause();
      setPlayingAdzan(false);
    }, 180000);
  };

  // Check if it's prayer time and play adzan
  const checkPrayerTime = (timings) => {
    const now = new Date();
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    
    prayers.forEach(prayerName => {
      if (!adzanSettings[prayerName]) return;
      
      const prayerTime = getDisplayTime(timings[prayerName]);
      const [hours, minutes] = prayerTime.split(':').map(Number);
      const prayerTimeMinutes = hours * 60 + minutes;
      
      // Check if current time matches prayer time (within 1 minute)
      if (Math.abs(currentTimeMinutes - prayerTimeMinutes) <= 1 && !playingAdzan) {
        playAdzan(prayerName);
      }
    });
  };

  const getDisplayTime = (originalTime) => {
    if (!useLocalTime) return originalTime;
    return convertToLocalTime(originalTime);
  };

  // Get user location
  const getUserLocation = () => {
    setLoading(true);
    setError(null);
    setLocationName('Mendapatkan lokasi...'); // Show loading state for location
    
    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung oleh browser ini');
      setLocationName('Lokasi Tidak Diketahui');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          
          // Get location name first, then fetch prayer times
          await getLocationName(latitude, longitude);
          await fetchPrayerTimes(latitude, longitude);
        } catch (err) {
          console.error('Error in location processing:', err);
          setError('Gagal memproses data lokasi');
          setLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Gagal mendapatkan lokasi. ';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Izin lokasi ditolak. Silakan izinkan akses lokasi.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Informasi lokasi tidak tersedia.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Waktu tunggu habis. Coba lagi.';
            break;
          default:
            errorMessage += 'Terjadi kesalahan yang tidak diketahui.';
            break;
        }
        
        setError(errorMessage);
        setLocationName('Lokasi Tidak Diketahui');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased timeout
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  // Fetch prayer times from API
  const fetchPrayerTimes = async (lat, lng) => {
    try {
      // TIDAK PERLU MEMBUAT TANGGAL DI SINI LAGI
      // const today = new Date();
      // const dateString = today.toISOString().split('T')[0];
      
      const response = await fetch(
        // HAPUS ${dateString} DARI URL, BIARKAN API YANG MENENTUKAN HARI INI
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2&school=0`
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
      const displayTime = getDisplayTime(prayer.time);
      const [hours, minutes] = displayTime.split(':').map(Number);
      const prayerTime = hours * 60 + minutes;
      
      if (prayerTime > currentTime) {
        const timeLeft = prayerTime - currentTime;
        const hoursLeft = Math.floor(timeLeft / 60);
        const minutesLeft = timeLeft % 60;
        
        setNextPrayer({
          ...prayer,
          displayTime,
          timeLeft: { hours: hoursLeft, minutes: minutesLeft }
        });
        return;
      }
    }
    
    // If no prayer left today, set to Fajr tomorrow
    const fajrTomorrow = prayers[0];
    const displayTime = getDisplayTime(fajrTomorrow.time);
    const [hours, minutes] = displayTime.split(':').map(Number);
    const fajrTime = hours * 60 + minutes;
    const timeLeft = (24 * 60) - currentTime + fajrTime;
    const hoursLeft = Math.floor(timeLeft / 60);
    const minutesLeft = timeLeft % 60;
    
    setNextPrayer({
      ...fajrTomorrow,
      displayTime,
      timeLeft: { hours: hoursLeft, minutes: minutesLeft },
      tomorrow: true
    });
  };

  // Format time to 24-hour format
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  // Handle timezone toggle
  const handleTimezoneToggle = () => {
    setUseLocalTime(!useLocalTime);
    if (prayerTimes) {
      // Recalculate next prayer with new timezone setting
      setTimeout(() => {
        calculateNextPrayer(prayerTimes.timings);
      }, 100);
    }
  };

  useEffect(() => {
    getUserTimezone();
    getUserLocation();
    
    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Auto refresh every minute to update next prayer
  useEffect(() => {
    const interval = setInterval(() => {
      if (prayerTimes) {
        calculateNextPrayer(prayerTimes.timings);
        checkPrayerTime(prayerTimes.timings); // Check for prayer time
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [prayerTimes, useLocalTime, adzanSettings]); // Fixed: changed adzanEnabled to adzanSettings

  // Recalculate when timezone preference changes
  useEffect(() => {
    if (prayerTimes) {
      calculateNextPrayer(prayerTimes.timings);
    }
  }, [useLocalTime]);

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
          Jadwal Sholat
        </Heading>
        
        <VStack spacing={2} textAlign="center">
          <Text fontSize="md" fontWeight="semibold">
            {prayerTimes.date.readable}
          </Text>
          
          {/* Current Time Display */}
          <Text fontSize="lg" fontWeight="bold" color="teal.600">
            {currentTime.toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })}
          </Text>
          
          <Text fontSize="sm" color="gray.500">
            {prayerTimes.date.hijri.day} {prayerTimes.date.hijri.month.en} {prayerTimes.date.hijri.year} H
          </Text>
          
          {location && locationName && (
            <HStack spacing={1} color="gray.500" fontSize="sm">
              <Icon as={IoLocationOutline} />
              <Text>{locationName}</Text>
            </HStack>
          )}

          {/* Timezone Display */}
          {userTimezone && (
            <HStack spacing={1} color="gray.500" fontSize="xs">
              <Icon as={IoGlobeOutline} />
              <Text>{userTimezone}</Text>
            </HStack>
          )}
        </VStack>
      </VStack>

      {/* Timezone Toggle */}
      <Box mb={6} p={4} bg={colorMode === 'dark' ? 'gray.800' : 'gray.50'} borderRadius="md">
        <FormControl display="flex" alignItems="center" justifyContent="space-between">
          <FormLabel htmlFor="timezone-toggle" mb="0" fontSize="sm">
            <VStack align="start" spacing={0}>
              <Text>Gunakan Waktu Lokal</Text>
              <Text fontSize="xs" color="gray.500">
                {useLocalTime ? 'Waktu sesuai device Anda' : 'Waktu dari server Aladhan'}
              </Text>
            </VStack>
          </FormLabel>
          <Switch
            id="timezone-toggle"
            colorScheme="teal"
            isChecked={useLocalTime}
            onChange={handleTimezoneToggle}
          />
        </FormControl>
      </Box>

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
              {formatTime(nextPrayer.displayTime || nextPrayer.time)}
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
          const displayTime = getDisplayTime(prayer.time);
          
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
                <HStack spacing={3} flex={1}>
                  <Icon 
                    as={IconComponent} 
                    boxSize={5} 
                    color={isNext ? 'teal.500' : 'gray.500'} 
                  />
                  <VStack align="start" spacing={0} flex={1}>
                    <Text 
                      fontWeight={isNext ? 'bold' : 'medium'}
                      color={isNext ? 'teal.600' : undefined}
                    >
                      {prayerNames[prayer.key]}
                    </Text>
                    {useLocalTime && (
                      <Text fontSize="xs" color="gray.500">
                        Original: {formatTime(prayer.time)}
                      </Text>
                    )}
                  </VStack>
                  {isNext && (
                    <Badge colorScheme="teal" size="sm">
                      Selanjutnya
                    </Badge>
                  )}
                  {playingAdzan === prayer.key && (
                    <Badge colorScheme="green" size="sm">
                      🔊 Playing
                    </Badge>
                  )}
                </HStack>
                
                <HStack spacing={3}>
                  {/* Adzan Toggle for each prayer */}
                  {prayer.key !== 'Sunrise' && ( // Sunrise is not a prayer time
                    <VStack spacing={1}>
                      <Switch
                        size="sm"
                        colorScheme="teal"
                        isChecked={adzanSettings[prayer.key]}
                        onChange={(e) => setAdzanSettings(prev => ({
                          ...prev,
                          [prayer.key]: e.target.checked
                        }))}
                      />
                      <Text fontSize="xs" color="gray.500">
                        Adzan
                      </Text>
                    </VStack>
                  )}
                  
                  <Text 
                    fontWeight={isNext ? 'bold' : 'medium'}
                    fontSize={isNext ? 'lg' : 'md'}
                    color={isNext ? 'teal.600' : undefined}
                  >
                    {formatTime(displayTime)}
                  </Text>
                </HStack>
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