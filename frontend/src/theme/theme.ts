import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: { main: "#FF6B35" },
    secondary: { main: "#004E89" },
    background: { default: "#F7F3EE", paper: "#FFFFFF" },
    text: { primary: "#2B2622", secondary: "#6F675F" },
  },
  shape: { borderRadius: 10 },
  typography: {
    h4: { fontWeight: 700, letterSpacing: -0.5 },
    subtitle1: { lineHeight: 1.3 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          borderColor: "#EAE4DC",
          transition: "box-shadow 150ms ease, transform 150ms ease",
          "&:hover": {
            boxShadow: "0 6px 16px rgba(43, 38, 34, 0.10)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: { "&:last-child": { paddingBottom: 16 } },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { backgroundColor: "#FFFFFF" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: { borderColor: "#EAE4DC" },
      },
    },
  },
});
