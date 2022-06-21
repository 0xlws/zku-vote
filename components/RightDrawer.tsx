import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";

export default function DrawerRight(props: {
  handleOpenFunc: () => void;
  userId: string;
  giveVote: (arg0: any) => any;
  open: boolean | undefined;
  proposal: any;
}) {

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      props.handleOpenFunc();
    };

  const approve = (proposal: any) => {
    if (props.userId == "0") {
      return window.alert("Please login first! (top right)");
    }

    let result = window.confirm(`Vote for ${proposal[0]}?`);
    if (result) {
      return props.giveVote(proposal);
    }
    window.alert("Cancelled");
  };

  const handleWebsite = (url: string | URL | undefined) => {
    return window.open(url);
  };

  //   const list = (anchor: Anchor) => (

  return (
    <>
      <div>
        <React.Fragment>
          <Drawer
            anchor="right"
            sx={{
              width: { xs: "100vw", sm: "28rem" },
            }}
            open={props.open}
            onClose={toggleDrawer(false)}
          >
            <Box
              sx={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                backgroundColor: "#e9e9e9",
                height: "100%",
              }}
              role="presentation"
              onKeyDown={toggleDrawer(false)}
            >
              {props.open ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    paddingTop: "16px",
                    borderRadius: "3px",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      top: 0,
                      justifyContent: "center",
                      backgroundColor: "white",
                      borderRadius: "inherit",
                    }}
                  >
                    <IconButton
                      sx={{
                        width: "100%",
                      }}
                      onClick={toggleDrawer(false)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>

                  <div
                    style={{
                      backgroundColor: "white",
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "200px",
                      maxHeight: "200px",
                      justifyContent: "center",
                      alignContent: "center",
                      minWidth: "100%",
                      marginLeft: "auto",
                      marginRight: "auto",
                      borderRadius: "inherit",
                      marginTop: "8px",
                    }}
                  >
                    <CardContent sx={{}}>
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        Title
                      </Typography>
                      <Typography variant="h5" component="div">
                        {props.proposal[0]}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Description
                      </Typography>
                      <Typography variant="body2">
                        {props.proposal[4].info}
                        <br />
                        {'"a benevolent smile"'}
                      </Typography>
                    </CardContent>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      marginTop: "8px",
                      borderRadius: "3px",
                      backgroundColor: "white",
                      flexDirection: "column",
                    }}
                  >
                    <IconButton
                      onClick={() => handleWebsite(props.proposal[4].website)}
                      sx={{
                        justifyContent: "flex-start",
                        fontSize: "1rem",
                      }}
                    >
                      <OpenInNewIcon /> : Dapp
                    </IconButton>
                    <IconButton
                      onClick={() => handleWebsite(props.proposal[4].demo)}
                      sx={{
                        justifyContent: "flex-start",
                        fontSize: "1rem",
                      }}
                    >
                      <OndemandVideoIcon />: Video Demo
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleWebsite(props.proposal[4].source_code)
                      }
                      sx={{
                        justifyContent: "flex-start",
                        fontSize: "1rem",
                      }}
                    >
                      <GitHubIcon />: Source Code
                    </IconButton>
                  </div>

                  <Tooltip title="Approve proposal" arrow>
                    <IconButton
                      onClick={() => approve(props.proposal)}
                      sx={{
                        backgroundColor: "white",
                        borderRadius: "inherit",
                        marginTop: "8px",
                      }}
                    >
                      <ThumbUpIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              ) : (
                ""
              )}
            </Box>
          </Drawer>
        </React.Fragment>
      </div>
    </>
  );
}
