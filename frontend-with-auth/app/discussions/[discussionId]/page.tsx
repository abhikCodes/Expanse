"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";

interface Comment {
  comment_content: string;
  comment_created_by: number;
  comment_updated_by: number;
  comment_id: number;
  vote_count: number;
  comment_created_timestamp: string;
  comment_updated_timestamp: string;
}

interface CommentsListProps {
  courseId: string;
  postId: string;
}

const CommentsList: React.FC<CommentsListProps> = ({ courseId, postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const bgColor = useColorModeValue("neutral.50", "neutral._dark.50");
  const textColor = useColorModeValue("neutral.900", "neutral._dark.900");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
            `http://localhost:8000/course/${courseId}/discussions/${postId}`
        );
        setComments(response.data.data);
      } catch (err) {
        setError("Failed to fetch comments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [courseId, postId]);

  if (loading) {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bg={bgColor}
        >
          <Spinner size="xl" />
        </Box>
    );
  }

  if (error) {
    return (
        <Box textAlign="center" mt={10} bg={bgColor} color={textColor}>
          <Text fontSize="lg">{error}</Text>
        </Box>
    );
  }

  return (
      <Box bg={bgColor} color={textColor} p={6}>
        <Heading as="h2" mb={6}>
          Comments
        </Heading>
        <VStack spacing={4} align="stretch">
          {comments.map((comment) => (
              <Box
                  key={comment.comment_id}
                  p={4}
                  shadow="md"
                  borderWidth="1px"
                  rounded="md"
              >
                <Text fontSize="md">{comment.comment_content}</Text>
                <Text mt={4} fontSize="sm" color="neutral.600">
                  Created by User {comment.comment_created_by} on{" "}
                  {new Date(comment.comment_created_timestamp).toLocaleDateString()}
                </Text>
                <Text mt={1} fontSize="sm" color="neutral.600">
                  Votes: {comment.vote_count}
                </Text>
              </Box>
          ))}
        </VStack>
      </Box>
  );
};

export default CommentsList;
