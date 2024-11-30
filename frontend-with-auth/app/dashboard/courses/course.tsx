"use client";
import {
  Box,
  Text,
  Image,
  Stack,
  Button,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";

interface Props {
  course_code: string;
  course_name: string;
  course_description: string;
  role: string;
  onEdit: (course_code: string) => void;
  onDelete: (course_code: string) => void;
  onClick: (course_code: string) => void;
}

const Course = ({
  course_code,
  course_name,
  course_description,
  role,
  onEdit,
  onDelete,
  onClick,
}: Props) => {
  const bg = useColorModeValue("neutral.900", "primary.900");
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
      onClick={() => onClick(course_code)}
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
        <Text fontSize="lg" fontWeight="bold" color={color}>
          {course_code}
        </Text>
        <Text fontSize="xl" fontWeight="semibold" color={color}>
          {course_name}
        </Text>
        <Text fontSize="sm" color={color}>
          {course_description}
        </Text>
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
