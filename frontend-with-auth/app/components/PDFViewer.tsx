import React, { useState } from "react";
import { Box, Spinner, Text, Flex } from "@chakra-ui/react";
import { Document, Page, pdfjs } from "react-pdf";

// Worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";

interface PDFViewerProps {
  file: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF document:", error);
    setLoading(false);
  };

  return (
    <Box
      position="relative"
      width="100%"
      height="100vh"
      overflow="auto"
      bg="gray.500"
      p={4}
    >
      {/* Loading Overlay */}
      {loading && (
        <Flex
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bg="rgba(0, 0, 0, 0.5)"
          zIndex={10}
          justifyContent="center"
          alignItems="center"
        >
          <Spinner size="xl" color="white" />
          <Text color="white" fontSize="lg" ml={4}>
            Loading PDF...
          </Text>
        </Flex>
      )}

      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<Spinner />}
      >
        {numPages &&
          Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={1.5}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              className="pdf-page"
            />
          ))}
      </Document>
    </Box>
  );
};

export default PDFViewer;
