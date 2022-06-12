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
  const [state, setState] = React.useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState(open);
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
          {/* <Button onClick={toggleDrawer(true)}>{"OPEN"}</Button> */}
          {/* <Button onClick={toggleDrawer(true)}>{"OPEN"}</Button> */}
          <Drawer
            anchor="right"
            sx={{
              width: { xs: "100vw", sm: "28rem" },
            }}
            // open={state}
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
              // onClick={toggleDrawer(false)}
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
                      // fontSize: "2rem",
                      // textAlign: "center",
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
                  {/* <div
                style={{
                  position: "relative",
                  display: "flex",
                  top: 0,
                  // fontSize: "2rem",
                  textAlign: "center",
                  backgroundColor: "white",
                  borderRadius: "inherit",
                }}
              >
                <Grid
                  container
                  sx={{
                    display: "flex",
                  }}
                >
                  <Grid
                    item
                    sm={6}
                    sx={{
                      minWidth: "50%",
                    }}
                  >
                    Name: Test
                  </Grid>
                  <Grid
                    item
                    sm={1}
                    sx={{
                      minWidth: "50%",
                    }}
                  >
                    Title
                  </Grid>
                  <Grid
                    item
                    sm={1}
                    sx={{
                      minWidth: "50%",
                    }}
                  ></Grid>
                  <Grid
                    item
                    sm={1}
                    sx={{
                      minWidth: "50%",
                    }}
                  ></Grid>
                </Grid>
              </div> */}

                  {/* <Typography
                sx={{
                  top: 0,
                  fontSize: "2rem",
                  textAlign: "center",
                  backgroundColor: "white",
                  borderRadius: "inherit",
                }}
                color="text.primary"
                gutterBottom
              >
                Title
              </Typography> */}
                  <div
                    style={{
                      // position:"absolute",
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
                      // width:"80%",
                      // display: "flex",
                      display: "flex",
                      // marginLeft: "0",
                      // marginRight: "auto",
                      marginTop: "8px",
                      borderRadius: "3px",
                      backgroundColor: "white",
                      flexDirection: "column",

                      // justifyContent: "flex-start",

                      // justifyContent: "space-around",
                    }}
                  >
                    {/* <CardActions> */}
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
                    {/* <Button size="small">Learn More</Button> */}
                    {/* </CardActions> */}
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
