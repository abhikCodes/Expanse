"use client";
import {
    Box,
    Text,
    Stack,
    Button,
    Flex,
    useColorModeValue,
} from "@chakra-ui/react";

interface Props {
    comment_id: number;
    reply_to: string;
    comment_content: string;
    // vote_count: number;
    onEdit: (comment_id: number) => void;
    // onVote: (comment_id: number) => void;
    onDelete: (comment_id: number) => void;
}

const Comment = ({
  comment_id,
  reply_to,
  comment_content,
  // vote_count,
  onEdit,
  // onVote,
  onDelete,
}: Props) => {
    const bg = useColorModeValue("neutral.500", "primary.900");
    const color = useColorModeValue("primary.900", "neutral.50");

    return (
        <Box
            flexDirection="column"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg={bg}
            color={color}
            shadow="lg"
            width="300px"
            mb={6}
            p={4}
            transition="transform 0.3s, box-shadow 0.3s"
            _hover={{
                transform: "scale(1.05)",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
            }}
        >
            <Stack spacing={3} mt={4}>
                {/*<Text fontSize="lg" fontWeight="bold" color={color}>*/}
                {/*    #{comment_id}*/}
                {/*</Text>*/}
                {/*<Text fontSize="md" fontWeight="semibold" color={color}>*/}
                {/*    {vote_count}*/}
                {/*</Text>*/}
                <Text fontSize="xl" fontWeight="semibold" color={color}>
                    {reply_to}
                </Text>
                <Box maxHeight="60px" overflowY="auto">
                    <Text fontSize="sm" color={color}>
                        {comment_content}
                    </Text>
                </Box>
                {/*<Flex mt={4} gap={4}>*/}
                {/*    <Button*/}
                {/*        colorScheme="teal"*/}
                {/*        size="sm"*/}
                {/*        onClick={(e) => {*/}
                {/*            e.stopPropagation();*/}
                {/*            onVote(comment_id);*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        UP*/}
                {/*    </Button>*/}
                {/*    <Button*/}
                {/*        colorScheme="teal"*/}
                {/*        size="sm"*/}
                {/*        onClick={(e) => {*/}
                {/*            e.stopPropagation();*/}
                {/*            onVote(comment_id);*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        DOWN*/}
                {/*    </Button>*/}
                {/*</Flex>*/}
                <Flex mt={4} gap={4}>
                    <Button
                        colorScheme="teal"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(comment_id);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        textColor="white"
                        bg="red.500"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(comment_id);
                        }}
                    >
                        Delete
                    </Button>
                </Flex>
            </Stack>
        </Box>
    );
};

export default Comment;
