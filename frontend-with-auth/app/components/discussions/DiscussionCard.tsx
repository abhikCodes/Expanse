import React from "react";
import { Box, Heading, Text, VStack, HStack, Button } from "@chakra-ui/react";

interface DiscussionCardProps {
    postId: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    onClick: () => void;
}

const DiscussionCard: React.FC<DiscussionCardProps> = ({
                                                           postId,
                                                           title,
                                                           content,
                                                           author,
                                                           createdAt,
                                                           onClick,
                                                       }) => {
    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            shadow="md"
            onClick={onClick}
            cursor="pointer"
        >
            <Heading size="md">{title}</Heading>
            <Text mt={2}>{content}</Text>
            <HStack justify="space-between" mt={4}>
                <Text fontSize="sm">By: {author}</Text>
                <Text fontSize="sm">{new Date(createdAt).toLocaleDateString()}</Text>
            </HStack>
        </Box>
    );
};

export default DiscussionCard;
