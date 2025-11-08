import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          boxShadow: "none",
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 30,
          boxShadow: "none !important",
          padding: "12px 24px",
          fontSize: 16,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 30,
        },
      },
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#0d3cfe",
      contrastText: "#fff",
    },
    success: {
      main: "#4caf50",
      contrastText: "#fff",
    },
  },
});
