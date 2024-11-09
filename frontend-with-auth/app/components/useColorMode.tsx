"use client";
import { useColorMode, Button, Icon } from "@chakra-ui/react";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";

const ToggleThemeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button size="sm" onClick={toggleColorMode}>
      <Icon>
        {colorMode === "light" ? (
          <MdDarkMode size="sm" />
        ) : (
          <CiLight size="sm" />
        )}
      </Icon>
    </Button>
  );
};

export default ToggleThemeButton;
