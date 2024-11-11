"use client";
import { Box, Text, Image, Stack, useColorMode } from "@chakra-ui/react";

interface Props {
  course_code: string;
  course_name: string;
  course_description: string;
}

const Course = ({ course_code, course_name, course_description }: Props) => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  return (
    <Box
      flexDirection="column"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={isDarkMode ? "primary.900" : "naturqal.900"}
      color="neutral.50"
      shadow="lg"
      width="300px"
      mb={6}
      p={4}
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: "scale(1.05)",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Image
        src={`https://via.placeholder.com/300?text=${encodeURIComponent(
          course_code
        )}`}
        alt={course_name}
        objectFit="cover"
        width="100%"
        height="180px"
        transition="transform 0.3s"
        _hover={{ transform: "scale(1.1)" }}
      />
      <Stack spacing={3} mt={4}>
        <Text
          fontSize="lg"
          fontWeight="bold"
          color={isDarkMode ? "naturqal.900" : "primary.900"}
        >
          {course_code}
        </Text>
        <Text
          fontSize="xl"
          fontWeight="semibold"
          color={isDarkMode ? "naturqal.900" : "primary.900"}
        >
          {course_name}
        </Text>
        <Text
          fontSize="sm"
          color={isDarkMode ? "naturqal.900" : "primary.900"}
          _dark={{ color: "neutral.600._dark" }}
        >
          {course_description}
        </Text>
      </Stack>
    </Box>
  );
};

export default Course;
