"use client";
import {
  Box,
  Button,
  Container,
  Stack,
  Text,
  Heading,
  SimpleGrid,
  Icon,
  Link,
  Grid,
  GridItem,
  Avatar,
  useColorMode,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IconType } from "react-icons";
import {
  FaCheckCircle,
  FaChalkboardTeacher,
  FaRegPlayCircle,
} from "react-icons/fa";

const LandingPage = () => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const color = isDarkMode ? "primary.900" : "_dark.300";
  const { status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    router.push("/dashboard");
    return;
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg="primary.500"
        color="neutral.900"
        py={20}
        px={6}
        textAlign="center"
      >
        <Container maxW="container.lg">
          <Stack spacing={6} textAlign="center">
            <Heading fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold">
              Unlock Your Learning Potential
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }}>
              Access high-quality courses, taught by industry experts, from the
              comfort of your home.
            </Text>
            <Button
              colorScheme="primary"
              size="lg"
              borderRadius="md"
              px={8}
              fontSize="lg"
              mt={4}
              _hover={{
                transform: "scale(1.05)",
                transition: "transform 0.2s ease-in-out",
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="container.lg" py={16}>
        <Stack spacing={10} textAlign="center">
          <Heading size="lg">Why Choose Us?</Heading>
          <Text color="neutral.600" fontSize="lg">
            Here are just a few reasons why thousands of learners trust us to
            level up their skills:
          </Text>
        </Stack>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mt={10}>
          <FeatureCard
            icon={FaChalkboardTeacher}
            title="Expert Instructors"
            description="Learn from top professionals and industry leaders."
          />
          <FeatureCard
            icon={FaRegPlayCircle}
            title="On-Demand Learning"
            description="Watch lessons anytime, anywhere, at your own pace."
          />
          <FeatureCard
            icon={FaCheckCircle}
            title="Certifications"
            description="Earn certifications to boost your career prospects."
          />
        </SimpleGrid>
      </Container>

      {/* How It Works Section */}

      <Box bg="neutral.50" py={16}>
        <Container maxW="container.lg">
          <Stack spacing={10} textAlign="center">
            <Heading color={color} size="lg">
              How It Works
            </Heading>
            <Text color="neutral.600" fontSize="lg">
              Our platform is designed to be simple, user-friendly, and
              effective for all types of learners.
            </Text>
          </Stack>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={6}
            mt={12}
          >
            <GridItem textAlign="center">
              <Heading color={color} size="md" mb={4}>
                1. Browse Courses
              </Heading>
              <Text color="neutral.600">
                Explore our wide range of courses across various topics.
              </Text>
            </GridItem>
            <GridItem textAlign="center">
              <Heading color={color} size="md" mb={4}>
                2. Learn at Your Own Pace
              </Heading>
              <Text color="neutral.600">
                Watch lessons whenever you want and revisit them anytime.
              </Text>
            </GridItem>
            <GridItem textAlign="center">
              <Heading color={color} size="md" mb={4}>
                3. Get Certified
              </Heading>
              <Text color="neutral.600">
                Complete your course and receive a certification to showcase
                your skills.
              </Text>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxW="container.lg" py={16}>
        <Stack spacing={3} textAlign="center">
          <Heading size="lg">Meet our core team</Heading>
          <Text color="neutral.600" fontSize="lg">
            {`Meet the team dedicated to making learning accessible, impactful, and transformative for everyone`}
          </Text>
        </Stack>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10} mt={10}>
          <TestimonialCard
            name="Ashutosh Shrivastava"
            title="Full Stack Developer"
            quote="Ashutosh is the driving force behind our tech stack and backend architecture."
            image="/ashu.jpg"
          />
          <TestimonialCard
            name="Abhik Sarkar"
            title="Data Scientist"
            quote="Abhik specializes in machine learning and data analysis to provide insights that drive our platform"
            image="/abhik.jpeg"
          />
          <TestimonialCard
            name="Samundar Paji"
            title="ML Engineer"
            quote="Samundar builds powerful machine learning models that enhance user experience and automation."
            image=""
          />
          <TestimonialCard
            name="Pratham Sharma"
            title="Giga Chad Kid"
            quote="Pratham is the driving force behind our more 'creative' missteps and bringing his own brand of organized chaos to the team"
            image=""
          />
        </SimpleGrid>
      </Container>

      {/* Footer */}
      <Box bg="primary.900" color="neutral.50" py={8}>
        <Container maxW="container.lg" textAlign="center">
          <Text>
            &copy; {new Date().getFullYear()} Expanse. All rights reserved.
          </Text>
          <Stack direction="row" spacing={6} justify="center" mt={4}>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
            <Link href="#">Contact Us</Link>
          </Stack>
        </Container>
      </Box>
      {/* {status === "authenticated" && router.push("/dashboard")} */}
    </Box>
  );
};

// Feature Card Component
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: IconType;
  title: string;
  description: string;
}) => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const color = isDarkMode ? "primary.900" : "_dark.300";
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      boxShadow="lg"
      textAlign="center"
      _hover={{
        transform: "scale(1.05)",
        transition: "transform 0.2s ease-in-out",
      }}
    >
      <Icon as={icon} boxSize={12} color="primary.500" mb={4} />
      <Heading color={color} size="md" mb={2}>
        {title}
      </Heading>
      <Text color={color}>{description}</Text>
    </Box>
  );
};

// Testimonial Card Component
const TestimonialCard = ({
  name,
  title,
  quote,
  image,
}: {
  name: string;
  title: string;
  quote: string;
  image: string;
}) => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const color = isDarkMode ? "primary.900" : "_dark.300";
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      boxShadow="lg"
      textAlign="center"
      _hover={{
        transform: "scale(1.05)",
        transition: "transform 0.2s ease-in-out",
      }}
    >
      <Avatar src={image} name={name} mb={4} size="xl" />
      <Text color={color} fontSize="lg" fontWeight="bold">
        {name}
      </Text>
      <Text color={color}>{title}</Text>
      <Text color="neutral.600" mt={4}>
        {quote}
      </Text>
    </Box>
  );
};

export default LandingPage;
