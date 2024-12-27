"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Select,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
  VStack,
  Avatar,
} from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { API_BASE_URL } from "../constants";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

interface Course {
  course_id: number;
  course_name: string;
}

const StudentEnrollment = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const toast = useToast();

  if (sessionData?.user.role !== "teacher") {
    toast({
      title: "Unauthorised Access",
      status: "warning",
      position: "top",
      duration: 1000,
      isClosable: true,
    });
    router.push("/dashboard");
  }

  const [courseData, setCourseData] = useState<Course[] | null>(null);
  const [usersData, setUsersData] = useState<User[] | null>(null);
  const [enrolledUsers, setEnrolledUsers] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Define colors using the custom theme
  const bg = useColorModeValue("neutral.50", "neutral.50._dark"); // Background
  const cardBg = useColorModeValue("neutral.50", "neutral.50._dark"); // Card background
  const cardBorderColor = useColorModeValue("primary.700", "neutral.600._dark"); // Card border color
  const cardTextColor = useColorModeValue("primary.900", "neutral.900._dark"); // Text color

  useEffect(() => {
    getCourses();
    getUsers();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      getEnrolledUsers();
    }
  }, [selectedCourse]);

  async function getCourses() {
    try {
      const response = await axios.get(`${API_BASE_URL}course?mode=all`, {
        headers: {
          Authorization: `Bearer ${sessionData?.idToken}`,
        },
      });
      setCourseData(response.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }

  async function getUsers() {
    try {
      const response = await axios.get(`/api/users`);
      setUsersData(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  async function getEnrolledUsers() {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}enrolledUsers`, {
        params: { course_id: selectedCourse },
        headers: {
          Authorization: `Bearer ${sessionData?.idToken}`,
        },
      });
      setEnrolledUsers(response.data.data.users);
    } catch (error) {
      console.error("Error fetching enrolled users:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createEnrollment() {
    const payload = {
      course_id: selectedCourse,
      user_id: enrolledUsers,
    };

    try {
      await axios.post(`${API_BASE_URL}enrollUser`, payload, {
        headers: { Authorization: `Bearer ${sessionData?.idToken}` },
      });
      toast({
        title: "Changes Saved successfully",
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to Save Changes",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      console.error("Error enrolling students:", error);
    }
  }

  const addToEnrolled = (userID: string) => {
    setEnrolledUsers((prev) => [...prev, userID]);
  };

  const removeFromEnrolled = (userID: string) => {
    setEnrolledUsers((prev) => prev.filter((id) => id !== userID));
  };

  const availableUsers = usersData
    ? usersData.filter((user) => !enrolledUsers.includes(user.id))
    : [];

  const enrolledUserDetails = usersData
    ? usersData.filter((user) => enrolledUsers.includes(user.id))
    : [];

  return (
    <Box p={10} bg={bg} color={cardTextColor} minH="100vh">
      <Heading mb={5}>Student Enrollment</Heading>

      {/* Course Selection */}
      <Select
        placeholder="Select a course"
        onChange={(e) => setSelectedCourse(Number(e.target.value))}
        mb={5}
        bg={cardBg}
        color={cardTextColor}
        fontWeight="semibold"
        borderColor={cardBorderColor}
      >
        {courseData?.map((course) => (
          <option key={course.course_id} value={course.course_id}>
            {course.course_name}
          </option>
        ))}
      </Select>

      {/* User Selection */}
      {loading ? (
        <Flex justifyContent="center" alignItems="center">
          <Spinner size="lg" />
        </Flex>
      ) : (
        selectedCourse && (
          <Flex gap={5}>
            {/* Available Users */}
            <Box
              w="50%"
              p={4}
              borderWidth={1}
              borderRadius="md"
              borderColor={cardBorderColor}
              bg={cardBg}
            >
              <Heading size="md" mb={4}>
                Available Users
              </Heading>
              <Box maxH="300px" overflowY="auto">
                <VStack spacing={3}>
                  {availableUsers.map((user) => (
                    <Flex
                      key={user.id}
                      p={5}
                      w="100%"
                      bg={cardBg}
                      borderWidth={1}
                      borderRadius="md"
                      borderColor={cardBorderColor}
                      shadow="sm"
                      align="center"
                      justify="space-between"
                    >
                      <Flex align="center">
                        <Avatar name={user.name || ""} size="sm" mr={3} />
                        <Text>{user.name}</Text>
                      </Flex>
                      <Button
                        size="sm"
                        colorScheme="teal"
                        onClick={() => addToEnrolled(user.id)}
                      >
                        Enroll
                      </Button>
                    </Flex>
                  ))}
                </VStack>
              </Box>
            </Box>

            {/* Enrolled Users */}
            <Box
              w="50%"
              p={4}
              borderWidth={1}
              borderRadius="md"
              borderColor={cardBorderColor}
              bg={cardBg}
            >
              <Heading size="md" mb={4}>
                Enrolled Users
              </Heading>
              <Box maxH="300px" overflowY="auto">
                <VStack spacing={3}>
                  {enrolledUserDetails.map((user) => (
                    <Flex
                      key={user.id}
                      p={5}
                      w="100%"
                      bg={cardBg}
                      borderWidth={1}
                      borderRadius="md"
                      borderColor={cardBorderColor}
                      shadow="sm"
                      align="center"
                      justify="space-between"
                    >
                      <Flex align="center">
                        <Avatar name={user.name || ""} size="sm" mr={3} />
                        <Text>{user.name}</Text>
                      </Flex>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => removeFromEnrolled(user.id)}
                      >
                        Remove
                      </Button>
                    </Flex>
                  ))}
                </VStack>
              </Box>
            </Box>
          </Flex>
        )
      )}

      {/* Submit Button */}
      <Button
        colorScheme="teal"
        mt={5}
        onClick={createEnrollment}
        isDisabled={!selectedCourse}
      >
        Save Changes
      </Button>
    </Box>
  );
};

export default StudentEnrollment;
