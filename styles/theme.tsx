import { grey } from "@mui/material/colors";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {}
}


// xs={12} sm={6} md={4} lg={3}

// //   // allow configuration using `createTheme`
//   interface ThemeOptions {
//     hiddenButton: {
//       styleOverrides: {
//           root: {
//               display: string;
//               position: string;
//               marginLeft: string;
//               marginRight: string;
//               left: string;
//               top: string;
//               transform: string;
//               width: string;
//           };
//       };
//   }
//   }
// }

// const theme = createTheme()
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
          // height:"2.5rem"
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          // transition: "all 20s ease-out"
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
    MuiSpeedDial: {
      styleOverrides: {
        root: {
          // marginBottom:"50px"
          // backgroundColor:"grey",
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        item: {
        
          // xs:12, sm:6, md:4, lg:3,
          display: "flex",
          // position:"relative",
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
          // positioin:"absolute",
          //   float:"left",
          //   right:0,
          //   left:0,
          //   width:"50%",
          //   // top:"-36px",
          //   marginBottom:"-100px",
          //   marginRight:"8px"
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          opacity: 1,
          // borderBottom: "1px solid #ffd700",
          // background:   "#ffd700",
          // borderBottom: "1px solid grey",
          // background:   "grey",
          // opacity:1
          // boxShadow: "0px 0px 1px #ffd700"
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
 
          borderRadius:"3px",
          "&.pseudoBtn:hover .imgDiv": {
            opacity: 0,
          },
        },
      },
    },
    // MuiButton: {
    //   styleOverrides: {
    //     root: {
    //       position: "relative",
    //       marginLeft: "auto",
    //       marginRight: "auto",
    //       left: "50%",
    //       top: "-6.5em",
    //       transform: "translate(-50%, -50%)",
    //       width: "50%",
    //     },
    //   },
    // },

    MuiCardMedia: {
      styleOverrides: {
        img: {
          // width:"600px",
          // objectFit:"fill",
          // zIndex: "1",
          objectPosition: "0px 0%",
          minHeight: "200px",
          maxHeight: "200px",
          // transition: "all 0.3s ease-out",
          transformOrigin: "bottom center",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          // ".showLinks": {
          //   position: "relative",
          // },
          // ".a, .b, .c, .d ": {
          //   transition: "all 2s ease-out",
          //   opacity: 0.5,
          // },

          // ".showLinks:hover .a, .showLinks:hover .b, .showLinks:hover .c, .showLinks:hover .d":
          //   {
          //     opacity: 1,
          //   },
          // "& .hiddenButton": {
          //   transition: "all 0.3s ease-out",
          //   opacity: "0",
          // },
          // "&:hover .imgDiv": {
          //   transform: "scale(1.05)",
          // },

          "&:hover .hiddenButton": {
            opacity: "1",
            cursor: "default",
          },
          // "&:hover .hiddenButton" : {
          //   opacity:"1"
          // },
          minWidth: "350px",
          // width:"420px",
          minHeight: "450px",
          maxHeight: "450px",
          maxWidth: "420px",
          border: "none",

          boxShadow: "0 1px 2px lightgrey",
          fontColor: "black",
          // transition: "all 0.08s ease-in",
          //   zIndex:"-10000",
          // filter: "brightness(9%)",
          //   boxShadow: "0 0 1px black",
          "&:hover": {
            boxShadow: "0 0 10px darkgrey",
            // filter: "brightness(100%)"
          },
        },
      },
    },
  },
});

export default theme;
