"use client";
import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  useColorMode,
  Spinner,
  VStack,
  Checkbox,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { Document, Page, pdfjs } from "react-pdf";
import { courseDetails as initialCourseDetails } from "@/app/constants";
import { dummyTopics } from "@/app/constants";

// Worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Props {
  params: { code: string };
}

const CourseDetails = ({ params: { code } }: Props) => {
  const { data: session } = useSession();
  const role = session?.user?.role || "student";

  const [courseDetails, setCourseDetails] = useState(initialCourseDetails);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedTopicDetails, setSelectedTopicDetails] = useState<{
    id: string;
    title: string;
    description: string;
    pdfData: string;
  } | null>(null);
  const bg = useColorModeValue("neutral.500", "neutral.50._dark");

  const [newCourseTitle, setNewCourseTitle] = useState(
    courseDetails.course_name
  );
  const [newCourseDescription, setNewCourseDescription] = useState(
    courseDetails.course_description
  );

  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  const {
    isOpen: isAddTopicModalOpen,
    onOpen: onAddTopicModalOpen,
    onClose: onAddTopicModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const {
    isOpen: isEditCourseModalOpen,
    onOpen: onEditCourseModalOpen,
    onClose: onEditCourseModalClose,
  } = useDisclosure();

  const [topicToDelete, setTopicToDelete] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoadingError(false);
  };

  const handleAddTopics = () => {
    const topicsToAdd = dummyTopics.filter((topic) =>
      selectedTopics.includes(topic.id)
    );
    const updatedTopics = [...courseDetails.topics, ...topicsToAdd];
    setCourseDetails({ ...courseDetails, topics: updatedTopics });
    setSelectedTopics([]);
    setSelectedTopicDetails(null); // Reset selected topic details
    onAddTopicModalClose();
  };

  const confirmDeleteTopic = () => {
    if (topicToDelete) {
      const filteredTopics = courseDetails.topics.filter(
        (topic) => topic.id !== topicToDelete
      );
      setCourseDetails({ ...courseDetails, topics: filteredTopics });
      setTopicToDelete(null);
    }
    onDeleteModalClose();
  };

  const handleEditCourse = () => {
    setCourseDetails({
      ...courseDetails,
      course_name: newCourseTitle,
      course_description: newCourseDescription,
    });
    onEditCourseModalClose();
  };

  return (
    <Box maxW="1200px" mx="auto" py={8} px={4}>
      {/* Course Header */}
      <Box mb={8} textAlign="center">
        <Heading
          as="h1"
          size="xl"
          color={isDarkMode ? "neutral.900" : "primary.900"}
        >
          {courseDetails.course_name + " - " + code}
        </Heading>
        <Text
          fontSize="lg"
          mt={4}
          color={isDarkMode ? "neutral.700" : "neutral.700"}
        >
          {courseDetails.course_description}
        </Text>
        {role === "teacher" && (
          <Button colorScheme="teal" mt={4} onClick={onEditCourseModalOpen}>
            Edit Course
          </Button>
        )}
      </Box>

      {/* Topics Section */}
      <Flex gap={8} flexDirection={{ base: "column", md: "row" }}>
        <Box flex="1">
          <Heading
            as="h2"
            size="md"
            mb={4}
            color={isDarkMode ? "neutral.900" : "primary.900"}
          >
            Topics Covered
          </Heading>
          <Accordion allowMultiple>
            {courseDetails.topics.map((topic) => (
              <AccordionItem key={topic.id}>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    {topic.title}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Text mb={4}>{topic.description}</Text>
                  <Flex justify="space-between">
                    {topic.pdfData && (
                      <Button
                        color={isDarkMode ? "neutral.900" : "primary.900"}
                        onClick={() => {
                          setSelectedPdf(topic.pdfData);
                          setLoadingError(false);
                        }}
                        mb={4}
                      >
                        View PDF
                      </Button>
                    )}
                    {role === "teacher" && (
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => {
                          setTopicToDelete(topic.id);
                          onDeleteModalOpen();
                        }}
                      >
                        Delete Topic
                      </Button>
                    )}
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
          {role === "teacher" && (
            <Button colorScheme="teal" mt={4} onClick={onAddTopicModalOpen}>
              Add New Topic
            </Button>
          )}
        </Box>

        {selectedPdf && (
          <Box
            flex="1"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            p={4}
            maxHeight="500px"
          >
            <Heading
              as="h3"
              size="sm"
              mb={4}
              color={isDarkMode ? "neutral.900" : "primary.900"}
            >
              PDF Viewer
            </Heading>
            <Document
              file={`/pdfs/${selectedPdf}`}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={() => setLoadingError(true)}
              loading={<Spinner />}
            >
              {loadingError ? (
                <Text color="red.500" fontSize="md">
                  Unable to load PDF.
                </Text>
              ) : (
                Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={400}
                  />
                ))
              )}
            </Document>
          </Box>
        )}
      </Flex>

      {/* Add Topics Modal */}
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
            <Button variant="ghost" onClick={onAddTopicModalClose} ml={2}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Course Modal */}
      <Modal isOpen={isEditCourseModalOpen} onClose={onEditCourseModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Course</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={newCourseTitle}
              onChange={(e) => setNewCourseTitle(e.target.value)}
              placeholder="Course Title"
              mb={4}
            />
            <Input
              value={newCourseDescription}
              onChange={(e) => setNewCourseDescription(e.target.value)}
              placeholder="Course Description"
              mb={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleEditCourse}>
              Save Changes
            </Button>
            <Button variant="ghost" onClick={onEditCourseModalClose} ml={2}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this topic?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={confirmDeleteTopic} mr={3}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onDeleteModalClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CourseDetails;
