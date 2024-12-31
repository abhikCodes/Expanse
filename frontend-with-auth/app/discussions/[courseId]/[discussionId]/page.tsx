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
  useToast, position,
} from "@chakra-ui/react";
import Comment from "./Comment";
import Post from "./Post";
// import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import axios from "axios";
import {API_DISCUSSION_BASE_URL} from "@/app/constants";
import {FiPlusCircle} from "react-icons/fi";

interface Props {
  params: {
    courseId: string,
    discussionId: string
  };
}

interface Comment {
  comment_id: number;
  reply_to: string;
  comment_content: string;
  comment_created_by: string;
  comment_created_timestamp: string;
  // vote_count: number;
}

interface Post {
  post_id: number;
  post_title: string;
  post_content: string;
  post_created_by: string;
  post_created_timestamp: string;
  // vote_count: number;
}

interface CommentResponse {
  data: {
    status: string;
    message: string;
    data: Comment[];
    timestamp: string;
  };
}

const Comments= ({ params: { courseId, discussionId } }: Props) => {
  if (!courseId || !discussionId) return <div>Loading...</div>;

  const { data: sessionData } = useSession();
  // const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const [newComment, setNewComment] = useState({
    reply_to: "",
    comment_content: "",
  });

  const [commentToEdit, setCommentToEdit] = useState<Comment | null>(null);
  // const [commentToVote, setCommentToVote] = useState<Comment | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [commentData, setCommentData] = useState<Comment[] | null>(null);
  const [postData, setPostData] = useState<Post[] | null>(null);


  // const handleClick = (comment_id: number) => {
  //   router.push(`/discussions/${courseId}/${discussionId}`);
  // };

  const handleEdit = (comment: Comment) => {
    setCommentToEdit(comment);
    setNewComment({
      reply_to: comment.reply_to,
      comment_content: comment.comment_content,
    });
    onOpen();
  };

  // const handleVote = (comment: Comment) => {
  //   setCommentToVote(comment);
  //   setNewComment({
  //     reply_to: comment.reply_to,
  //     comment_content: comment.comment_content,
  //   });
  //   onOpen();
  // };

  const handleDelete = (comment_id: number) => {
    setCommentToDelete(comment_id);
    onDeleteModalOpen();
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      await axios.delete(`${API_DISCUSSION_BASE_URL}courses/${courseId}/discussions/${discussionId}`, {
        params: { comment_id: commentToDelete },
        headers: {
          Authorization: `Bearer ${sessionData?.idToken}`,
        },
      });
      setCommentData(
          (prevData) =>
              prevData?.filter((comment) => comment.comment_id !== commentToDelete) ||
              []
      );
      toast({
        title: "Comment deleted.",
        description: `Comment with ID ${commentToDelete} has been deleted.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setCommentToDelete(null);
    } catch (error) {
      toast({
        title: "Error deleting comment.",
        description: "Failed to delete the comment. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      console.error("Failed to delete comment:", error);
    }
    onDeleteModalClose();
  };

  const handleAddOrEditComment = async () => {
    if (
        !newComment.reply_to ||
        !newComment.comment_content
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
      reply_to: newComment.reply_to,
      comment_content: newComment.comment_content,
    };
    let desc = "";
    try {
      desc = `Comment has been updated successfully.`;
      if (commentToEdit) {
        await axios.put(`${API_DISCUSSION_BASE_URL}courses/${courseId}/discussions/${discussionId}`, payload, {
          params: { comment_id: commentToEdit.comment_id },
          headers: {
            Authorization: `Bearer ${sessionData?.idToken}`,
          },
        });
      } else {
        await axios.post(`${API_DISCUSSION_BASE_URL}courses/${courseId}/discussions/${discussionId}`, payload, {
          headers: {
            Authorization: `Bearer ${sessionData?.idToken}`,
          },
        });
      }

      toast({
        title: "Comment added.",
        description: desc,
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
      getComments();

      setNewComment({
        reply_to: "",
        comment_content: "",
      });
      setCommentToEdit(null);
      onClose();
    } catch (error) {
      toast({
        title: `Error ${commentToEdit ? "updating" : "adding"} comment.`,
        description: `Failed to ${
            commentToEdit ? "update" : "add"
        } the comment. Please try again.`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      console.error(
          `Failed to ${commentToEdit ? "update" : "create"} comment:`,
          error
      );
    }
  };

  useEffect(() => {
    if (sessionData)
      // console.log(sessionData.idToken?.split(".")[1])
      getComments();
  }, [sessionData]);

  const bg = useColorModeValue("neutral.500", "neutral.50._dark");

  async function getComments() {
    try {
      const response = await axios.get<CommentResponse>(
          `${API_DISCUSSION_BASE_URL}courses/${courseId}/discussions/${discussionId}`,
          {
            headers: {
              Authorization: `Bearer ${sessionData?.idToken}`,
            },
          }
      );
      setCommentData(response?.data?.data?.CommentData as unknown as Comment[]);
      setPostData(response?.data?.data?.PostData as unknown as Post[]);
      // console.log({postData?.map((post) => {JSON.stringify(post)})
    } catch (error) {
      console.error(error);
    }
  }

  return (
      <Box p={6} bg={bg}>
        <>
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
                  />
                </Box>
            ))}
          </Flex>
          <Button colorScheme="teal" onClick={onOpen} mb={6}>
            Reply to Post
          </Button>
          <Modal
              isOpen={isOpen}
              onClose={() => {
                onClose();
                setCommentToEdit(null);
              }}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                {commentToEdit ? "Edit Comment" : "Create New Comment"}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Textarea
                    placeholder="Reply To"
                    value={newComment.reply_to}
                    onChange={(e) =>
                        setNewComment({ ...newComment, reply_to: e.target.value })
                    }
                    mb={4}
                />
                <Textarea
                    placeholder="Comment Content"
                    value={newComment.comment_content}
                    onChange={(e) =>
                        setNewComment({
                          ...newComment,
                          comment_content: e.target.value,
                        })
                    }
                />
              </ModalBody>
              <ModalFooter>
                <Button
                    colorScheme="blue"
                    onClick={handleAddOrEditComment}
                    bg="primary.900"
                >
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>

        <Flex flexDirection="column" flexWrap="nowrap" justifyContent="start" gap={8}>
          {commentData?.map((comment) => (
              <Box key={comment.comment_id}>
                <Comment
                    comment_id={comment.comment_id}
                    reply_to={comment.reply_to}
                    comment_content={comment.comment_content}
                    comment_created_by={comment.comment_created_by}
                    comment_created_timestamp={comment.comment_created_timestamp}
                    // vote_count={comment.vote_count}
                    onEdit={() => handleEdit(comment)}
                    // onVote={() => handleVote(comment)}
                    onDelete={() => handleDelete(comment.comment_id)}
                    // onClick={handleClick}
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
              <Text>Are you sure you want to delete this comment?</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" onClick={confirmDeleteComment} mr={3}>
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

  // return <CommentList courseId={courseId as string} />;
};

export default Comments;
