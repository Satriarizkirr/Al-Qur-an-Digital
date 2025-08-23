import NextLink from "next/link";
import { useRouter } from "next/router";
import { Flex, Link, Icon, useColorMode } from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  IoHomeOutline,
  IoHomeSharp,
  IoBookOutline,
  IoBook,
  IoHeartOutline,
  IoHeart,
  IoSettingsOutline,
  IoSettings,
} from "react-icons/io5";

const MotionLink = motion(Link);
const MotionIcon = motion(Icon);

export default function Navbar() {
  const { colorMode } = useColorMode();
  const navLinks = [
    {
      text: "Beranda",
      icon: { outline: IoHomeOutline, fill: IoHomeSharp },
      href: "/",
      color: "blue.500",
    },
    {
      text: "Terakhir Baca",
      icon: { outline: IoBookOutline, fill: IoBook },
      href: "/terakhir-dibaca",
      color: "green.500",
    },
    {
      text: "Favorit",
      icon: { outline: IoHeartOutline, fill: IoHeart },
      href: "/favorit",
      color: "red.500",
    },
    {
      text: "Setelan",
      icon: { outline: IoSettingsOutline, fill: IoSettings },
      href: "/setelan",
      color: "purple.500",
    },
  ];

  const router = useRouter();

  return (
    <Flex
      as="nav"
      bg={colorMode === "dark" ? "gray.700" : "white"}
      justifyContent="space-around"
      position="fixed"
      inset="auto 0 0 0"
      maxW="576px"
      mx="auto"
      // DIUBAH: Bayangan dibuat lebih tegas (sm -> md) agar sama dengan header
      boxShadow="md"
      borderTopWidth="1px"
      borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
      display={
        router.pathname === "/surah/[id]" || router.pathname === "/404"
          ? "none"
          : "flex"
      }
      zIndex="sticky"
    >
      {navLinks.map(({ text, icon, href, color }) => {
        const isActive = router.pathname === href;
        
        return (
          <NextLink href={href} passHref key={text}>
            <MotionLink
              flex="1"
              _hover={{ textDecoration: "none" }}
              _focus={{ boxShadow: "none" }}
              whiteSpace="nowrap"
              py="10px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              fontSize="xs"
              fontWeight="500"
              rowGap={1}
              position="relative"
              color={isActive 
                ? color 
                : (colorMode === "dark" ? "gray.400" : "gray.500")
              }
              whileHover={{ 
                y: -3,
                transition: { type: "spring", stiffness: 400, damping: 15 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <MotionIcon
                as={isActive ? icon.fill : icon.outline}
                fontSize={{ base: "20px", sm: "22px" }}
              />
              {text}

              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    width: "24px",
                    height: "3px",
                    backgroundColor: color,
                    borderRadius: "2px",
                  }}
                />
              )}
            </MotionLink>
          </NextLink>
        );
      })}
    </Flex>
  );
}