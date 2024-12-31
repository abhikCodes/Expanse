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
import DiscussionCard from "../../components/discussions/DiscussionCard";
import DiscussionActions from "../../components/discussions/DiscussionActions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { API_BASE_URL } from "@/app/constants";
import {headers} from "next/headers";



const DiscussionList: React.FC<{ courseId: string }> = ({ courseId }) => {
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const { data: sessionData } = useSession();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchDiscussions = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8081/course/${courseId}/forum`,
                    {
                        headers: {
                            Authorization: `Bearer ${sessionData?.idToken}`,
                        }
                    }
                );
                setDiscussions(response.data.data);
            } catch (err) {
                setError("Failed to fetch discussions: " + err);
            } finally {
                setLoading(false);
            }
        };

        fetchDiscussions();
    }, [courseId]);

    const handleAddDiscussion = async () => {
        console.log("Add new post");
    };

    if (loading) return <Spinner />;
    if (error) return <Text>{error}</Text>;

    return (
        <Box p={6}>
            <HStack justify="space-between" mb={4}>
                <Text fontSize="2xl">Discussions</Text>
                <Button colorScheme="teal" onClick={handleAddDiscussion}>
                    Add New Discussion
                </Button>
            </HStack>
            <VStack spacing={4} align="stretch">
                {discussions.map((discussion) => (
                    <Box key={discussion.post_id}>
                        <DiscussionCard
                            postId={discussion.post_id}
                            title={discussion.post_title}
                            content={discussion.post_content}
                            author={discussion.post_created_by}
                            createdAt={discussion.post_created_timestamp}
                            voteCount={discussion.vote_count}
                            onClick={() =>
                                router.push(
                                    `/discussions/${courseId}/${discussion.post_id}`
                                )
                            }
                        />
                        <DiscussionActions
                            postId={discussion.post_id}
                            courseId={courseId}
                            onDelete={() => console.log("Delete discussion")}
                            onEdit={() => console.log("Edit discussion")}
                            onVote={(type) => console.log(`Voted: ${type}`)}
                        />
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};

export default DiscussionList;
