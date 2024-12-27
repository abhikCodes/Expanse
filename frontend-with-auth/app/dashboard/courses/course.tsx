"use client";
import {
  Box,
  Text,
  Stack,
  Button,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";

interface Props {
  course_code: string;
  course_id: number;
  course_name: string;
  course_description: string;
  role: string;
  onEdit: (course_code: string) => void;
  onDelete: (course_code: string) => void;
  onClick: (course_code: number) => void;
}

const Course = ({
  course_id,
  course_code,
  course_name,
  course_description,
  role,
  onEdit,
  onDelete,
  onClick,
}: Props) => {
  const bg = useColorModeValue("neutral.500", "primary.900");
  const color = useColorModeValue("primary.900", "neutral.50");

  return (
    <Box
      flexDirection="column"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bg}
      color={color}
      shadow="lg"
      width="300px"
      mb={6}
      p={4}
      onClick={() => onClick(course_id)}
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: "scale(1.05)",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Box
        height="180px"
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="md"
        mb={4}
        bgGradient="linear(to-br, teal.400, blue.500)"
        position="relative"
        overflow="hidden"
        transition="transform 0.3s ease, box-shadow 0.3s ease"
        _hover={{
          transform: "scale(1.05)",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Background Pattern */}
        <Box
          position="absolute"
          width="150%"
          height="150%"
          backgroundImage="radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15), rgba(0, 0, 0, 0.05))"
          transform="rotate(45deg)"
          zIndex={1}
          opacity={0.4}
        />

        {/* Icon */}
        <Box
          zIndex={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <Box
            as="svg"
            xmlns="http://www.w3.org/2000/svg"
            width="50px"
            height="50px"
            fill="white"
            viewBox="0 0 24 24"
            mb={2}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </Box>
          <Text fontSize="sm" color="white" fontWeight="bold">
            {course_code}
          </Text>
        </Box>
      </Box>

      <Stack spacing={3} mt={4}>
        <Text fontSize="lg" fontWeight="bold" color={color}>
          {course_code}
        </Text>
        <Text fontSize="xl" fontWeight="semibold" color={color}>
          {course_name}
        </Text>
        <Box maxHeight="60px" overflowY="auto">
          <Text fontSize="sm" color={color}>
            {course_description}
          </Text>
        </Box>
        {role === "teacher" && (
          <Flex mt={4} gap={4}>
            <Button
              colorScheme="teal"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(course_code);
              }}
            >
              Edit
            </Button>
            <Button
              textColor="white"
              bg="red.500"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(course_code);
              }}
            >
              Delete
            </Button>
          </Flex>
        )}
      </Stack>
    </Box>
  );
};

export default Course;
