import React from "react";
import { Box, VStack, Heading, Link } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import NextLink from "next/link";

const QuickLinks = () => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  return (
    <Box
      flex={1}
      p={6}
      bg={isDarkMode ? "gray.800" : "white"}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
      mt={4}
    >
      <VStack spacing={4} align="center">
        <Heading
          as="h2"
          size="lg"
          color={isDarkMode ? "_dark.300" : "primary.900"}
        >
          Quick Links
        </Heading>

        <VStack spacing={2} align="start" width="full">
          <Link
            as={NextLink}
            href="/quiz"
            color="teal.500"
            fontSize="lg"
            fontWeight="bold"
          >
            Quiz
          </Link>
          <Link
            as={NextLink}
            href="/discussions"
            color="teal.500"
            fontWeight="bold"
            fontSize="lg"
          >
            Discussions
          </Link>
          <Link
            as={NextLink}
            href="/dashboard/profile"
            color="teal.500"
            fontWeight="bold"
            fontSize="lg"
          >
            Profile Details
          </Link>
          <Link
            as={NextLink}
            href="/enrollment"
            color="teal.500"
            fontWeight="bold"
            fontSize="lg"
          >
            Enroll Students
          </Link>
        </VStack>
      </VStack>
    </Box>
  );
};

export default QuickLinks;
