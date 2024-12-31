import React from "react";
import { HStack, Button, Text } from "@chakra-ui/react";

interface DiscussionActionsProps {
    postId: number;
    courseId: string;
    onDelete: () => void;
    onEdit: () => void;
    onVote: (type: "upvote" | "downvote") => void;
}

const DiscussionActions: React.FC<DiscussionActionsProps> = ({
                                                                 postId,
                                                                 onDelete,
                                                                 onEdit,
                                                                 onVote,
                                                             }) => {
    return (
        <HStack spacing={2} mt={2}>
            <Button size="sm" colorScheme="green" onClick={() => onVote("upvote")}>
                Upvote
            </Button>
            <Button size="sm" colorScheme="red" onClick={() => onVote("downvote")}>
                Downvote
            </Button>
            <Button size="sm" colorScheme="blue" onClick={onEdit}>
                Edit
            </Button>
            <Button size="sm" colorScheme="red" onClick={onDelete}>
                Delete
            </Button>
        </HStack>
    );
};

export default DiscussionActions;
