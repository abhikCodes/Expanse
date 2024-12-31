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
}

const Post = ({
                  post_id,
                  post_title,
                  post_content,
                  // vote_count,
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
        >
            <Stack spacing={3} mt={4}>
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
            </Stack>
        </Box>
    );
};

export default Post;
