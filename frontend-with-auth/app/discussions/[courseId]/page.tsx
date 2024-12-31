"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  useDisclosure,
  useColorModeValue,
  Text,
  useToast,
} from "@chakra-ui/react";
import Post from "./Post";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import axios from "axios";
import {API_DISCUSSION_BASE_URL} from "@/app/constants";
import {FiPlusCircle} from "react-icons/fi";

interface Props {
  params: { courseId: string };
}

interface Post {
  post_id: number;
  post_title: string;
  post_content: string;
  post_created_by: string;
  post_created_timestamp: string;
  // vote_count: number;
}

interface PostResponse {
  data: {
    status: string;
    message: string;
    data: Post[];
    timestamp: string;
  };
}

const Posts= ({ params: { courseId } }: Props) => {
  if (!courseId) return <div>Loading...</div>;

  const { data: sessionData } = useSession();
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const [newPost, setNewPost] = useState({
    post_title: "",
    post_content: "",
  });

  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  // const [postToVote, setPostToVote] = useState<Post | null>(null);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [postData, setPostData] = useState<Post[] | null>(null);


  const handleClick = (post_id: number) => {
    router.push(`/discussions/${courseId}/${post_id}`);
  };

  const handleEdit = (post: Post) => {
    setPostToEdit(post);
    setNewPost({
      post_title: post.post_title,
      post_content: post.post_content,
    });
    onOpen();
  };

  // const handleVote = (post: Post) => {
  //   setPostToVote(post);
  //   setNewPost({
  //     post_title: post.post_title,
  //     post_content: post.post_content,
  //   });
  //   onOpen();
  // };

  const handleDelete = (post_id: number) => {
    setPostToDelete(post_id);
    onDeleteModalOpen();
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;

    try {
      await axios.delete(`${API_DISCUSSION_BASE_URL}courses/${courseId}/discussions`, {
        params: { post_id: postToDelete },
        headers: {
          Authorization: `Bearer ${sessionData?.idToken}`,
        },
      });
      setPostData(
          (prevData) =>
              prevData?.filter((post) => post.post_id !== postToDelete) ||
              []
      );
      toast({
        title: "Post deleted.",
        description: `Post with ID ${postToDelete} has been deleted.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setPostToDelete(null);
    } catch (error) {
      toast({
        title: "Error deleting post.",
        description: "Failed to delete the post. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      console.error("Failed to delete post:", error);
    }
    onDeleteModalClose();
  };

  const handleAddOrEditPost = async () => {
    if (
        !newPost.post_title ||
        !newPost.post_content
    ) {
      toast({
        title: "Invalid input.",
        description: "Please fill out all fields before submitting.",
        status: "warning",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
      return;
    }

    const payload = {
      post_title: newPost.post_title,
      post_content: newPost.post_content,
    };
    let desc = "";
    try {
      desc = `Post has been updated successfully.`;
      if (postToEdit) {
        await axios.put(`${API_DISCUSSION_BASE_URL}courses/${courseId}/discussions`, payload, {
          params: { post_id: postToEdit.post_id },
          headers: {
            Authorization: `Bearer ${sessionData?.idToken}`,
          },
        });
      } else {
        await axios.post(`${API_DISCUSSION_BASE_URL}courses/${courseId}/discussions`, payload, {
          headers: {
            Authorization: `Bearer ${sessionData?.idToken}`,
          },
        });
      }

      toast({
        title: "Post added.",
        description: desc,
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
      getPosts();

      setNewPost({
        post_title: "",
        post_content: "",
      });
      setPostToEdit(null);
      onClose();
    } catch (error) {
      toast({
        title: `Error ${postToEdit ? "updating" : "adding"} post.`,
        description: `Failed to ${
            postToEdit ? "update" : "add"
        } the post. Please try again.`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      console.error(
          `Failed to ${postToEdit ? "update" : "create"} post:`,
          error
      );
    }
  };

  useEffect(() => {
    if (sessionData)
      // console.log(sessionData.idToken?.split(".")[1])
      getPosts();
  }, [sessionData]);

  const bg = useColorModeValue("neutral.500", "neutral.50._dark");

  async function getPosts() {
    try {
      const response = await axios.get<PostResponse>(
          `${API_DISCUSSION_BASE_URL}courses/${courseId}/discussions`,
          {
            headers: {
              Authorization: `Bearer ${sessionData?.idToken}`,
            },
          }
      );
      setPostData(response?.data?.data as unknown as Post[]);
    } catch (error) {
      console.error(error);
    }
  }

  return (
      <Box p={6} bg={bg}>
        <>
          <Button colorScheme="teal" onClick={onOpen} mb={6}>
            Create New Post
          </Button>
          <Modal
              isOpen={isOpen}
              onClose={() => {
                onClose();
                setPostToEdit(null);
              }}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                {postToEdit ? "Edit Post" : "Create New Post"}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Input
                    placeholder="Post Title"
                    value={newPost.post_title}
                    onChange={(e) =>
                        setNewPost({ ...newPost, post_title: e.target.value })
                    }
                    mb={4}
                />
                <Textarea
                    placeholder="Post Content"
                    value={newPost.post_content}
                    onChange={(e) =>
                        setNewPost({
                          ...newPost,
                          post_content: e.target.value,
                        })
                    }
                />
              </ModalBody>
              <ModalFooter>
                <Button
                    colorScheme="blue"
                    onClick={handleAddOrEditPost}
                    bg="primary.900"
                >
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>

        <Flex flexDirection="column" flexWrap="nowrap" justifyContent="start" gap={8}>
          {postData?.map((post) => (
              <Box key={post.post_id}>
                <Post
                    post_id={post.post_id}
                    post_title={post.post_title}
                    post_content={post.post_content}
                    post_created_by={post.post_created_by}
                    post_created_timestamp={post.post_created_timestamp}
                    // vote_count={post.vote_count}
                    onEdit={() => handleEdit(post)}
                    // onVote={() => handleVote(post)}
                    onDelete={() => handleDelete(post.post_id)}
                    onClick={handleClick}
                />
              </Box>
          ))}
        </Flex>

        <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Delete</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Are you sure you want to delete this post?</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" onClick={confirmDeletePost} mr={3}>
                Delete
              </Button>
              <Button variant="ghost" onClick={onDeleteModalClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
  );

  // return <DiscussionList courseId={courseId as string} />;
};

export default Posts;
