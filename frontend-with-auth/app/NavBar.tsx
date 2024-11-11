"use client";
import {
  Avatar,
  Box,
  Container,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { RiMacbookFill, RiUserLocationFill } from "react-icons/ri";
import ToggleThemeButton from "./components/useColorMode";
// import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const NavBar = () => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const { status, data: sessionData } = useSession();
  return (
    <Box
      className="py-2 border-b-2 drop-shadow-md"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg={isDarkMode ? "primary.900" : "white"}
    >
      <Container>
        <Flex justify="space-between" align="center">
          <Link href="/">
            <Flex align="center" gap="2">
              <RiMacbookFill
                className="hover:scale-110 transition-transform"
                size="28"
              />
              <Text
                fontSize="xl"
                fontWeight="medium"
                textTransform="full-size-kana"
                letterSpacing="wide"
                color={isDarkMode ? "neutral.900" : "primary.900"}
                transition="all 0.3s ease"
                _hover={{
                  transform: "scale(1.05)",
                }}
              >
                Expanse
              </Text>
            </Flex>
          </Link>
          <Flex align="center" gap="3">
            {status === "unauthenticated" && (
              <>
                <Link href="/api/auth/signin">Login</Link>
                <Link href="/register">Register</Link>
              </>
            )}
            {status === "authenticated" && (
              <Menu flip={false}>
                <MenuButton>
                  <Avatar
                    referrerPolicy="no-referrer"
                    src={sessionData["user"]!["image"]!}
                    size="sm"
                    className="cursor-pointer"
                    icon={<RiUserLocationFill />}
                  />
                </MenuButton>
                <MenuList>
                  <Box justifySelf="center">
                    <Text>{sessionData?.["user"]?.["name"]}</Text>
                  </Box>
                  <MenuDivider />
                  <MenuItem>
                    <Link href="/dashboard/profile">Profile Details</Link>
                  </MenuItem>
                  <Link href="/api/auth/signout">
                    <MenuItem>Log Out</MenuItem>
                  </Link>
                </MenuList>
              </Menu>
            )}
            <ToggleThemeButton />
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default NavBar;
