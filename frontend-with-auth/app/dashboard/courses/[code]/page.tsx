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
  useDisclosure,
  useColorMode,
  Spinner,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { Document, Page, pdfjs } from "react-pdf";
import { courseDetails as initialCourseDetails } from "@/app/constants";
import { dummyTopics } from "@/app/constants";
import QuizNavigation from "./QuizNavigation";
import DiscussionNavigation from "./DiscussionNavigation";
import EditCourseModal from "./EditCourseModal";
import DeleteTopicConfirmationModal from "./DeleteTopicConfirmationModal";
import AddTopicsModal from "./AddTopicsModal";

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
    <Box mx="auto" py={8} px={4}>
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

      <Grid templateColumns="repeat(12, 1fr)" gap={8}>
        {/* Topics Section */}
        <GridItem colSpan={{ base: 8, md: 9 }}>
          <Box
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="lg"
            p={6}
            bg={isDarkMode ? "gray.800" : "white"}
          >
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
                              // size="md"
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
                  <Button
                    colorScheme="teal"
                    mt={4}
                    onClick={onAddTopicModalOpen}
                  >
                    Add New Topic
                  </Button>
                )}
              </Box>
            </Flex>
          </Box>
          {/* PDF Viewer */}
          {selectedPdf && (
            <Box
              flex="1"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              p={4}
              maxHeight="500px"
              mt={8}
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
        </GridItem>

        {/* Quizzes & Discussion Section */}
        <GridItem colSpan={{ base: 8, md: 3 }}>
          <DiscussionNavigation code={code} />
          <QuizNavigation code={code} />
        </GridItem>
      </Grid>

      {/* Add Topics Modal */}
      <AddTopicsModal
        isAddTopicModalOpen={isAddTopicModalOpen}
        onAddTopicModalClose={onAddTopicModalClose}
        handleAddTopics={handleAddTopics}
        selectedTopics={selectedTopics}
        selectedTopicDetails={selectedTopicDetails}
        setSelectedTopics={setSelectedTopics}
        setSelectedTopicDetails={setSelectedTopicDetails}
      />

      {/* Edit Course Modal */}
      <EditCourseModal
        isEditCourseModalOpen={isEditCourseModalOpen}
        onEditCourseModalClose={onEditCourseModalClose}
        newCourseTitle={newCourseTitle}
        newCourseDescription={newCourseDescription}
        setNewCourseDescription={setNewCourseDescription}
        setNewCourseTitle={setNewCourseTitle}
        handleEditCourse={handleEditCourse}
      />

      {/* Confirm Delete Topic Modal */}
      <DeleteTopicConfirmationModal
        isDeleteModalOpen={isDeleteModalOpen}
        onDeleteModalClose={onDeleteModalClose}
        confirmDeleteTopic={confirmDeleteTopic}
      />
    </Box>
  );
};

export default CourseDetails;
