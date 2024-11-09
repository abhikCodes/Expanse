import { extendTheme } from "@chakra-ui/react";

const colors = {
  primary: {
    900: "#004c4c", // Deep teal
    700: "#008C7E", // Medium teal
    500: "#00B3A6", // Vibrant teal
    300: "#66C9C2", // Soft teal

    // Dark mode variations
    _dark: {
      900: "#004c4c", // Same deep teal for dark mode (remains consistent for branding)
      700: "#008C7E", // Same medium teal
      500: "#00B3A6", // Light vibrant teal remains
      300: "#66C9C2", // Soft teal remains
    },
  },
  accent: {
    700: "#D4A5A5", // Dusty rose
    500: "#F1C6C6", // Soft pink
    300: "#FFDFDF", // Light blush

    // Dark mode variations
    _dark: {
      700: "#D4A5A5", // Keep dusty rose accent
      500: "#F1C6C6", // Soft pink for subtle accents
      300: "#FFDFDF", // Light blush remains
    },
  },
  neutral: {
    900: "#F0F4F4", // Off-white text for light mode
    600: "#A6B4B2", // Muted gray-green for neutral text
    50: "#FFFFFF", // Pure white for light mode backgrounds

    // Dark mode variations
    _dark: {
      900: "#D1E2E1", // Light gray-green for dark mode text
      600: "#8F9B98", // Darker muted gray-green for text
      50: "#121C22", // Very dark teal for dark mode background
    },
  },
  feedback: {
    success: "#A6D1B7", // Soft green
    error: "#F28C8C", // Muted red
    warning: "#FFCA7B", // Warm amber

    // Dark mode variations
    _dark: {
      success: "#A6D1B7", // Light green success message
      error: "#F28C8C", // Muted red for error
      warning: "#FFCA7B", // Warm amber for warnings
    },
  },
};

const theme = extendTheme({
  colors,
  styles: {
    global: {
      body: {
        margin: 0,
        padding: 0,
        width: "100%",
        height: "100%",
        overflowX: "hidden",
      },
    },
  },
  components: {
    Container: {
      baseStyle: {
        maxWidth: "90%", // Remove any default max-width
        padding: 0, // Remove padding if needed
      },
      sizes: {
        xl: {
          maxWidth: "100%",
        },
      },
    },
    Box: {
      baseStyle: {
        width: "100%",
      },
    },
    Grid: {
      baseStyle: {
        width: "100%",
      },
    },
  },
  config: {
    initialColorMode: "dark", // Default to dark mode
    useSystemColorMode: true, // Allow system preferences (user can toggle)
  },
});

export default theme;
