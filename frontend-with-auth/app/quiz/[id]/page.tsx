"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  RadioGroup,
  Radio,
  Button,
  CircularProgress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Progress,
  Flex,
  useColorModeValue,
  ListItem,
  List,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_QUIZ_BASE_URL } from "../../constants";
import { useSession } from "next-auth/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";

interface Question {
  ques_no: number;
  question: string;
  options: Record<string, string>;
}

interface Quiz {
  quiz_id: number;
  description: string;
  content: Question[];
  max_score: number;
}

interface Result {
  quiz_id: number;
  submission_id: number;
  content: {
    ques_no: number;
    question: string;
    options: Record<string, string>;
    answer: string;
  }[];
  score: number;
}

interface Props {
  params: { id: string };
}

const QuizPage = ({ params: { id } }: Props) => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const toast = useToast();
  const userRole = sessionData?.user?.role; // Extract role from session data

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timer, setTimer] = useState<number>(600);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<Result | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const bg = useColorModeValue("neutral.50", "neutral.50._dark");
  const bgText = useColorModeValue("teal.700", "neutral.50.");
  const bgTextContent = useColorModeValue("teal.600", "neutral.50.");
  const quizId = id;

  useEffect(() => {
    if (quizId) {
      fetchQuizDetails();
    } else {
      setError("Invalid quiz ID.");
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (!loading && quiz) {
      handleTimerExpiry();
    }
  }, [timer, loading, quiz]);

  const fetchQuizDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_QUIZ_BASE_URL}get-quiz/${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionData?.idToken}`,
          },
        }
      );
      setQuiz(response.data.data);
    } catch (error) {
      setError("Failed to load quiz details. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (ques_no: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [ques_no]: answer,
    }));
  };

  const handleTimerExpiry = () => {
    toast({
      title: "Time's Up!",
      description: "Your quiz has been automatically submitted.",
      status: "warning",
      position: "top",
      duration: 5000,
      isClosable: true,
    });
    submitQuiz(true);
  };

  const submitQuiz = async (autoSubmit = false) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${API_QUIZ_BASE_URL}submit-quiz`,
        {
          quiz_id: quizId,
          answers: Object.entries(answers).map(([ques_no, answer]) => ({
            ques_no: parseInt(ques_no),
            answer,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${sessionData?.idToken}`,
          },
        }
      );
      setResult(response.data.data);
      setIsModalOpen(true);
      toast({
        title: "Quiz Submitted",
        description: autoSubmit
          ? "Your quiz was auto-submitted due to time expiry."
          : "Your quiz has been successfully submitted.",
        status: "success",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your quiz.",
        status: "error",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") return <>Loading...</>;

  if (loading) {
    return (
      <Box textAlign="center" p={6}>
        <CircularProgress isIndeterminate color="teal" />
        <Text mt={4}>Loading quiz details...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={6}>
        <Alert status="error" variant="subtle">
          <AlertIcon />
          <Box>
            <AlertTitle>Error Loading Quiz</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Box>
        </Alert>
      </Box>
    );
  }

  if (!quiz) {
    return (
      <Box p={6}>
        <Alert status="warning" variant="subtle">
          <AlertIcon />
          <Box>
            <AlertTitle>No Quiz Found</AlertTitle>
            <AlertDescription>
              {` We couldn't find the quiz you're looking for. Please try again.`}
            </AlertDescription>
          </Box>
        </Alert>
      </Box>
    );
  }
  if (userRole === "teacher") {
    return (
      <Box p={6}>
        <Button
          leftIcon={<ChevronLeftIcon />}
          colorScheme="teal"
          variant="link"
          onClick={() => router.back()}
          mb={6}
        >
          Back
        </Button>
        <Heading as="h1" mb={6} color={bgText}>
          {quiz.description} (Read-Only)
        </Heading>
        <VStack spacing={8} align="stretch">
          {quiz.content.map((question) => (
            <Box
              key={question.ques_no}
              p={6}
              borderRadius="lg"
              bg={bg}
              w="100%"
              border="1px"
              borderColor="primary.700"
            >
              <Text
                fontSize="lg"
                fontWeight="semibold"
                color={bgTextContent}
                mb={4}
              >
                {question.ques_no}. {question.question}
              </Text>
              <VStack align="start" spacing={2}>
                {/* Subtitle for Options */}
                <Text
                  fontWeight="bold"
                  color={bgTextContent}
                  fontSize="md"
                  mb={2}
                >
                  Options:
                </Text>
                <List spacing={2}>
                  {/* Map through options and add numbering */}
                  {Object.entries(question.options).map(
                    ([key, option], index) => (
                      <ListItem key={key} color="neutral.600" fontSize="md">
                        {/* Numbered options */}
                        {index + 1}. {option}
                      </ListItem>
                    )
                  )}
                </List>
              </VStack>
            </Box>
          ))}
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Heading as="h1" mb={4}>
        {quiz.description}
      </Heading>
      <Flex justify="space-between" align="center" mb={4}>
        <Text>
          Time Remaining:{" "}
          <Text as="span" fontWeight="bold">
            {Math.floor(timer / 60)}:
            {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
          </Text>
        </Text>
        <Progress
          value={(timer / 600) * 100}
          size="md"
          width="50%"
          colorScheme="teal"
        />
      </Flex>
      <VStack spacing={6} align="start">
        {quiz.content.map((question) => (
          <Box
            key={question.ques_no}
            p={5}
            borderRadius="md"
            boxShadow="md"
            bg={bg}
            w="100%"
          >
            <Text fontWeight="bold" mb={4}>
              {question.ques_no}. {question.question}
            </Text>
            <RadioGroup
              value={answers[question.ques_no] || ""}
              onChange={(value) => handleAnswerChange(question.ques_no, value)}
            >
              <VStack align="start">
                {Object.entries(question.options).map(([key, option]) => (
                  <Radio key={key} value={key}>
                    {option}
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>
          </Box>
        ))}
      </VStack>
      <Button
        colorScheme="teal"
        mt={8}
        onClick={() => submitQuiz()}
        isDisabled={
          Object.keys(answers).length < quiz.content.length || isSubmitting
        }
        isLoading={isSubmitting}
        loadingText="Submitting"
      >
        Submit Quiz
      </Button>

      {result && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalOverlay />
          <ModalContent maxW={{ base: "90%", md: "800px" }}>
            <ModalHeader>Quiz Results</ModalHeader>
            <ModalBody>
              <Text fontWeight="bold" mb={4}>
                Your Score: {result.score.toFixed(2)}%
              </Text>
              <VStack spacing={4} align="start">
                {result.content.map((question) => (
                  <Box
                    width="100%"
                    key={question.ques_no}
                    p={4}
                    border="1px"
                    borderRadius="md"
                    bg={bg}
                  >
                    <Text fontWeight="bold">
                      {question.ques_no}. {question.question}
                    </Text>
                    <List spacing={2} mt={2}>
                      {Object.entries(question.options).map(([key, option]) => (
                        <ListItem
                          key={key}
                          color={key === question.answer ? "green.500" : ""}
                          fontWeight={
                            key === question.answer ? "bold" : "normal"
                          }
                        >
                          {key}. {option}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="teal"
                onClick={() => {
                  setIsModalOpen(false);
                  router.push("/quiz");
                }}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default QuizPage;
