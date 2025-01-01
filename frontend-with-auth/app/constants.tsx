export const courseData = {
  data: [
    {
      course_code: "COMP41730",
      course_name: "Distributed Systems",
      course_description: "Understanding the concepts of distributed systems.",
    },
    {
      course_code: "COMP12345",
      course_name: "Algorithms",
      course_description:
        "In-depth study of advanced algorithms and data structures.",
    },
    {
      course_code: "COMP67890",
      course_name: "Machine Learning",
      course_description:
        "A comprehensive introduction to machine learning concepts.",
    },
    {
      course_code: "COMP41761",
      course_name: "Computer Networks",
      course_description: "Understanding the concepts of distributed systems.",
    },
    {
      course_code: "COMP24563",
      course_name: "Data Structures",
      course_description:
        "In-depth study of advanced algorithms and data structures.",
    },
  ],
};

export const courseDetails = {
  course_code: "COMP41730",
  course_name: "Distributed Systems",
  course_description: "Understanding the concepts of distributed systems.",
  topics: [
    {
      id: "1",
      title: "Introduction to Distributed Systems",
      description:
        "Overview of distributed systems, their characteristics, and common use cases.",
      pdfData: "intro-to-distributed-systems.pdf",
    },
    {
      id: "2",
      title: "Communication in Distributed Systems",
      description:
        "Exploring communication protocols, message passing, and challenges in distributed systems.",
      pdfData: "communication-protocols.pdf",
    },
    {
      id: "3",
      title: "Consensus and Fault Tolerance",
      description:
        "Understanding consensus algorithms like Paxos and Raft, and techniques for achieving fault tolerance.",
      pdfData: "consensus-fault-tolerance.pdf",
    },
    {
      id: "4",
      title: "Distributed Data Storage",
      description:
        "Introduction to distributed databases, consistency models, and CAP theorem.",
      pdfData: "distributed-data-storage.pdf",
    },
    {
      id: "5",
      title: "Distributed System Design Patterns",
      description:
        "Common design patterns used in building distributed systems, such as microservices and event-driven architecture.",
      pdfData: "design-patterns.pdf",
    },
  ],
};

export const notifications = [
  {
    id: 1,
    title: 'Project submission" due on Friday, 6 December 2024 11:59 PM GMT.',
    description:
      "Assignment Submission Due - COMP47780-Cloud Computing-2024/25 Autumn",
    date: "Yesterday at 12:01 AM",
  },
  {
    id: 2,
    title: "Unit Testing Assignment Results Released",
    description:
      "Announcement Posted - COMP20300-Java Programming (Mixed Delive-2024/25 Autumn",
    date: "Wed at 9:37 PM",
  },
  {
    id: 3,
    title: "Unit Testing AI Generated Code Updated. Your grade is: A-",
    description:
      "Announcement Posted - COMP20300-Java Programming (Mixed Delive-2024/25 Autumn",
    date: "Wed at 9:37 PM",
  },
  {
    id: 4,
    title: 'Project submission" due on Friday, 6 December 2024 11:59 PM GMT.',
    description:
      "Assignment Submission Due - COMP12345-Machine Learning-2024/25 Autumn",
    date: "Yesterday at 12:01 AM",
  },
];

export const API_BASE_URL = "http://localhost:8080/";
export const API_DISCUSSION_BASE_URL = "http://localhost:8081/";
export const API_QUIZ_BASE_URL = "http://localhost:8082/";

export const DUMMY_QUIZZES = {
  teacher: [
    {
      course_code: "COMP40073",
      quizzes: [
        { quiz_name: "Midterm", status: "expired" },
        { quiz_name: "Final", status: "pending" },
      ],
    },
    {
      course_code: "COMP40074",
      quizzes: [
        { quiz_name: "Quiz 1", status: "pending" },
        { quiz_name: "Quiz 2", status: "pending" },
      ],
    },
  ],
};
