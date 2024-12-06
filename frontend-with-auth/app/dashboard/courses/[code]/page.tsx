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
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  const [courseDetails, setCourseDetails] = useState<{
    course_name: string;
    course_description: string;
  } | null>(null);

  const [topics, setTopics] = useState<
    {
      topic_id: string;
      topic_name: string;
      topic_description: string;
      content_id: string;
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
  const toast = useToast();
  const openCreateTopicModal = () => setCreateTopicModalOpen(true);
  const closeCreateTopicModal = () => setCreateTopicModalOpen(false);

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

  // Fetch topic content on expand
  const fetchTopicContent = async (content_id: string) => {
    setLoadingContent(true);
    try {
      const response = await axios.get(API_BASE_URL + "content", {
        params: { content_id: content_id },
        responseType: "arraybuffer", // Fetch data as binary
      });
      if (response.status === 200) {
        const byteArray = new Uint8Array(response.data); // Use response data directly
        const pdfBlob = new Blob([byteArray], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setExpandedTopic({ pdf: pdfUrl });
      }
    } catch (error) {
      console.error("Error fetching topic content:", error);
    } finally {
      setLoadingContent(false);
    }
  };

  // Handle topic deletion
  const deleteTopic = async (topic_id: string) => {
    try {
      const response = await axios.delete(API_BASE_URL + "topics", {
        params: { topic_id },
        headers: {
          Authorization: `Bearer ${sessionData?.idToken}`,
        },
      });
      if (response.status === 204) {
        toast({
          title: "Topic deleted.",
          description: `Topic has been deleted.`,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        fetchTopics(); // Refresh topics list
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
            {courseDetails.course_name} - {code}
          </Heading>
          <Text
            fontSize="lg"
            mt={4}
            color={isDarkMode ? "neutral.700" : "neutral.700"}
          >
            {courseDetails.course_description}
          </Text>
        </Box>
      ) : (
        <Text>Error loading course details.</Text>
      )}

      <Button onClick={openCreateTopicModal} colorScheme="teal" mb={4}>
        Create New Topic
      </Button>

      {/* Create Topic Modal */}
      <CreateTopicModal
        isOpen={isCreateTopicModalOpen}
        onClose={closeCreateTopicModal}
        courseId={code}
        onTopicCreated={handleTopicCreated}
      />

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
              <Accordion allowMultiple>
                {topics.map((topic) => (
                  <AccordionItem key={topic.topic_id}>
                    <AccordionButton
                      onClick={() => fetchTopicContent(topic.content_id[0])}
                    >
                      <Box flex="1" textAlign="left">
                        {topic.topic_name}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      <HStack justify="space-between">
                        <Text mb={4}>{topic.topic_description}</Text>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => deleteTopic(topic.topic_id)}
                        >
                          Delete Topic
                        </Button>
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
                                <video controls width="400">
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
