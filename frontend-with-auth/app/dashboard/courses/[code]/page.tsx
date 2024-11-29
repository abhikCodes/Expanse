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
  useColorMode,
} from "@chakra-ui/react";
import { courseDetails } from "@/app/constants";

interface props {
  params: { code: string };
}

const CourseDetails = ({ params: { code } }: props) => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  console.log(code);

  return (
    <Box p={6} _dark={{ bg: "neutral.50._dark" }} maxW="1200px" mx="auto">
      {/* Course Header */}
      <Box mb={8} textAlign="center">
        <Heading
          as="h1"
          size="xl"
          color={isDarkMode ? "naturqal.900" : "primary.900"}
        >
          {courseDetails.course_name}
        </Heading>
        <Text
          fontSize="lg"
          mt={4}
          color={isDarkMode ? "naturqal.700" : "neutral.700"}
        >
          {courseDetails.course_description}
        </Text>
      </Box>

      {/* Topics Section */}
      <Flex gap={8} flexDirection={{ base: "column", md: "row" }}>
        <Box flex="1">
          <Heading
            as="h2"
            size="md"
            mb={4}
            color={isDarkMode ? "naturqal.900" : "primary.900"}
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
                  {topic.pdfData && (
                    <Button
                      colorScheme="blue"
                      onClick={() => setSelectedPdf(topic.pdfData)}
                    >
                      View PDF
                    </Button>
                  )}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>

        {/* PDF Viewer */}
        {selectedPdf && (
          <Box
            flex="1"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            height="500px"
          >
            <iframe
              src={`/pdfs/${selectedPdf}`}
              width="100%"
              height="100%"
              style={{
                border: "none",
              }}
              title="PDF Viewer"
            />
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default CourseDetails;
