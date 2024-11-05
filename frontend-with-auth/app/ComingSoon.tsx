"use client";
import { Box, Text, Button, VStack, Center } from "@chakra-ui/react";

const ComingSoonPage = () => {
  return (
    <Center
      h="100vh"
      bgGradient="to-r"
      gradientFrom="teal.400"
      gradientTo="blue.500"
    >
      <Box
        textAlign="center"
        p={{ base: 4, md: 8 }}
        boxShadow="xl"
        borderRadius="lg"
        bg="white"
        maxW="md"
      >
        <VStack gap={4}>
          <Text
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="bold"
            color="teal.600"
          >
            Coming Soon!
          </Text>
          <Text fontSize={{ base: "md", md: "lg" }} color="gray.700">
            Your Distributed Learning Platform <strong>Expanse</strong> will be
            up soon...
          </Text>
          <Button
            colorScheme="teal"
            border="sm"
            padding="2"
            size="lg"
            onClick={() => alert("Stay tuned!")}
            _hover={{ bg: "teal.600", transform: "scale(1.05)" }}
          >
            Notify Me
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default ComingSoonPage;
