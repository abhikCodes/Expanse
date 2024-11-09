"use client";
import { Box, Text, Button, VStack, Center } from "@chakra-ui/react";
import Link from "next/link";
import { ReactNode } from "react";

interface props {
  content: string;
  icon: ReactNode;
}

const ComingSoonPage = ({ content, icon }: props) => {
  return (
    <Center h="100vh" bgColor="to-r teal.400 blue.500">
      <Box
        textAlign="center"
        p={{ base: 4, md: 8 }}
        boxShadow="xl"
        borderRadius="lg"
        // bg="white"
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
            {content}
          </Text>
          {!icon ? (
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
          ) : (
            <Link className="py-2" href="/api/auth/signin">
              {icon}
            </Link>
          )}
        </VStack>
      </Box>
    </Center>
  );
};

export default ComingSoonPage;
