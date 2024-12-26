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

interface Post {
  post_title: string;
  post_content: string;
  course_id: string;
  post_created_by: number;
  post_updated_by: number;
  post_id: number;
  vote_count: number;
  post_created_timestamp: string;
  post_updated_timestamp: string;
}

interface PostsListProps {
  courseId: string;
}

const DiscussionList: React.FC<PostsListProps> = ({ courseId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const bgColor = useColorModeValue("neutral.50", "neutral._dark.50");
  const textColor = useColorModeValue("neutral.900", "neutral._dark.900");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
            `http://localhost:8000/course/${courseId}/discussions/`
        );
        setPosts(response.data.data);
      } catch (err) {
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
        <Heading as="h1" mb={6}>
          Forum Discussions
        </Heading>
        <VStack spacing={4} align="stretch">
          {posts.map((post) => (
              <Box
                  key={post.post_id}
                  p={4}
                  shadow="md"
                  borderWidth="1px"
                  rounded="md"
              >
                <Heading fontSize="xl">{post.post_title}</Heading>
                <Text mt={2}>{post.post_content}</Text>
                <Text mt={4} fontSize="sm" color="neutral.600">
                  Created by User {post.post_created_by} on{" "}
                  {new Date(post.post_created_timestamp).toLocaleDateString()}
                </Text>
                <Text mt={1} fontSize="sm" color="neutral.600">
                  Votes: {post.vote_count}
                </Text>
              </Box>
          ))}
        </VStack>
      </Box>
  );
};

export default DiscussionList;
