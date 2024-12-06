"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  useDisclosure,
  useColorModeValue,
  Text,
  useToast,
} from "@chakra-ui/react";
import Course from "./course";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { API_BASE_URL } from "@/app/constants";

interface props {
  role: string;
}

interface Course {
  course_code: string;
  course_name: string;
  course_description: string;
  course_created_by: number;
  course_updated_by: number;
  course_id: number;
  course_created_timestamp: string;
  course_updated_timestamp: string;
}

interface CourseResponse {
  data: {
    status: string;
    message: string;
    data: Course[];
    timestamp: string;
  };
}

const Courses = ({ role }: props) => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const { data: sessionData } = useSession();

  const [newCourse, setNewCourse] = useState({
    course_code: "",
    course_name: "",
    course_description: "",
  });

  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [courseData, setCourseData] = useState<Course[] | null>(null);

  const handleClick = (course_id: number) => {
    router.push(`/dashboard/courses/${course_id}`);
  };

  const handleEdit = (course_code: string) => {
    console.log(`Edit course: ${course_code}`);
    router.push("/dashboard/courses/" + course_code);
  };

  const handleDelete = (course_id: number) => {
    setCourseToDelete(course_id);
    onDeleteModalOpen();
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}course?mode=all`, {
        params: { course_id: courseToDelete },
        headers: {
          Authorization: `Bearer ${sessionData?.idToken}`,
        },
      });
      setCourseData(
        (prevData) =>
          prevData?.filter((course) => course.course_id !== courseToDelete) ||
          []
      );
      toast({
        title: "Course deleted.",
        description: `Course with ID ${courseToDelete} has been deleted.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setCourseToDelete(null);
    } catch (error) {
      toast({
        title: "Error deleting course.",
        description: "Failed to delete the course. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      console.error("Failed to delete course:", error);
    }
    onDeleteModalClose();
  };

  const handleAddCourse = async () => {
    if (
      !newCourse.course_code ||
      !newCourse.course_name ||
      !newCourse.course_description
    ) {
      toast({
        title: "Invalid input.",
        description: "Please fill out all fields before submitting.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}course`,
        {
          course_code: newCourse.course_code,
          course_name: newCourse.course_name,
          course_description: newCourse.course_description,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionData?.idToken}`,
          },
        }
      );

      toast({
        title: "Course added.",
        description: `Course ${newCourse.course_name} has been added successfully.`,
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: true,
      });

      getCourses();

      setNewCourse({
        course_code: "",
        course_name: "",
        course_description: "",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error adding course.",
        description: "Failed to add the course. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      console.error("Failed to create course:", error);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const bg = useColorModeValue("neutral.500", "neutral.50._dark");

  async function getCourses() {
    try {
      const response = await axios.get<CourseResponse>(
        `${API_BASE_URL}course?mode=all`,
        {
          headers: {
            Authorization: `Bearer ${sessionData?.idToken}`,
          },
        }
      );
      setCourseData(response?.data?.data as unknown as Course[]);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Box p={6} bg={bg}>
      {role === "teacher" && (
        <>
          <Button colorScheme="teal" onClick={onOpen} mb={6}>
            Add New Course
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add New Course</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Input
                  placeholder="Course Code"
                  value={newCourse.course_code}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, course_code: e.target.value })
                  }
                  mb={4}
                />
                <Input
                  placeholder="Course Name"
                  value={newCourse.course_name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, course_name: e.target.value })
                  }
                  mb={4}
                />
                <Textarea
                  placeholder="Course Description"
                  value={newCourse.course_description}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      course_description: e.target.value,
                    })
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  onClick={handleAddCourse}
                  bg="primary.900"
                >
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}

      <Flex flexWrap="wrap" justifyContent="start" gap={8}>
        {courseData?.map((course) => (
          <Box key={course.course_code}>
            <Course
              course_id={course.course_id}
              course_code={course.course_code}
              course_name={course.course_name}
              course_description={course.course_description}
              role={role}
              onEdit={handleEdit}
              onDelete={() => handleDelete(course.course_id)}
              onClick={handleClick}
            />
          </Box>
        ))}
      </Flex>

      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this course?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={confirmDeleteCourse} mr={3}>
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

export default Courses;
