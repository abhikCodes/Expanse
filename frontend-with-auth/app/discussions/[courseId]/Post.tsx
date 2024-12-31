"use client";
import {
  Box,
  Text,
  Flex,
  Avatar,
  Button,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";

interface Props {
  post_id: number;
  post_title: string;
  post_content: string;
  current_user: string;
  post_created_timestamp: string;
  post_created_by: string;
  onEdit: (post_id: number) => void;
  onDelete: (post_id: number) => void;
  onClick: (post_id: number) => void;
}

const Post = ({
  post_id,
  post_title,
  post_content,
  post_created_timestamp,
  post_created_by,
  current_user,
  onEdit,
  onDelete,
  onClick,
}: Props) => {
  // Define theme-based colors
  const bg = useColorModeValue("neutral.50", "neutral._dark.50");
  const hoverBg = useColorModeValue("neutral.300", "neutral._dark.900");
  const subTextColor = useColorModeValue("teal.900", "white");
  const borderColor = useColorModeValue("neutral.600", "neutral._dark.600");
  const timestampColor = useColorModeValue("neutral.600", "neutral._dark.600");

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      p={4}
      mb={6}
      shadow="md"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "xl",
        bg: hoverBg,
      }}
      transition="all 0.2s"
      onClick={() => onClick(post_id)}
      cursor="pointer"
    >
      {/* Header: Title and Action Menu */}
      <Flex justify="space-between" align="center">
        <Flex align="center" gap={3}>
          <Avatar name={post_title} size="sm" bg="primary.500" />
          <Box>
            <Text
              fontSize="lg"
              fontWeight="bold"
              color={subTextColor}
              noOfLines={1}
            >
              {post_title}
            </Text>
          </Box>
        </Flex>
        <Text fontSize="xs" color={timestampColor}>
          Created At:{" "}
          {new Date(post_created_timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
      </Flex>

      {/* Content Section */}
      <Box mt={4}>
        <Text fontSize="sm" color={subTextColor} noOfLines={3}>
          {post_content}
        </Text>
      </Box>

      {/* Footer: Actions and Metadata */}
      <Flex justify="space-between" align="center" mt={4}>
        <Badge colorScheme="teal" fontSize="0.8em">
          Post #{post_id}
        </Badge>
        {post_created_by === current_user && (
          <Flex gap={2}>
            <Button
              aria-label="Edit Post"
              size="sm"
              colorScheme="teal"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(post_id);
              }}
            >
              Edit
            </Button>
            <Button
              aria-label="Delete Post"
              size="sm"
              colorScheme="red"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(post_id);
              }}
            >
              Delete
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default Post;
