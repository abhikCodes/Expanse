"use client";

import {
  Box,
  Text,
  Flex,
  Avatar,
  Badge,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";

interface Props {
  post_id: number;
  post_title: string;
  post_content: string;
  post_updated_timestamp: string;
  post_created_by: string;
  current_user: string;
}

interface User {
  name: string;
}

const Post = ({
  post_id,
  post_title,
  post_content,
  post_updated_timestamp,
  post_created_by,
  current_user,
}: Props) => {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const titleColor = useColorModeValue("gray.900", "white");
  const contentColor = useColorModeValue("gray.700", "gray.300");
  const badgeColor = useColorModeValue("blue.500", "blue.300");
  const timestampColor = useColorModeValue("gray.500", "gray.400");
  const [user, setUser] = useState<User>();

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    try {
      const response = await axios.get<User>(`/api/users/${post_created_by}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  if (!user) return <>Loading...</>;
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bg}
      borderColor={borderColor}
      shadow="md"
      p={6}
      mb={6}
      _hover={{ shadow: "lg", transform: "scale(1.02)" }}
      transition="all 0.2s ease-in-out"
    >
      {/* Header Section */}
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Flex alignItems="center" gap={3}>
          <Avatar
            name={post_created_by}
            size="sm"
            bg={badgeColor}
            color="white"
          />
          <Text fontSize="sm" fontWeight="medium" color={timestampColor}>
            Posted by{" "}
            <Text as="span" fontWeight="bold">
              {post_created_by === current_user ? "You" : user.name}
            </Text>
          </Text>
        </Flex>
        <Badge
          colorScheme="teal"
          variant="subtle"
          fontSize="0.8em"
          px={2}
          py={1}
        >
          #{post_id}
        </Badge>
      </Flex>

      {/* Title Section */}
      <Text
        fontSize="xl"
        fontWeight="bold"
        color={titleColor}
        mb={3}
        isTruncated
      >
        {post_title}
      </Text>

      {/* Content Section */}
      <Text
        fontSize="md"
        color={contentColor}
        mb={4}
        noOfLines={[3, 5, 7]}
        overflow="hidden"
      >
        {post_content}
      </Text>

      {/* Footer Section */}
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" gap={2}>
          <Icon as={FiClock} boxSize={4} color={timestampColor} />
          <Text fontSize="sm" color={timestampColor}>
            {new Date(post_updated_timestamp).toLocaleString()}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Post;
