import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  // Checkbox,
  Button,
  useToast,
  VStack,
  Box,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useSession } from "next-auth/react";
import { API_BASE_URL } from "@/app/constants";

interface CreateTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onTopicCreated: () => void;
}

const CreateTopicModal: React.FC<CreateTopicModalProps> = ({
  isOpen,
  onClose,
  courseId,
  onTopicCreated,
}) => {
  const [newTopic, setNewTopic] = useState({
    topic_name: "",
    topic_description: "",
    topic_is_released: true,
    files: [] as File[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { data: sessionData } = useSession();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTopic((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) =>
      ["application/pdf", "video/mp4"].includes(file.type)
    );
    const invalidFiles = files.filter(
      (file) => !["application/pdf", "video/mp4"].includes(file.type)
    );

    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid File Type",
        description: "Only PDF and video files (MP4) are allowed.",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    }

    setNewTopic((prev) => ({
      ...prev,
      files: [...prev.files, ...validFiles],
    }));
  };

  const handleRemoveFile = (index: number) => {
    setNewTopic((prev) => {
      const updatedFiles = [...prev.files];
      updatedFiles.splice(index, 1);
      return { ...prev, files: updatedFiles };
    });
  };

  // const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setNewTopic((prev) => ({ ...prev, topic_is_released: e.target.checked }));
  // };

  const handleSubmit = async () => {
    if (
      !newTopic.topic_name ||
      !newTopic.topic_description ||
      newTopic.files.length === 0
    ) {
      toast({
        title: "Validation Error",
        description:
          "Please fill all required fields and upload at least one valid file.",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("topic_name", newTopic.topic_name);
    formData.append("topic_description", newTopic.topic_description);
    formData.append("course_id", courseId);
    formData.append("topic_is_released", String(newTopic.topic_is_released));
    newTopic.files.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post(API_BASE_URL + "topics", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${sessionData?.idToken}`,
        },
      });

      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Topic created successfully!",
          status: "success",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        setNewTopic({
          topic_name: "",
          topic_description: "",
          topic_is_released: false,
          files: [],
        });
        onClose();
        onTopicCreated();
      }
    } catch (error) {
      console.error("Error creating topic:", error);
      toast({
        title: "Error",
        description: "Failed to create topic.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent borderRadius="xl" p={6} bg="white">
        <ModalHeader fontSize="xl" fontWeight="bold" color="teal.500">
          Create a New Topic
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Topic Name</FormLabel>
              <Input
                name="topic_name"
                value={newTopic.topic_name}
                onChange={handleInputChange}
                placeholder="Enter topic name"
                borderColor="gray.300"
                _hover={{ borderColor: "teal.400" }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Topic Description</FormLabel>
              <Textarea
                name="topic_description"
                value={newTopic.topic_description}
                onChange={handleInputChange}
                placeholder="Enter topic description"
                borderColor="gray.300"
                _hover={{ borderColor: "teal.400" }}
              />
            </FormControl>

            {/* <FormControl>
              <Checkbox
                isChecked={newTopic.topic_is_released}
                onChange={handleCheckboxChange}
                colorScheme="teal"
              >
                Release Topic
              </Checkbox>
            </FormControl> */}

            <FormControl isRequired>
              <FormLabel>Upload Files</FormLabel>
              <Box position="relative">
                <Input
                  type="file"
                  accept=".pdf,video/mp4"
                  multiple
                  onChange={handleFileChange}
                  display="none"
                  id="file-upload"
                />
                <Button
                  as="label"
                  htmlFor="file-upload"
                  colorScheme="teal"
                  variant="solid"
                  width="full"
                  textAlign="center"
                  borderRadius="md"
                  _hover={{ bg: "teal.600" }}
                  _active={{ bg: "teal.700" }}
                >
                  {newTopic.files.length > 0
                    ? `${newTopic.files.length} File(s) Selected`
                    : "Choose Files"}
                </Button>
                {newTopic.files.length > 0 && (
                  <Box mt={2}>
                    {newTopic.files.map((file, index) => (
                      <Box
                        key={index}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                        p={2}
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                      >
                        <Text fontSize="sm" color="gray.600">
                          {file.name}
                        </Text>
                        <IconButton
                          size="sm"
                          icon={<CloseIcon />}
                          onClick={() => handleRemoveFile(index)}
                          aria-label="Remove file"
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={onClose} colorScheme="gray">
            Cancel
          </Button>
          <Button
            colorScheme="teal"
            ml={3}
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Create Topic
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateTopicModal;
