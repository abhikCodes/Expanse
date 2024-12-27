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
  IconButton,
  useColorMode,
  HStack,
  Divider,
  Tooltip,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import {
  RiMacbookFill,
  RiUserLocationFill,
  RiNotification3Line,
} from "react-icons/ri";
import ToggleThemeButton from "./components/useColorMode";
import { useSession } from "next-auth/react";
import { notifications } from "./constants";
import { PiStudentFill } from "react-icons/pi";
import { TbMinusVertical } from "react-icons/tb";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const { status, data: sessionData } = useSession();
  const role = sessionData?.user.role;
  const router = useRouter();

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
          <Flex align="center" gap="4">
            {/* Notifications Menu */}
            {status === "authenticated" && role === "student" && (
              <Menu placement={"bottom"}>
                <MenuButton
                  as={IconButton}
                  mr="-2"
                  aria-label="Notifications"
                  icon={<RiNotification3Line />}
                  variant="ghost"
                  size="lg"
                  color={isDarkMode ? "whiteAlpha.900" : "gray.600"}
                  _hover={{ bg: isDarkMode ? "gray.700" : "gray.200" }}
                />
                <MenuList maxH="300px" overflowY="auto" p={2}>
                  {notifications.map((notification) => (
                    <Box width={"sm"} key={notification.id} mb={2}>
                      <HStack justify="space-between" align="start">
                        <Box>
                          <Text
                            fontWeight="bold"
                            color="teal.900"
                            fontSize="sm"
                          >
                            {notification.title}
                          </Text>
                          <Text
                            fontWeight="normal"
                            color="teal.700"
                            fontSize="sm"
                          >
                            {notification.description}
                          </Text>
                        </Box>
                        <Text
                          fontSize="xs"
                          color="gray.400"
                          whiteSpace="nowrap"
                        >
                          {notification.date}
                        </Text>
                      </HStack>
                      <Divider my={2} />
                    </Box>
                  ))}
                  {notifications.length === 0 && (
                    <Text textAlign="center" p={3} color="gray.500">
                      No notifications
                    </Text>
                  )}
                </MenuList>
              </Menu>
            )}
            {status === "authenticated" && role === "teacher" && (
              <Tooltip
                label="Assign Courses to Students"
                placement="bottom"
                hasArrow
              >
                <IconButton
                  mr="-2"
                  aria-label="Assign Courses"
                  icon={<PiStudentFill />}
                  variant="ghost"
                  size="lg"
                  color={isDarkMode ? "whiteAlpha.900" : "gray.600"}
                  _hover={{ bg: isDarkMode ? "gray.700" : "gray.200" }}
                  onClick={() => router.push("/enrollment")}
                />
              </Tooltip>
            )}
            {status === "authenticated" && <TbMinusVertical size="20px" />}
            <Menu>
              <Box fontWeight="semibold" justifySelf="center">
                <Text>{sessionData?.["user"]?.["name"]}</Text>
              </Box>
            </Menu>
            {/* Login/Register/Profile */}
            {status === "unauthenticated" && (
              <>
                <Link href="/api/auth/signin">Login</Link>
                <Link href="/register">Register</Link>
              </>
            )}
            {status === "authenticated" && (
              <Menu placement={"bottom"}>
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
