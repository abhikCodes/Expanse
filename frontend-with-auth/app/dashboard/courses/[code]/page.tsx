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
  Spinner,
} from "@chakra-ui/react";
import { courseDetails } from "@/app/constants";
import { Document, Page, pdfjs } from "react-pdf";
import { useSession } from "next-auth/react";

interface props {
  params: { code: string };
}

// Worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const CourseDetails = ({ params: { code } }: props) => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loadingError, setLoadingError] = useState<boolean>(false);
  const { colorMode } = useColorMode();
  const { data, status } = useSession();
  console.log(data, status);
  const isDarkMode = colorMode === "dark";

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoadingError(false); // Reset error on successful load
  };

  return (
    <Box _dark={{ bg: "neutral.50._dark" }} maxW="1200px" mx="auto">
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
                  {topic.pdfData && (
                    <Button
                      color={isDarkMode ? "neutral.900" : "primary.900"}
                      onClick={() => {
                        setSelectedPdf(topic.pdfData);
                        setLoadingError(false); // Reset error when selecting a new PDF
                      }}
                    >
                      View PDF
                    </Button>
                  )}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
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
            {!loadingError && selectedPdf && (
              <Button
                color={isDarkMode ? "neutral.900" : "primary.900"}
                mt={4}
                as="a"
                href={`/pdfs/${selectedPdf}`}
                download
              >
                Download PDF
              </Button>
            )}
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default CourseDetails;
