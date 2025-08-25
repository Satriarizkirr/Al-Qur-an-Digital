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
} from "react-icons/io5";
import PageHeader from "@/components/PageHeader";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function About() {
  const { colorMode } = useColorMode();

  const developer = {
    name: "Satria RizkiRohmat",
    role: "Full Stack Developer",
    avatar: "/images/pp.png",
    bio: "Passionate developer yang senang membangun aplikasi yang bermanfaat untuk umat. Semoga aplikasi Al-Qur'an digital ini dapat memudahkan dalam beribadah.",
    social: {
      github: "https://github.com/Satriarizkirr",
      instagram: "https://instagram.com/satriaaa.rr",
      linkedin: "https://linkedin.com/in/SatriaRizki26",
      email: "rizkirsatria5@gmail.com"
    }
  };

  const techStack = [
    { name: "Next.js", color: "blue" },
    { name: "React", color: "cyan" },
    { name: "Chakra UI", color: "green" },
    { name: "Framer Motion", color: "purple" },
  ];

  const dataSources = [
    {
      name: "equran.id API",
      description: "API untuk mendapatkan data Al-Qur'an lengkap dengan terjemahan",
      url: "https://equran.id/api/v2/tafsir/",
      icon: IoBookOutline
    },
    {
      name: "equran.id Audio",
      description: "Sumber audio dan data tambahan Al-Qur'an",
      url: "https://equran.id/api/v2/surat/",
      icon: IoGlobeOutline
    }
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
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box px={6} pt={6} pb={24}>
          <VStack spacing={6} align="stretch">
            {/* Developer Info */}
            <MotionCard variants={itemVariants}>
              <CardBody>
                <VStack spacing={4}>
                  <Avatar
                    size="xl"
                    src={developer.avatar}
                    name={developer.name}
                    border="4px solid"
                    borderColor="blue.400"
                  />
                  <VStack spacing={2} textAlign="center">
                    <Heading size="md">{developer.name}</Heading>
                    <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
                      {developer.role}
                    </Badge>
                    <Text
                      fontSize="sm"
                      color={colorMode === "dark" ? "gray.300" : "gray.600"}
                      textAlign="center"
                    >
                      {developer.bio}
                    </Text>
                  </VStack>
                  <HStack spacing={4} pt={2}>
                    <Link href={developer.social.github} isExternal>
                      <Button variant="ghost" size="sm" leftIcon={<IoLogoGithub />}>
                        GitHub
                      </Button>
                    </Link>
                    <Link href={developer.social.instagram} isExternal>
                      <Button variant="ghost" size="sm" leftIcon={<IoLogoInstagram />}>
                        Instagram
                      </Button>
                    </Link>
                    <Link href={developer.social.linkedin} isExternal>
                      <Button variant="ghost" size="sm" leftIcon={<IoLogoLinkedin />}>
                        LinkedIn
                      </Button>
                    </Link>
                  </HStack>
                  <Link href={`mailto:${developer.social.email}`}>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      leftIcon={<IoMailOutline />}
                      variant="outline"
                    >
                      Hubungi Developer
                    </Button>
                  </Link>
                </VStack>
              </CardBody>
            </MotionCard>

            {/* Tech Stack */}
            <MotionCard variants={itemVariants}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack>
                    <Icon as={IoCodeSlash} color="purple.500" />
                    <Heading size="md">Teknologi yang Digunakan</Heading>
                  </HStack>
                  <HStack spacing={2} flexWrap="wrap">
                    {techStack.map((tech, index) => (
                      <Badge
                        key={index}
                        colorScheme={tech.color}
                        px={3} py={1} borderRadius="full" fontSize="xs"
                      >
                        {tech.name}
                      </Badge>
                    ))}
                  </HStack>
                </VStack>
              </CardBody>
            </MotionCard>

            {/* Data Sources */}
            <MotionCard variants={itemVariants}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack>
                    <Icon as={IoGlobeOutline} color="green.500" />
                    <Heading size="md">Sumber Data</Heading>
                  </HStack>
                  <VStack spacing={3} align="stretch">
                    {dataSources.map((source, index) => (
                      <Box key={index}>
                        <HStack spacing={3} align="start">
                          <Icon as={source.icon} mt={1} color="blue.500" />
                          <VStack align="start" spacing={1} flex={1}>
                            <Link
                              href={source.url}
                              isExternal
                              fontWeight="semibold"
                              color="blue.500"
                              _hover={{ textDecoration: "underline" }}
                            >
                              {source.name}
                            </Link>
                            <Text
                              fontSize="sm"
                              color={colorMode === "dark" ? "gray.300" : "gray.600"}
                            >
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

            {/* ====================================================== */}
            {/* BAGIAN TENTANG APLIKASI YANG KEMARIN HILANG, SEKARANG SUDAH ADA LAGI */}
            {/* ====================================================== */}
            <MotionCard variants={itemVariants}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack>
                    <Icon as={IoHeartSharp} color="red.500" />
                    <Heading size="md">Tentang Aplikasi</Heading>
                  </HStack>
                  <VStack spacing={3} align="start">
                    <Text fontSize="sm" color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                      <strong>Versi:</strong> 1.0.0
                    </Text>
                    <Text fontSize="sm" color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                      <strong>Rilis:</strong> Agustus 2025
                    </Text>
                    <Text fontSize="sm" color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                      Aplikasi Al-Qur'an Digital dibuat dengan tujuan memudahkan umat muslim dalam membaca dan mempelajari Al-Qur'an. 
                      Dilengkapi dengan fitur terjemahan, audio, dan pencarian yang mudah digunakan.
                    </Text>
                  </VStack>
                </VStack>
              </CardBody>
            </MotionCard>

            {/* Doa Penutup */}
            <MotionBox 
              variants={itemVariants}
              textAlign="center"
              py={6}
            >
              <Text 
                fontSize="sm" 
                fontStyle="italic"
                color={colorMode === "dark" ? "gray.400" : "gray.500"}
              >
                "Semoga aplikasi ini bermanfaat dan mendapat berkah dari Allah SWT"
              </Text>
              <Text 
                fontSize="xs" 
                mt={2}
                color={colorMode === "dark" ? "gray.500" : "gray.400"}
              >
                Dibuat dengan ❤️ untuk umat muslim
              </Text>
            </MotionBox>
            
          </VStack>
        </Box>
      </MotionBox>
    </>
  );
}