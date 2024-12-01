import { sampleQuizzes } from "@/app/constants";
import { Box, Flex, Heading, Button, useColorMode } from "@chakra-ui/react";
import router from "next/router";
import React from "react";

const QuizNavigation = ({ code }: { code: string }) => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
      p={6}
      mt={6}
      bg={isDarkMode ? "gray.800" : "white"}
    >
      <Flex direction="column">
        <Box mt={8}>
          <Heading
            as="h2"
            size="md"
            mb={4}
            color={isDarkMode ? "neutral.900" : "primary.900"}
          >
            Quizzes
          </Heading>
          <Flex>
            <Flex align="start" flexWrap="wrap" gap={3}>
              {sampleQuizzes.map((quiz) => (
                <Button
                  key={quiz.id}
                  colorScheme="teal"
                  onClick={() => router.push(`/quizzes/${code}/${quiz.id}`)}
                >
                  {quiz.title}
                </Button>
              ))}
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default QuizNavigation;
