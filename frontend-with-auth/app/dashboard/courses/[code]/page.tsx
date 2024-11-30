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
  Input,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useColorMode,
  Spinner,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { Document, Page, pdfjs } from "react-pdf";
import { courseDetails as initialCourseDetails } from "@/app/constants";

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

  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const [isEditing, setIsEditing] = useState(false);
  const [updatedCourseDetails, setUpdatedCourseDetails] = useState({
    course_name: courseDetails.course_name,
    course_description: courseDetails.course_description,
  });

  const [newTopic, setNewTopic] = useState({
    title: "",
    description: "",
    pdfData: "",
  });

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoadingError(false);
  };

  const [topicToDelete, setTopicToDelete] = useState<string | null>(null);

  const handleAddTopic = () => {
    const newTopics = [
      ...courseDetails.topics,
      {
        id: `${Date.now()}`,
        ...newTopic,
      },
    ];
    setCourseDetails({ ...courseDetails, topics: newTopics });
    setNewTopic({ title: "", description: "", pdfData: "" });
    onModalClose();
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

  const handleSaveCourseDetails = () => {
    setCourseDetails({
      ...courseDetails,
      course_name: updatedCourseDetails.course_name,
      course_description: updatedCourseDetails.course_description,
    });
    setIsEditing(false);
  };

  return (
    <Box maxW="1200px" mx="auto" py={8} px={4}>
      {/* Course Header */}
      <Box mb={8} textAlign="center">
        {isEditing ? (
          <>
            <Input
              value={updatedCourseDetails.course_name}
              onChange={(e) =>
                setUpdatedCourseDetails({
                  ...updatedCourseDetails,
                  course_name: e.target.value,
                })
              }
              fontSize="2xl"
              fontWeight="bold"
              mb={4}
              textAlign="center"
            />
            <Textarea
              value={updatedCourseDetails.course_description}
              onChange={(e) =>
                setUpdatedCourseDetails({
                  ...updatedCourseDetails,
                  course_description: e.target.value,
                })
              }
              fontSize="md"
              mb={4}
              textAlign="center"
            />
            <Flex justifyContent="center" gap={4}>
              <Button colorScheme="teal" onClick={handleSaveCourseDetails}>
                Save Changes
              </Button>
              <Button colorScheme="red" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </Flex>
          </>
        ) : (
          <>
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
              <Button
                colorScheme="teal"
                mt={4}
                onClick={() => setIsEditing(true)}
              >
                Edit Course Details
              </Button>
            )}
          </>
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
            <Button colorScheme="teal" mt={4} onClick={onModalOpen}>
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

      {/* Add New Topic Modal */}
      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Topic</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Topic Title"
              value={newTopic.title}
              onChange={(e) =>
                setNewTopic({ ...newTopic, title: e.target.value })
              }
              mb={4}
            />
            <Textarea
              placeholder="Topic Description"
              value={newTopic.description}
              onChange={(e) =>
                setNewTopic({ ...newTopic, description: e.target.value })
              }
              mb={4}
            />
            <Input
              placeholder="PDF File Name (optional)"
              value={newTopic.pdfData}
              onChange={(e) =>
                setNewTopic({ ...newTopic, pdfData: e.target.value })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddTopic}>
              Add Topic
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
