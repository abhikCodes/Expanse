"use client";
import React, { useState, useEffect } from "react";
// import { courseData } from "@/app/constants";
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
} from "@chakra-ui/react";
import Course from "./course";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const { status, data: sessionData } = useSession();

  const [newCourse, setNewCourse] = useState({
    course_code: "",
    course_name: "",
    course_description: "",
  });

  console.log(sessionData, "session");
  console.log(status, "session");
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<Course[] | null>(null);

  const handleClick = (course_id: number) => {
    router.push(`/dashboard/courses/${course_id}`);
  };

  const handleEdit = (course_code: string) => {
    console.log(`Edit course: ${course_code}`);
    router.push("/dashboard/courses/" + course_code);
    // Implement edit logic
  };

  const handleDelete = (course_code: string) => {
    setCourseToDelete(course_code);
    onDeleteModalOpen(); // Open delete confirmation modal
  };

  const confirmDeleteCourse = () => {
    if (courseToDelete) {
      console.log(`Course deleted: ${courseToDelete}`);
      // Implement delete logic here, such as making an API call or removing the course from the state
    }
    onDeleteModalClose(); // Close the modal
  };

  const handleAddCourse = () => {
    console.log("Add new course:", newCourse);
    // Add logic to save new course
    setNewCourse({ course_code: "", course_name: "", course_description: "" });
    onClose();
  };

  useEffect(() => {
    getUser();
  }, []);

  const bg = useColorModeValue("neutral.500", "neutral.50._dark");

  async function getUser() {
    try {
      const response = await axios.get<CourseResponse>(
        "http://localhost:8000/course?mode=all",
        {
          headers: {
            Authorization: `Bearer ${sessionData?.idToken}`, // Send token as Bearer
          },
        }
      );
      console.log(response.data, "res");
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
              onDelete={() => handleDelete(course.course_code)} // Pass the course code to handleDelete
              onClick={handleClick}
            />
          </Box>
        ))}
      </Flex>

      {/* Delete Confirmation Modal */}
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
