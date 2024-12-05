import { sampleQuizzes } from "@/app/constants";
import { Box, Flex, Heading, Button, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";

const QuizNavigation = ({ code }: { code: string }) => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const router = useRouter();

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
      p={{ base: 4, md: 6 }}
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
          <Flex wrap="wrap" gap={3}>
            {sampleQuizzes.map((quiz) => (
              <Button
                key={quiz.id}
                colorScheme="teal"
                onClick={() =>
                  router.push(`/dashboard/courses/${code}/quiz/${quiz.id}`)
                }
                width={{ base: "100%", sm: "auto" }} // Buttons stack full-width on small screens
              >
                {quiz.title}
              </Button>
            ))}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default QuizNavigation;
