"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorMode,
  Spinner,
  Grid,
  GridItem,
  Button,
  HStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Select,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import QuizNavigation from "./QuizNavigation";
import DiscussionNavigation from "./DiscussionNavigation";
import CreateTopicModal from "./AddTopicsModal"; // Import the modal
import { API_BASE_URL } from "@/app/constants";
import PDFViewer from "@/app/components/PDFViewer";

interface Props {
  params: { code: string };
}

const CourseDetails = ({ params: { code } }: Props) => {
  const { data: sessionData } = useSession();
  const role = sessionData?.user.role;
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  const [courseDetails, setCourseDetails] = useState<{
    course_name: string;
    course_description: string;
    course_code: string;
  } | null>(null);

  const [topics, setTopics] = useState<
    {
      topic_id: string;
      topic_name: string;
      topic_description: string;
      content_id: [string];
    }[]
  >([]);
  const [expandedTopic, setExpandedTopic] = useState<{
    pdf?: string;
    video?: string;
  } | null>(null);

  const [loadingCourse, setLoadingCourse] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);

  const [isCreateTopicModalOpen, setCreateTopicModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const toast = useToast();
  const openCreateTopicModal = () => setCreateTopicModalOpen(true);
  const closeCreateTopicModal = () => setCreateTopicModalOpen(false);

  const openDeleteModal = (topic_id: string) => {
    setTopicToDelete(topic_id);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => setDeleteModalOpen(false);

  // Fetch course details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoadingCourse(true);
      try {
        const response = await axios.get(API_BASE_URL + "course", {
          params: { course_id: code },
        });
        const data = response.data;
        if (data.status === "success" && data.data.length > 0) {
          const course = data.data[0];
          setCourseDetails({
            course_name: course.course_name,
            course_description: course.course_description,
            course_code: course.course_code,
          });
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoadingCourse(false);
      }
    };
    fetchCourseDetails();
  }, []);

  // Fetch topics
  const fetchTopics = async () => {
    setLoadingTopics(true);
    try {
      const response = await axios.get(API_BASE_URL + "topics?mode=all", {
        params: { course_id: code },
        headers: {
          Authorization: `Bearer ${sessionData?.idToken}`,
        },
      });
      const data = response.data;
      if (data.status === "success") {
        setTopics(data.data);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setLoadingTopics(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [code]);

  useEffect(() => {
    if (selectedContent) {
      fetchTopicContent(selectedContent);
    }
  }, [selectedContent]);

  // Fetch topic content on expand
  const fetchTopicContent = async (content_id: string) => {
    setLoadingContent(true);
    try {
      const response = await axios.get(API_BASE_URL + "content", {
        params: { content_id: content_id },
        responseType: "arraybuffer",
      });

      const contentType = response.headers["content-type"];
      const byteArray = new Uint8Array(response.data);

      if (contentType === "application/pdf") {
        const pdfBlob = new Blob([byteArray], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setExpandedTopic({ pdf: pdfUrl });
      } else if (contentType.startsWith("video/")) {
        const videoBlob = new Blob([byteArray], { type: contentType });
        const videoUrl = URL.createObjectURL(videoBlob);
        setExpandedTopic({ video: videoUrl });
      } else {
        console.warn("Unsupported content type:", contentType);
      }
    } catch (error) {
      console.error("Error fetching topic content:", error);
    } finally {
      setLoadingContent(false);
    }
  };

  // Handle topic deletion
  const confirmDeleteTopic = async () => {
    if (!topicToDelete) return;

    try {
      const response = await axios.delete(API_BASE_URL + "topics", {
        params: { topic_id: topicToDelete },
        headers: {
          Authorization: `Bearer ${sessionData?.idToken}`,
        },
      });
      if (response.status === 204) {
        setTopics((prevTopics) =>
          prevTopics.filter((topic) => topic.topic_id !== topicToDelete)
        );

        toast({
          title: "Topic deleted.",
          description: `Topic has been deleted.`,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      toast({
        title: "Error deleting Topic.",
        description: "Failed to delete the Topic. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      console.error("Error deleting topic:", error);
    } finally {
      closeDeleteModal();
    }
  };

  const handleTopicCreated = () => {
    fetchTopics();
  };

  return (
    <Box mx="auto" py={8} px={4}>
      {/* Course Header */}
      {loadingCourse ? (
        <Spinner />
      ) : courseDetails ? (
        <Box mb={8} textAlign="center">
          <Heading
            as="h1"
            size="xl"
            color={isDarkMode ? "neutral.900" : "primary.900"}
          >
            {courseDetails.course_name} - {courseDetails.course_code}
          </Heading>
          <Box mt={4} p={4} maxH="120px" overflowY="auto" borderRadius="md">
            <Text
              fontSize="lg"
              color={isDarkMode ? "neutral.700" : "neutral.700"}
            >
              {courseDetails.course_description}
            </Text>
          </Box>
        </Box>
      ) : (
        <Text>Error loading course details.</Text>
      )}

      {role === "teacher" && (
        <Button onClick={openCreateTopicModal} colorScheme="teal" mb={4}>
          Create New Topic
        </Button>
      )}

      {/* Create Topic Modal */}
      <CreateTopicModal
        isOpen={isCreateTopicModalOpen}
        onClose={closeCreateTopicModal}
        courseId={code}
        onTopicCreated={handleTopicCreated}
      />

      {/* Confirm Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              All uploaded files will be deleted as well. Are you sure you want
              to delete this topic?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={confirmDeleteTopic} mr={3}>
              Delete
            </Button>
            <Button variant="ghost" onClick={closeDeleteModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
            <Heading
              as="h2"
              size="md"
              mb={4}
              color={isDarkMode ? "neutral.900" : "primary.900"}
            >
              Topics Covered
            </Heading>
            {loadingTopics ? (
              <Spinner />
            ) : topics.length > 0 ? (
              <Accordion allowToggle>
                {topics.map((topic) => (
                  <AccordionItem key={topic.topic_id}>
                    <AccordionButton
                      onClick={() => {
                        setExpandedTopic(null);
                        setSelectedContent(null);
                      }}
                    >
                      <Box flex="1" textAlign="left">
                        {topic.topic_name}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      <Text mb={4}>{topic.topic_description}</Text>
                      <HStack mb="5" justify="space-between">
                        <Select
                          size="sm"
                          onChange={(e) => {
                            setSelectedContent(e.target.value);
                          }}
                          value={selectedContent || ""}
                        >
                          <option value="" disabled hidden>
                            Select The Content To Display
                          </option>
                          {topic?.content_id?.map((contentId: string, id) => (
                            <option key={id} value={contentId}>
                              {`Content ${id + 1}`}
                            </option>
                          ))}
                        </Select>

                        {role === "teacher" && (
                          <Button
                            minWidth="100px"
                            size="sm"
                            colorScheme="red"
                            onClick={() => openDeleteModal(topic.topic_id)}
                          >
                            Delete Topic
                          </Button>
                        )}
                      </HStack>
                      {loadingContent ? (
                        <Spinner />
                      ) : (
                        expandedTopic && (
                          <Box>
                            {expandedTopic.pdf && (
                              <Box mb={4}>
                                <Heading as="h3" size="sm" mb={2}>
                                  PDF:
                                </Heading>
                                <PDFViewer file={expandedTopic.pdf} />
                              </Box>
                            )}
                            {expandedTopic.video && (
                              <Box>
                                <Heading as="h3" size="sm" mb={2}>
                                  Video:
                                </Heading>
                                <video controls>
                                  <source
                                    src={expandedTopic.video}
                                    type="video/mp4"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                              </Box>
                            )}
                          </Box>
                        )
                      )}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <Text>No topics available.</Text>
            )}
          </Box>
        </GridItem>

        {/* Quizzes & Discussion Section */}
        <GridItem colSpan={{ base: 8, md: 3 }}>
          <DiscussionNavigation code={code} />
          <QuizNavigation code={code} />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default CourseDetails;
