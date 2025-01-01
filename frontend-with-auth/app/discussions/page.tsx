"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Grid,
  GridItem,
  Text,
  Heading,
  Button,
  useColorModeValue,
  Stack,
  Box,
  Badge,
  Center,
} from "@chakra-ui/react";
import axios from "axios";
import { API_BASE_URL } from "../constants";
import { useSession } from "next-auth/react";
import { FaBook } from "react-icons/fa";

interface Course {
  course_code: string;
  course_name: string;
  course_description: string;
  course_created_by: number;
  course_updated_by: number;
  course_id: number;
  course_created_timestamp: string;
  course_updated_timestamp: string;
}

interface CourseResponse {
  data: {
    status: string;
    message: string;
    data: Course[];
    timestamp: string;
  };
}

const DiscussionHomePage = () => {
  const [courseData, setCourseData] = useState<Course[]>([]);
  const router = useRouter();
  const { data: sessionData, status } = useSession();

  useEffect(() => {
    if (sessionData) getCourses();
  }, [sessionData]);

  async function getCourses() {
    try {
      const response = await axios.get<CourseResponse>(
        `${API_BASE_URL}course?mode=all`,
        {
          headers: {
            Authorization: `Bearer ${sessionData?.idToken}`,
          },
        }
      );
      setCourseData(response?.data?.data as unknown as Course[]);
    } catch (error) {
      console.error(error);
    }
  }

  const textColor = useColorModeValue("gray.600", "white"); // Light/Dark text color
  const badgeColorScheme = useColorModeValue("teal", "cyan"); // Badge color scheme for light/dark
  const bg = useColorModeValue("neutral.500", "primary.900");

  if (status === "loading") return <>Loading...</>;

  return (
    <Box p={6}>
      <Heading mb={4} textAlign="center" color={textColor}>
        Explore Courses and Discussions
      </Heading>
      {courseData.length > 0 ? (
        <Grid templateColumns="repeat(12, 1fr)" gap={6}>
          {courseData.map((course) => (
            <GridItem
              key={course.course_code}
              colSpan={{ base: 12, sm: 6, md: 4, lg: 3 }}
              p={4}
              bg={bg}
              borderRadius="md"
              boxShadow="lg"
              transition="all 0.3s"
              _hover={{ transform: "scale(1.05)" }}
              onClick={() => router.push(`/discussions/${course.course_id}`)}
            >
              <Stack spacing={4}>
                <Box display="flex" alignItems="center">
                  <Box as={FaBook} w={6} h={6} color="teal.500" />
                  <Heading size="sm" ml={2} color={textColor}>
                    {course.course_name}
                  </Heading>
                </Box>
                <Text fontSize="sm" color={textColor} noOfLines={3}>
                  {course.course_description}
                </Text>
                <Badge colorScheme={badgeColorScheme} alignSelf="start">
                  Code: {course.course_code}
                </Badge>
                <Button
                  size="sm"
                  colorScheme="teal"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/discussions/${course.course_id}`);
                  }}
                >
                  Go to Discussion
                </Button>
              </Stack>
            </GridItem>
          ))}
        </Grid>
      ) : (
        <Center mt={10}>
          <Text fontSize="lg" color={textColor}>
            No courses available. Please check back later!
          </Text>
        </Center>
      )}
    </Box>
  );
};

export default DiscussionHomePage;
