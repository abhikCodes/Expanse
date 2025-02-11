"use client";
import React, { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Flex,
  Text,
  IconButton,
  HStack,
  RadioGroup,
  Radio,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_QUIZ_BASE_URL } from "../../../constants";
import { useSession } from "next-auth/react";

const CreateQuizPage = ({ params }: { params: { courseid: string } }) => {
  const [quizDescription, setQuizDescription] = useState<string>("");
  const { data: sessionData } = useSession();
  const maxScore = 100;
  const [questions, setQuestions] = useState([
    { question: "", options: { A: "", B: "", C: "" }, answer: "" },
  ]);
  const bg = useColorModeValue("neutral.50", "neutral.50._dark");
  const toast = useToast();
  const router = useRouter();
  const courseId = params.courseid;

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: { A: "", B: "", C: "" }, answer: "" },
    ]);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };
  const handleOptionChange = (
    questionIndex: number,
    optionKey: string,
    value: string
  ) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, idx) =>
        idx === questionIndex
          ? {
              ...question,
              options: { ...question.options, [optionKey]: value },
            }
          : question
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        quiz_description: quizDescription,
        quiz_content: questions.map((q, index) => ({
          ques_no: index + 1,
          question: q.question,
          options: q.options,
          answer: q.answer,
        })),
        max_score: maxScore,
        course_id: parseInt(courseId),
      };

      await axios.post(`${API_QUIZ_BASE_URL}create-quiz`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData?.idToken}`,
        },
      });

      toast({
        title: "Quiz Created",
        description: "Your quiz has been successfully created!",
        position: "top",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/quiz");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an issue creating the quiz. Try again.",
        status: "error",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  return (
    <Box p={6}>
      <Heading as="h1" mb={6}>
        Create Quiz for Course {courseId}
      </Heading>
      <VStack spacing={6} align="start">
        <FormControl isRequired>
          <FormLabel>Quiz Description</FormLabel>
          <Textarea
            value={quizDescription}
            onChange={(e) => setQuizDescription(e.target.value)}
            placeholder="Enter a description for the quiz"
          />
        </FormControl>
        {/* 
        <FormControl isRequired>
          <FormLabel>Maximum Score</FormLabel>
          <Input
            type="number"
            value={maxScore}
            onChange={(e) => setMaxScore(parseInt(e.target.value))}
            min={1}
            placeholder="Enter maximum score"
          />
        </FormControl> */}

        <VStack align="start" spacing={8} w="100%">
          {questions.map((question, index) => (
            <Box
              key={index}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              bg={bg}
              boxShadow="md"
              w="100%"
            >
              <Flex justify="space-between" align="center" mb={4}>
                <Text fontWeight="bold">Question {index + 1}</Text>
                {questions.length > 1 && (
                  <IconButton
                    size="sm"
                    colorScheme="red"
                    aria-label="Delete Question"
                    icon={<DeleteIcon />}
                    onClick={() => handleDeleteQuestion(index)}
                  />
                )}
              </Flex>
              <FormControl isRequired>
                <FormLabel>Question Text</FormLabel>
                <Input
                  value={question.question}
                  onChange={(e) => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[index].question = e.target.value;
                    setQuestions(updatedQuestions);
                  }}
                  placeholder={`Enter question ${index + 1}`}
                />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Options</FormLabel>
                <HStack spacing={4}>
                  {Object.entries(question.options).map(([key, value]) => (
                    <Input
                      key={key}
                      placeholder={`Option ${key}`}
                      value={value}
                      onChange={(e) =>
                        handleOptionChange(index, key, e.target.value)
                      }
                    />
                  ))}
                </HStack>
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Correct Answer</FormLabel>
                <RadioGroup
                  value={question.answer}
                  onChange={(value) => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[index].answer = value;
                    setQuestions(updatedQuestions);
                  }}
                >
                  <HStack spacing={4}>
                    {Object.keys(question.options).map((key) => (
                      <Radio key={key} value={key}>
                        {key}
                      </Radio>
                    ))}
                  </HStack>
                </RadioGroup>
              </FormControl>
            </Box>
          ))}
        </VStack>

        <Button
          colorScheme="teal"
          onClick={handleAddQuestion}
          leftIcon={<AddIcon />}
        >
          Add Question
        </Button>

        <Button
          colorScheme="teal"
          onClick={handleSubmit}
          isDisabled={!quizDescription || questions.some((q) => !q.answer)}
        >
          Submit Quiz
        </Button>
      </VStack>
    </Box>
  );
};

export default CreateQuizPage;
