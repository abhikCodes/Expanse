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

export const dummyTopics = [
  // Distributed Systems Topics
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
  {
    id: "6",
    title: "Security in Distributed Systems",
    description:
      "Exploring security challenges and strategies, including encryption, authentication, and secure communication.",
    pdfData: "security-in-distributed-systems.pdf",
  },
  {
    id: "7",
    title: "Scalability in Distributed Systems",
    description:
      "Techniques to achieve scalability, such as load balancing, partitioning, and replication.",
    pdfData: "scalability-techniques.pdf",
  },
  {
    id: "8",
    title: "Monitoring and Debugging Distributed Systems",
    description:
      "Best practices and tools for monitoring, logging, and debugging distributed systems.",
    pdfData: "monitoring-debugging.pdf",
  },
  {
    id: "9",
    title: "Event-Driven Architectures",
    description:
      "Introduction to event-driven architectures and their application in real-time distributed systems.",
    pdfData: "event-driven-architectures.pdf",
  },
  {
    id: "10",
    title: "Future Trends in Distributed Systems",
    description:
      "Exploring emerging trends and technologies in distributed systems, such as edge computing and serverless architecture.",
    pdfData: "future-trends.pdf",
  },
  // Machine Learning Topics
  {
    id: "11",
    title: "Introduction to Machine Learning",
    description:
      "Understanding the basics of machine learning, types of learning, and real-world applications.",
    pdfData: "intro-to-machine-learning.pdf",
  },
  {
    id: "12",
    title: "Supervised Learning Algorithms",
    description:
      "Exploration of supervised learning techniques like linear regression, logistic regression, and decision trees.",
    pdfData: "supervised-learning.pdf",
  },
  {
    id: "13",
    title: "Unsupervised Learning Algorithms",
    description:
      "Overview of clustering and dimensionality reduction techniques such as K-Means and PCA.",
    pdfData: "unsupervised-learning.pdf",
  },
  {
    id: "14",
    title: "Deep Learning Fundamentals",
    description:
      "Introduction to neural networks, activation functions, and basic deep learning concepts.",
    pdfData: "deep-learning-fundamentals.pdf",
  },
  {
    id: "15",
    title: "Natural Language Processing",
    description:
      "Understanding NLP basics, tokenization, and language models like BERT and GPT.",
    pdfData: "natural-language-processing.pdf",
  },
  {
    id: "16",
    title: "Reinforcement Learning",
    description:
      "Basics of reinforcement learning, Markov decision processes, and popular algorithms like Q-learning.",
    pdfData: "reinforcement-learning.pdf",
  },
  {
    id: "17",
    title: "Model Evaluation and Optimization",
    description:
      "Techniques for evaluating machine learning models, hyperparameter tuning, and cross-validation.",
    pdfData: "model-evaluation.pdf",
  },
  {
    id: "18",
    title: "Computer Vision",
    description:
      "Introduction to image processing, convolutional neural networks, and applications of computer vision.",
    pdfData: "computer-vision.pdf",
  },
  {
    id: "19",
    title: "Ethics in AI and Machine Learning",
    description:
      "Exploring ethical considerations, bias in algorithms, and responsible AI practices.",
    pdfData: "ethics-in-ai.pdf",
  },
  {
    id: "20",
    title: "Future Trends in Machine Learning",
    description:
      "Exploring cutting-edge topics such as generative AI, explainable AI, and federated learning.",
    pdfData: "future-trends-ml.pdf",
  },
];

export const sampleQuizzes = [
  {
    id: "1",
    title: "DS Basics",
    description:
      "What are the fundamental characteristics of a distributed system?",
  },
  {
    id: "2",
    title: "History of DS",
    description: "How do distributed systems achieve reliable communication?",
  },
  {
    id: "3",
    title: "CAP Theorum",
    description:
      "What are the key differences between Paxos and Raft algorithms?",
  },
  {
    id: "4",
    title: "Fault Tolerance",
    description:
      "Can a system achieve consistency, availability, and partition tolerance simultaneously?",
  },
  {
    id: "5",
    title: "Remote Method Invocation",
    description:
      "What strategies can improve fault tolerance in a distributed environment?",
  },
  {
    id: "6",
    title: "Message Oriented Middleware",
    description:
      "How does an event-driven architecture handle real-time events?",
  },
];

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
export const API_QUIZ_BASE_URL = "http://localhost:8082/";

export const DUMMY_QUIZZES = {
  student: [
    {
      course_code: "COMP40073",
      quizzes: [
        { quiz_name: "Midterm", status: "completed", score: 8 },
        { quiz_name: "Final", status: "pending" },
      ],
    },
    {
      course_code: "COMP20050",
      quizzes: [
        { quiz_name: "Quiz 1", status: "expired" },
        { quiz_name: "Quiz 2", status: "pending" },
      ],
    },
  ],
  teacher: [
    {
      course_code: "COMP40073",
      quizzes: [
        { quiz_name: "Midterm", status: "expired" },
        { quiz_name: "Final", status: "pending" },
      ],
    },
    {
      course_code: "COMP20050",
      quizzes: [
        { quiz_name: "Quiz 1", status: "pending" },
        { quiz_name: "Quiz 2", status: "pending" },
      ],
    },
  ],
};
