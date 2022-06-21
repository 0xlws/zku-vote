import { grey } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {}
}

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      // small
      sm: 850,
      // medium
      md: 1200,
      // large
      lg: 1600,
      // extra-large
      xl: 1536,
    },
  },
  typography: {
    fontFamily: "montserrat",
  },
  shape: {
    borderRadius: 3,
  },
  components: {
    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: "3px",
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: "3px",
          height: "2.5rem",
          color: "white",
          transition: "all 20s ease-out",
          backgroundColor: grey[500],
          "&:hover": {
            backgroundColor: "lightgrey",
          },
        },
      },
    },

    MuiGrid: {
      styleOverrides: {
        item: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontWeight: "bold",
          borderRadius: "3px",
          fontSize: "0.8rem",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          zIndex: 4,
          top: "64px",
          boxShadow: "0 0 20px grey",
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        root: {
          fontSize: "2rem",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          opacity: 1,
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          background: "#e9e9e9",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: "3px",
          "&.pseudoBtn:hover .imgDiv": {
            opacity: 0,
          },
        },
      },
    },

    MuiCardMedia: {
      styleOverrides: {
        img: {
          objectPosition: "0px 0%",
          minHeight: "200px",
          maxHeight: "200px",
          transformOrigin: "bottom center",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          "&:hover .hiddenButton": {
            opacity: "1",
            cursor: "default",
          },
          minWidth: "350px",
          minHeight: "450px",
          maxHeight: "450px",
          maxWidth: "420px",
          border: "none",

          boxShadow: "0 1px 2px lightgrey",
          fontColor: "black",
          "&:hover": {
            boxShadow: "0 0 10px darkgrey",
          },
        },
      },
    },
  },
});

export default theme;
