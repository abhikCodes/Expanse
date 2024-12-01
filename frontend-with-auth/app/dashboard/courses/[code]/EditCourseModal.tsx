import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

interface props {
  isEditCourseModalOpen: boolean;
  onEditCourseModalClose: () => void;
  newCourseTitle: string;
  newCourseDescription: string;
  setNewCourseTitle: (value: string) => void;
  setNewCourseDescription: (value: string) => void;
  handleEditCourse: () => void;
}

const EditCourseModal = ({
  isEditCourseModalOpen,
  onEditCourseModalClose,
  newCourseTitle,
  newCourseDescription,
  setNewCourseDescription,
  setNewCourseTitle,
  handleEditCourse,
}: props) => {
  return (
    <Modal isOpen={isEditCourseModalOpen} onClose={onEditCourseModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Course Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Course Title"
            value={newCourseTitle}
            onChange={(e) => setNewCourseTitle(e.target.value)}
            mb={4}
          />
          <Input
            placeholder="Course Description"
            value={newCourseDescription}
            onChange={(e) => setNewCourseDescription(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={handleEditCourse}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCourseModal;
