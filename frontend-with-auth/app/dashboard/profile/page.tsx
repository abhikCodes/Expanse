"use client";
import {
  Box,
  VStack,
  Avatar,
  Heading,
  FormControl,
  FormLabel,
  Input,
  useColorMode,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";

const ProfilePage = () => {
  const { data: sessionData } = useSession();
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  return (
    <Box
      mx="auto"
      p={6}
      mt={5}
      bg={isDarkMode ? "primary.900" : "_dark.300"}
      shadow="lg"
      borderRadius="lg"
      textAlign="center"
    >
      <VStack spacing={6}>
        <Avatar
          size="xl"
          src={sessionData?.user?.image || ""}
          name={sessionData?.user?.name || ""}
        />
        <Heading
          as="h2"
          size="md"
          color={isDarkMode ? "_dark.300" : "primary.900"}
          mb={4}
        >
          Profile Information
        </Heading>

        <FormControl id="name">
          <FormLabel>Name</FormLabel>
          <Input type="text" value={sessionData?.user?.name || ""} isReadOnly />
        </FormControl>

        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={sessionData?.user?.email || ""}
            isReadOnly
          />
        </FormControl>
      </VStack>
    </Box>
  );
};

export default ProfilePage;
