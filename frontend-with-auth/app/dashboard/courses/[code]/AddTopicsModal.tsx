import { dummyTopics } from "@/app/constants";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Checkbox,
  Box,
  Heading,
  ModalFooter,
  Button,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

interface props {
  isAddTopicModalOpen: boolean;
  onAddTopicModalClose: () => void;
  handleAddTopics: () => void;
  selectedTopics: string[];
  selectedTopicDetails: {
    id: string;
    title: string;
    description: string;
  } | null;
  setSelectedTopics: ([]) => void;
  setSelectedTopicDetails: (
    details: {
      id: string;
      title: string;
      description: string;
      pdfData: string;
    } | null
  ) => void;
}
const AddTopicsModal = ({
  isAddTopicModalOpen,
  onAddTopicModalClose,
  handleAddTopics,
  selectedTopics,
  selectedTopicDetails,
  setSelectedTopics,
  setSelectedTopicDetails,
}: props) => {
  const bg = useColorModeValue("neutral.500", "neutral.50._dark");

  return (
    <Modal
      size="2xl"
      isOpen={isAddTopicModalOpen}
      onClose={onAddTopicModalClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Topics to Add</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Search topics"
            mb={4}
            onChange={(e) => {
              // Add search logic here if needed
              console.log(e);
            }}
          />
          <VStack align="start">
            {dummyTopics.map((topic) => (
              <Checkbox
                key={topic.id}
                isChecked={selectedTopics.includes(topic.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedTopics([...selectedTopics, topic.id]);
                    setSelectedTopicDetails(topic); // Set selected topic details
                  } else {
                    setSelectedTopics(
                      selectedTopics.filter((id) => id !== topic.id)
                    );
                    if (selectedTopicDetails?.id === topic.id) {
                      setSelectedTopicDetails(null); // Reset when unselected
                    }
                  }
                }}
              >
                {topic.title}
              </Checkbox>
            ))}
          </VStack>

          {/* Display selected topic details */}
          {selectedTopicDetails && (
            <Box mt={4} p={4} borderWidth="1px" borderRadius="md" bg={bg}>
              <Heading as="h4" size="sm" mb={2}>
                Selected Topic: {selectedTopicDetails.title}
              </Heading>
              <Text fontSize="sm">{selectedTopicDetails.description}</Text>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={handleAddTopics}>
            Add Selected Topics
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTopicsModal;
