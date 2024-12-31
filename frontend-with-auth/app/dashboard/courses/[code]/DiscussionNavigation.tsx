import { Box, Heading, Button, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";

const DiscussionNavigation = ({ code }: { code: string }) => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const router = useRouter();
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
      p={6}
      bg={isDarkMode ? "gray.800" : "white"}
    >
      <Box mt={8}>
        <Heading
          as="h2"
          size="md"
          mb={4}
          color={isDarkMode ? "neutral.900" : "primary.900"}
        >
          Discussions
        </Heading>
        <Button onClick={() => router.push(`/discussions/${code}`)}>
          Go to Discussions
        </Button>
      </Box>
    </Box>
  );
};

export default DiscussionNavigation;
