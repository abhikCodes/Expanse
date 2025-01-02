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
        { quiz_name: "Quiz 1", status: "expired" },
        { quiz_name: "Quiz 2", status: "pending" },
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
