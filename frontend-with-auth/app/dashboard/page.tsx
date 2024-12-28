"use client";
import React from "react";
import { useSession } from "next-auth/react";
import Courses from "@/app/dashboard/courses/Courses";
import { Grid, GridItem } from "@chakra-ui/react";
import BasicDetails from "./profile/BasicDetails";
import QuickLinks from "./QuickLinks";

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>You need to log in to access the dashboard.</div>;

  const role = session.user.role;

  return (
    <Grid templateColumns="repeat(8, 1fr)" gap={4}>
      <GridItem colSpan={{ base: 8, md: 6 }}>
        <Courses role={role} />
      </GridItem>
      <GridItem
        colSpan={{ base: 0, md: 2 }}
        display={{ base: "none", md: "block" }}
      >
        <BasicDetails />
        <QuickLinks />
      </GridItem>
    </Grid>
  );
};

export default Dashboard;
