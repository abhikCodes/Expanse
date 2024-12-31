import React from "react";
import { Box, Text, VStack, HStack } from "@chakra-ui/react";

interface CommentCardProps {
    content: string;
    author: string;
    votes: number;
    createdAt: string;
}

const CommentCard: React.FC<CommentCardProps> = ({
                                                     content,
                                                     author,
                                                     votes,
                                                     createdAt,
                                                 }) => {
    return (
        <Box borderWidth="1px" borderRadius="lg" p={4} shadow="md">
            <Text>{content}</Text>
            <HStack justify="space-between" mt={4}>
                <Text fontSize="sm">By: {author}</Text>
                <Text fontSize="sm">{new Date(createdAt).toLocaleDateString()}</Text>
                <Text fontSize="sm">Votes: {votes}</Text>
            </HStack>
        </Box>
    );
};

export default CommentCard;
