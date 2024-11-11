import React from "react";
import Courses from "./courses/page";
import { Grid, GridItem } from "@chakra-ui/react";
import ProfilePage from "./profile/page";

const Dashboard = () => {
  return (
    <Grid templateColumns="repeat(8, 1fr)" gap={4}>
      <GridItem colSpan={6}>
        <Courses />
      </GridItem>
      <GridItem colSpan={2}>
        <ProfilePage />
      </GridItem>
    </Grid>
  );
};

export default Dashboard;
