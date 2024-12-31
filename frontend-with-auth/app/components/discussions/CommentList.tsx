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
    Spinner,
    HStack,
    VStack,
} from "@chakra-ui/react";
import CommentCard from "../../components/discussions/CommentCard";
import CommentActions from "../../components/discussions/CommentActions";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { API_BASE_URL } from "@/app/constants";

interface Comment {
    comment_id: number;
    comment_content: string;
    comment_created_by: string;
    vote_count: number;
    comment_created_timestamp: string;
}

const CommentList: React.FC<{ courseId: string; postId: string }> = ({
                                                                         courseId,
                                                                         postId,
                                                                     }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            const response = await axios.get(
                `http://localhost:8000/course/${courseId}/forum/${postId}`
            );
            setComments(response.data.data);
            setLoading(false);
        };

        fetchComments();
    }, [courseId, postId]);

    const handleAddComment = () => {
        console.log("Add new comment");
    };

    return (
        <Box p={6}>
            <HStack justify="space-between" mb={4}>
                <Text fontSize="2xl">Comments</Text>
                <Button colorScheme="teal" onClick={handleAddComment}>
                    Add New Comment
                </Button>
            </HStack>
            {loading ? (
                <Spinner />
            ) : (
                <VStack spacing={4} align="stretch">
                    {comments.map((comment) => (
                        <Box key={comment.comment_id}>
                            <CommentCard {...comment} />
                            <CommentActions
                                onDelete={() => console.log("Delete comment")}
                                onEdit={() => console.log("Edit comment")}
                                onVote={(type) => console.log(`Voted: ${type}`)}
                            />
                        </Box>
                    ))}
                </VStack>
            )}
        </Box>
    );
};

export default CommentList;
