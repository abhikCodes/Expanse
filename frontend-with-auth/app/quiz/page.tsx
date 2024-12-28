"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  VStack,
  Heading,
  Button,
  Text,
  Skeleton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Icon,
  ListItem,
  List,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiPlusCircle } from "react-icons/fi";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { API_QUIZ_BASE_URL, API_BASE_URL } from "../constants";

interface Course {
  course_id: number;
  course_name: string;
  course_code: string;
  course_description: string;
}

interface Quiz {
  quiz_id: number;
  quiz_description: string;
}

const QuizHomePage = () => {
  const { data: sessionData } = useSession();
  const role = sessionData?.user.role;
  const [courseData, setCourseData] = useState<Course[] | null>(null);
  const [quizData, setQuizData] = useState<Record<number, Quiz[]>>({});
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingQuizzes, setLoadingQuizzes] = useState<number | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();

  const bg = useColorModeValue("neutral.50", "neutral.50._dark"); // Background
  const cardTextColor = useColorModeValue("primary.900", "neutral.900._dark"); // Text color

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const response = await axios.get(`${API_BASE_URL}course?mode=all`, {
        headers: {
          Authorization: `Bearer ${sessionData?.idToken}`,
        },
      });
      setCourseData(response.data.data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch courses.",
        position: "top",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchQuizzesByCourse = useCallback(
    async (courseId: number) => {
      if (quizData[courseId]) return;

      setLoadingQuizzes(courseId);
      try {
        const response = await axios.get(
          `${API_QUIZ_BASE_URL}get-quiz-course/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${sessionData?.idToken}`,
            },
          }
        );
        setQuizData((prev) => ({
          ...prev,
          [courseId]: response.data.data,
        }));
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingQuizzes(null);
      }
    },
    [quizData, sessionData?.idToken]
  );

  const startQuiz = () => {
    if (selectedQuiz) {
      router.push(`/quiz/${selectedQuiz.quiz_id}`);
    }
  };

  const handleCreateQuiz = (courseId: number) => {
    router.push(`/quiz/create-quiz/${courseId}`);
    toast({
      title: "Create Quiz",
      description: "You are now creating a new quiz for this course.",
      position: "top",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box p={10} bg={bg} color={cardTextColor} minH="100vh">
      <Heading variant="h2" mb={5}>
        Quiz Home
      </Heading>
      {loadingCourses ? (
        <Skeleton height="20px" mb={4} />
      ) : courseData ? (
        <Accordion allowMultiple>
          {courseData.map((course) => (
            <AccordionItem key={course.course_id}>
              <h2>
                <AccordionButton
                  p="5"
                  fontSize="lg"
                  onClick={() => fetchQuizzesByCourse(course.course_id)}
                >
                  <Box flex="1" textAlign="left">
                    {course.course_name} - {course.course_code}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel p={4}>
                <Flex justify="space-between" align="center">
                  <Box flex="1">
                    {loadingQuizzes === course.course_id ? (
                      <Skeleton height="40px" />
                    ) : (
                      <VStack align="start" spacing={3}>
                        <List spacing={2}>
                          {quizData[course.course_id]?.length ? (
                            quizData[course.course_id].map((quiz) => (
                              <ListItem key={quiz.quiz_id}>
                                <Button
                                  variant="link"
                                  fontSize="md"
                                  colorScheme="teal"
                                  onClick={() => {
                                    setSelectedQuiz(quiz);
                                    onOpen();
                                  }}
                                >
                                  {quiz.quiz_description}
                                </Button>
                              </ListItem>
                            ))
                          ) : (
                            <Text>No quizzes available for this course.</Text>
                          )}
                        </List>
                      </VStack>
                    )}
                  </Box>
                  {role === "teacher" && (
                    <Button
                      leftIcon={<Icon as={FiPlusCircle} />}
                      colorScheme="teal"
                      onClick={() => handleCreateQuiz(course.course_id)}
                    >
                      Create New Quiz
                    </Button>
                  )}
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Text>No courses available.</Text>
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {role === "teacher" ? "View Quiz" : "Start Quiz"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {role === "teacher" ? (
              <Text>Do you want to view the Quiz?</Text>
            ) : (
              <Text>Do you want to start the Quiz?</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button mr="2" colorScheme="teal" onClick={startQuiz}>
              {role === "teacher" ? "View" : "Start"}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default QuizHomePage;
