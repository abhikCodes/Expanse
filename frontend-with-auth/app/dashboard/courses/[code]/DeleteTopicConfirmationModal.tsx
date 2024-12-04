import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import React from "react";

interface props {
  isDeleteModalOpen: boolean;
  onDeleteModalClose: () => void;
  confirmDeleteTopic: () => void;
}

const DeleteTopicConfirmationModal = ({
  isDeleteModalOpen,
  onDeleteModalClose,
  confirmDeleteTopic,
}: props) => {
  return (
    <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Delete</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete this topic? This action cannot be
          undone.
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={confirmDeleteTopic}>
            Delete
          </Button>
          <Button variant="ghost" onClick={onDeleteModalClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteTopicConfirmationModal;
