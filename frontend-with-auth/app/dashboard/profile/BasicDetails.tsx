import {
  Box,
  VStack,
  Avatar,
  Heading,
  FormControl,
  FormLabel,
  useColorMode,
  Input,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";

const BasicDetails = () => {
  const { data: sessionData } = useSession();
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const role = sessionData?.user?.role;

  return (
    <Box
      flex={1}
      p={6}
      bg={isDarkMode ? "gray.800" : "white"}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
      mb={{ base: 6, md: 0 }}
    >
      <VStack spacing={4} align="center">
        <Avatar
          size="xl"
          src={sessionData?.user?.image || ""}
          name={sessionData?.user?.name || ""}
        />
        <Heading
          as="h2"
          size="lg"
          color={isDarkMode ? "_dark.300" : "primary.900"}
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

        <FormControl id="account-type">
          <FormLabel>Account Type</FormLabel>
          <Input
            type="text"
            value={role === "student" ? "Student" : "Teacher"}
            isReadOnly
          />
        </FormControl>
      </VStack>
    </Box>
  );
};

export default BasicDetails;
