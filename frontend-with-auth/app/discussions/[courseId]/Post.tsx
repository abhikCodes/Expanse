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
    post_id: number;
    post_title: string;
    post_content: string;
    // vote_count: number;
    onEdit: (post_id: number) => void;
    // onVote: (post_id: number) => void;
    onDelete: (post_id: number) => void;
    onClick: (post_id: number) => void;
}

const Post = ({
    post_id,
    post_title,
    post_content,
    // vote_count,
    onEdit,
    // onVote,
    onDelete,
    onClick,
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
            // width="300px"
            mb={6}
            p={4}
            onClick={() => onClick(post_id)}
            transition="transform 0.3s, box-shadow 0.3s"
            _hover={{
                transform: "scale(1.05)",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
            }}
        >
            <Stack spacing={3} mt={4}>
                {/*<Text fontSize="lg" fontWeight="bold" color={color}>*/}
                {/*    #{post_id}*/}
                {/*</Text>*/}
                {/*<Text fontSize="md" fontWeight="semibold" color={color}>*/}
                {/*    {vote_count}*/}
                {/*</Text>*/}
                <Text fontSize="xl" fontWeight="semibold" color={color}>
                    {post_title}
                </Text>
                <Box maxHeight="60px" overflowY="auto">
                    <Text fontSize="sm" color={color}>
                        {post_content}
                    </Text>
                </Box>
                {/*<Flex mt={4} gap={4}>*/}
                {/*    <Button*/}
                {/*        colorScheme="teal"*/}
                {/*        size="sm"*/}
                {/*        onClick={(e) => {*/}
                {/*            e.stopPropagation();*/}
                {/*            onVote(post_id);*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        UP*/}
                {/*    </Button>*/}
                {/*    <Button*/}
                {/*        colorScheme="teal"*/}
                {/*        size="sm"*/}
                {/*        onClick={(e) => {*/}
                {/*            e.stopPropagation();*/}
                {/*            onVote(post_id);*/}
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
                            onEdit(post_id);
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
                            onDelete(post_id);
                        }}
                    >
                        Delete
                    </Button>
                </Flex>
            </Stack>
        </Box>
    );
};

export default Post;
