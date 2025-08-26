import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Avatar,
  Card,
  CardBody,
  Icon,
  Link,
  useColorMode,
  Divider,
  Badge,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Head from "next/head";
import {
  IoLogoGithub,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoMailOutline,
  IoCodeSlash,
  IoBookOutline,
  IoHeartSharp,
  IoGlobeOutline,
  IoPersonOutline, // 1. TAMBAHIN ICON BARU DI SINI
} from "react-icons/io5";
import PageHeader from "@/components/PageHeader";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function About() {
  const { colorMode } = useColorMode();

  const developer = {
    name: "Satria Rizki R",
    role: "Full Stack Developer",
    avatar: "/images/pp.png",
    bio: "Passionate developer yang senang membangun aplikasi yang bermanfaat untuk umat. Semoga aplikasi Al-Qur'an digital ini dapat memudahkan dalam beribadah.",
    social: {
      github: "https://github.com/Satriarizkirr",
      instagram: "https://www.instagram.com/satriaaa_rr/",
      linkedin: "https://linkedin.com/in/SatriaRizki26",
      email: "rizkirsatria5@gmail.com"
    }
  };
  
  const socialLinks = [
    { name: 'GitHub', icon: IoLogoGithub, url: developer.social.github },
    { name: 'Instagram', icon: IoLogoInstagram, url: developer.social.instagram },
    { name: 'LinkedIn', icon: IoLogoLinkedin, url: developer.social.linkedin },
  ];
  
  const techStack = [
    { name: "Next.js", color: "blue" },
    { name: "React", color: "cyan" },
    { name: "Chakra UI", color: "green" },
    { name: "Framer Motion", color: "purple" },
  ];
  const dataSources = [
    { name: "equran.id API", description: "API untuk mendapatkan data Al-Qur'an lengkap dengan terjemahan", url: "https://equran.id/", icon: IoBookOutline },
    { name: "equran.id Audio", description: "Sumber audio dan data tambahan Al-Qur'an", url: "https://equran.id/", icon: IoGlobeOutline }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Head>
        <title>Tentang Aplikasi | Al-Quran Digital</title>
      </Head>
      
      <PageHeader title="Tentang Aplikasi" goBack />

      <MotionBox
        p={6}
        pb={24}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <VStack spacing={6} align="stretch">
          {/* Developer Info Card */}
          <MotionCard variants={itemVariants}>
            <CardBody>
              <VStack spacing={4}>
                <HStack w="full" justifyContent="start">
                  {/* 2. GANTI ICON LAMA DENGAN YANG BARU */}
                  <Icon as={IoPersonOutline} color="blue.500" />
                  <Heading size="md">Profil Developer</Heading>
                </HStack>
                <Avatar
                  size="xl"
                  src={developer.avatar}
                  name={developer.name}
                  border="4px solid"
                  borderColor="blue.400"
                />
                <VStack spacing={1} textAlign="center">
                  <Heading size="md">{developer.name}</Heading>
                  <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
                    {developer.role}
                  </Badge>
                  <Text
                    fontSize="sm"
                    color={colorMode === "dark" ? "gray.300" : "gray.600"}
                    textAlign="center"
                    pt={2}
                    maxW="md"
                  >
                    {developer.bio}
                  </Text>
                </VStack>
                
                <HStack spacing={4} pt={2}>
                  {socialLinks.map((social) => (
                    <Link href={social.url} isExternal key={social.name}>
                      <IconButton
                        aria-label={social.name}
                        icon={<Icon as={social.icon} boxSize={5} />}
                        variant="ghost"
                        isRound
                      />
                    </Link>
                  ))}
                </HStack>
                
                <Link href={`mailto:${developer.social.email}`} pt={2}>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    leftIcon={<IoMailOutline />}
                  >
                    Hubungi Developer
                  </Button>
                </Link>
              </VStack>
            </CardBody>
          </MotionCard>

          {/* Sisa konten lainnya tidak diubah */}
          
          <MotionCard variants={itemVariants}>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack>
                  <Icon as={IoCodeSlash} color="purple.500" />
                  <Heading size="md">Teknologi yang Digunakan</Heading>
                </HStack>
                <HStack spacing={2} flexWrap="wrap">
                  {techStack.map((tech) => (
                    <Badge key={tech.name} colorScheme={tech.color} px={3} py={1} borderRadius="full" fontSize="xs">
                      {tech.name}
                    </Badge>
                  ))}
                </HStack>
              </VStack>
            </CardBody>
          </MotionCard>

          <MotionCard variants={itemVariants}>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack>
                  <Icon as={IoGlobeOutline} color="green.500" />
                  <Heading size="md">Sumber Data</Heading>
                </HStack>
                <VStack spacing={3} align="stretch">
                  {dataSources.map((source, index) => (
                    <Box key={source.name}>
                      <HStack spacing={3} align="start">
                        <Icon as={source.icon} mt={1} color="blue.500" />
                        <VStack align="start" spacing={0} flex={1}>
                          <Link href={source.url} isExternal fontWeight="semibold" color="blue.500">
                            {source.name}
                          </Link>
                          <Text fontSize="sm" color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                            {source.description}
                          </Text>
                        </VStack>
                      </HStack>
                      {index < dataSources.length - 1 && <Divider mt={3} />}
                    </Box>
                  ))}
                </VStack>
              </VStack>
            </CardBody>
          </MotionCard>
          
          <MotionCard variants={itemVariants}>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack>
                  <Icon as={IoHeartSharp} color="red.500" />
                  <Heading size="md">Tentang Aplikasi</Heading>
                </HStack>
                <VStack spacing={3} align="start" as="div" fontSize="sm" color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                  <Text><strong>Versi:</strong> 1.0.0</Text>
                  <Text><strong>Rilis:</strong> Agustus 2025</Text>
                  <Text>Aplikasi Al-Qur'an Digital dibuat dengan tujuan memudahkan umat muslim dalam membaca dan mempelajari Al-Qur'an. Dilengkapi dengan fitur terjemahan, audio, dan pencarian yang mudah digunakan.</Text>
                </VStack>
              </VStack>
            </CardBody>
          </MotionCard>

          <MotionBox variants={itemVariants} textAlign="center" py={6}>
            <Text fontSize="sm" fontStyle="italic" color={colorMode === "dark" ? "gray.400" : "gray.500"}>
              "Semoga aplikasi ini bermanfaat dan mendapat berkah dari Allah SWT"
            </Text>
            <Text fontSize="xs" mt={2} color={colorMode === "dark" ? "gray.500" : "gray.400"}>
              Dibuat dengan ❤️ untuk umat muslim
            </Text>
          </MotionBox>
        </VStack>
      </MotionBox>
    </>
  );
}