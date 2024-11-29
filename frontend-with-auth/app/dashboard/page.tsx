import React from "react";
import Courses from "./courses/page";
import { Grid, GridItem } from "@chakra-ui/react";
import ProfilePage from "./profile/page";

const Dashboard = () => {
  return (
    <Grid templateColumns="repeat(8, 1fr)" gap={4}>
      <GridItem colSpan={{ base: 8, md: 6 }}>
        <Courses />
      </GridItem>
      <GridItem
        colSpan={{ base: 0, md: 2 }}
        display={{ base: "none", md: "block" }}
      >
        <ProfilePage />
      </GridItem>
    </Grid>
  );
};

export default Dashboard;
