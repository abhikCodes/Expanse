"use client";

import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Text,
  Flex,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FiCornerDownRight } from "react-icons/fi";

interface Props {
  comment_id: number;
  reply_to: string;
  comment_content: string;
  comment_created_by: string;
  comment_created_timestamp: string;
  current_user: string;
  onEdit: () => void;
  onDelete: () => void;
}

interface User {
  name: string;
}

const Comment = ({
  comment_id,
  reply_to,
  comment_content,
  comment_created_by,
  comment_created_timestamp,
  current_user,
  onEdit,
  onDelete,
}: Props) => {
  const bg = useColorModeValue("white", "gray.700");
  const border = useColorModeValue("gray.200", "gray.600");
  const [user, setUser] = useState<User>();

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    try {
      const response = await axios.get<User>(
        `/api/users/${comment_created_by}`
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  if (!user) return <>Loading...</>;
  return (
    <Box
      bg={bg}
      borderWidth="1px"
      borderRadius="md"
      borderColor={border}
      p={4}
      boxShadow="sm"
      _hover={{ boxShadow: "lg" }}
      transition="0.2s"
      mb={4}
    >
      <Flex alignItems="center" justifyContent="space-between">
        {/* Icon and Comment Content */}
        <Flex alignItems="center" gap={4}>
          <FiCornerDownRight size={20} />
          <Text>{comment_content}</Text>

          <Text fontSize="sm" color="gray.500">
            - {comment_created_by === current_user ? "You" : user?.name} (
            {new Date(comment_created_timestamp).toLocaleString()})
          </Text>
        </Flex>

        {/* Edit and Delete Buttons */}
        {comment_created_by === current_user && (
          <Flex gap={2}>
            <IconButton
              aria-label="Edit comment"
              bgColor="teal"
              icon={<EditIcon />}
              size="xs"
              colorScheme="blue"
              onClick={onEdit}
            />
            <IconButton
              aria-label="Delete comment"
              icon={<DeleteIcon />}
              size="xs"
              colorScheme="red"
              onClick={onDelete}
            />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default Comment;
