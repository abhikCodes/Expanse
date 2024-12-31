import { API_QUIZ_BASE_URL } from "@/app/constants";
import {
  Box,
  Flex,
  Heading,
  Button,
  useColorMode,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Quiz {
  quiz_id: number;
  quiz_description: string;
}

const QuizNavigation = ({ code }: { code: string }) => {
  const { colorMode } = useColorMode();
  const { data: sessionData } = useSession();
  const isDarkMode = colorMode === "dark";
  const router = useRouter();

  const [quizData, setQuizData] = useState<Quiz[]>([]);

  useEffect(() => {
    fetchQuizzesByCourse();
  }, [code]);

  const fetchQuizzesByCourse = async () => {
    try {
      const response = await axios.get(
        `${API_QUIZ_BASE_URL}get-quiz-course/${code}`,
        {
          headers: {
            Authorization: `Bearer ${sessionData?.idToken}`,
          },
        }
      );
      const quizData = response.data.data.map((quiz: Quiz) => {
        return {
          quiz_id: quiz.quiz_id,
          quiz_description: quiz.quiz_description,
        };
      });

      setQuizData(quizData);
    } catch (error) {
      console.error(error);
    }
  };

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
            {quizData.length ? (
              quizData.map((quiz) => (
                <Button
                  key={quiz.quiz_id}
                  colorScheme="teal"
                  onClick={() => router.push(`/quiz`)}
                  width={{ base: "100%", sm: "auto" }}
                >
                  {quiz.quiz_description}
                </Button>
              ))
            ) : (
              <Text>No quizzes available for this course.</Text>
            )}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default QuizNavigation;
