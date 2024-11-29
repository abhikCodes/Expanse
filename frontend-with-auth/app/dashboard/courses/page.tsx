"use client";
import React from "react";
import { courseData } from "@/app/constants";
import { Box, Flex } from "@chakra-ui/react";
import Course from "./course";
import { useRouter } from "next/navigation";

const Courses = () => {
  const router = useRouter();

  const handleClick = (course_code: string) => {
    router.push(`/dashboard/courses/${course_code}`);
  };
  return (
    <Box p={6} _dark={{ bg: "neutral.50._dark" }}>
      <Flex flexWrap="wrap" justifyContent="start" gap={8}>
        {courseData.data.map((course) => (
          <Box
            key={course.course_code}
            onClick={() => handleClick(course.course_code)}
          >
            <Course
              course_code={course.course_code}
              course_name={course.course_name}
              course_description={course.course_description}
            />
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default Courses;
