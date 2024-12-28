"use client";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  useColorMode,
  Text,
  HStack,
  Divider,
  Tag,
  Spinner,
  useToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  SimpleGrid,
  TagLabel,
  Flex,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/app/constants"; // Assuming this is where your base API URL is defined
import { DUMMY_QUIZZES } from "@/app/constants"; // Import dummy data for quizzes
import BasicDetails from "./BasicDetails";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@chakra-ui/icons";

interface Course {
  course_id: number;
  course_name: string;
  course_description: string;
  course_code: string;
}

interface Quiz {
  quiz_name: string;
  status: string;
  score?: number;
}

const ProfilePage = () => {
  const { data: sessionData } = useSession();
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const toast = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const history = useRouter();
  const role = sessionData?.user?.role; // Role can be 'student' or 'teacher'

  // Fetch courses for the user based on their role (student or teacher)
  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const response = await axios.get(API_BASE_URL + "course?mode=all", {
        headers: {
          Authorization: `Bearer ${sessionData?.idToken}`,
        },
      });
      if (response.status === 200) {
        setCourses(response.data.data); // Assuming the API returns courses for the student or teacher.
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error fetching courses",
        description: "There was an issue fetching your courses.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [sessionData?.idToken]);

  const handleClick = (course: Course) => {
    history.push(`courses/${course.course_id}`);
  };
  const displayQuizzes = (course: Course) => {
    // Fetch quizzes from dummy data based on the user's role
    const quizzes =
      role === "student" ? DUMMY_QUIZZES.student : DUMMY_QUIZZES.teacher;

    const courseQuizzes = quizzes.find(
      (q) => q.course_code === course.course_code
    )?.quizzes;
    console.log(courseQuizzes, "cs");

    return courseQuizzes?.map((quiz: Quiz, idx) => (
      <HStack
        py={3}
        key={idx}
        justify="space-between"
        width="100%"
        align="center"
      >
        <Text>{quiz.quiz_name}</Text>
        <HStack spacing={2}>
          {role === "student" && quiz.status === "completed" && (
            <Tag colorScheme="green" variant="subtle">
              <TagLabel>Completed - {quiz.score}/10</TagLabel>
            </Tag>
          )}
          {role === "student" && quiz.status === "pending" && (
            <Tag colorScheme="yellow" variant="subtle">
              <TagLabel>Pending</TagLabel>
            </Tag>
          )}
          {role === "student" && quiz.status === "expired" && (
            <Tag colorScheme="red" variant="subtle">
              <TagLabel>Expired</TagLabel>
            </Tag>
          )}
          {role === "teacher" && quiz.status === "pending" && (
            <Tag colorScheme="green" variant="subtle">
              <TagLabel>Quiz Open</TagLabel>
            </Tag>
          )}
          {role === "teacher" && quiz.status === "expired" && (
            <Tag colorScheme="red" variant="subtle">
              <TagLabel>Quiz Closed</TagLabel>
            </Tag>
          )}
        </HStack>
      </HStack>
    ));
  };

  return (
    <Box py={15}>
      <Button
        leftIcon={<ChevronLeftIcon />}
        colorScheme="teal"
        variant="link"
        onClick={() => history.back()}
        mb={2}
      >
        Back
      </Button>
      <Flex
        gap={5}
        direction={{ base: "column", md: "row" }}
        justify="space-between"
      >
        <BasicDetails />

        <Box
          flex={2}
          p={6}
          bg={isDarkMode ? "gray.900" : "white"}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="lg"
        >
          <Heading
            as="h3"
            size="lg"
            color={isDarkMode ? "_dark.300" : "primary.900"}
            textAlign="center"
            mb={6}
          >
            {role === "student" ? "Your Enrolled Courses" : "Your Courses"}
          </Heading>

          {loadingCourses ? (
            <Spinner size="xl" />
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {courses?.map((course: Course, index) => (
                <Card
                  key={index}
                  borderRadius="md"
                  boxShadow="lg"
                  bg={isDarkMode ? "gray.800" : "white"}
                >
                  <CardBody>
                    <Heading
                      as="h4"
                      size="md"
                      color={isDarkMode ? "_dark.300" : "primary.900"}
                    >
                      {course.course_name}
                    </Heading>
                    <Divider my={4} />
                    <Heading
                      as="h5"
                      size="sm"
                      color={isDarkMode ? "_dark.300" : "primary.900"}
                    >
                      Quizzes
                    </Heading>
                    {displayQuizzes(course)}
                  </CardBody>
                  {role === "teacher" && (
                    <CardFooter>
                      <Button
                        onClick={() => handleClick(course)}
                        variant="outline"
                        colorScheme="teal"
                        width="100%"
                      >
                        Manage Course
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Flex>
      <Box
        p={6}
        mt={6}
        bg={isDarkMode ? "gray.800" : "white"}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
      >
        <Heading
          as="h4"
          size="lg"
          color={isDarkMode ? "_dark.300" : "primary.900"}
          mb={4}
        >
          Social Networks
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* Facebook */}
          <Card>
            <CardBody>
              <FormControl id="facebook">
                <FormLabel>Facebook</FormLabel>
                <Input
                  type="text"
                  placeholder="e.g. http://www.facebook.com/myusername"
                />
              </FormControl>
            </CardBody>
          </Card>

          {/* X */}
          <Card>
            <CardBody>
              <FormControl id="twitter">
                <FormLabel>X</FormLabel>
                <Input
                  type="text"
                  placeholder="e.g. http://twitter.com/myusername"
                />
              </FormControl>
            </CardBody>
          </Card>

          {/* Google */}
          <Card>
            <CardBody>
              <FormControl id="google">
                <FormLabel>Google</FormLabel>
                <Input
                  type="text"
                  placeholder="e.g. https://profiles.google.com/myusername"
                />
              </FormControl>
            </CardBody>
          </Card>

          {/* LinkedIn */}
          <Card>
            <CardBody>
              <FormControl id="linkedin">
                <FormLabel>LinkedIn</FormLabel>
                <Input
                  type="text"
                  placeholder="e.g. http://www.linkedin.com/in/myusername"
                />
              </FormControl>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default ProfilePage;
