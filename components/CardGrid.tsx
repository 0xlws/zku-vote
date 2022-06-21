import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Tooltip from "@mui/material/Tooltip";
import SpeedDial from "@mui/material/SpeedDial";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styles from "../styles/proposalsPage.module.css";
import RightDrawer from "../components/RightDrawer";

const LightDivider = styled(Divider)({
  opacity: 0.3,
});

let user = {};

export default function CardGrid({ props, Data, userId, giveVote, open, setOpen }: any) {
  // const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const handleClick = (proposal: any) => {
    user = proposal;
    handleOpen();
  };

  return (
    <>
      <Grid container spacing={4}>
        {Data?.map((proposal: any, index: any) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
            <Card className={styles.Card}>
              <div
                style={{
                  position: "relative",
                  zIndex: "3",
                }}
              >
                <div>
                  <CardMedia
                    className="imgDiv"
                    component="img"
                    // image={proposal.img}
                    image={`/images/img_${index}.png`}
                    alt="Please upload an image"
                    // alt="/zkulogo.png"
                  />
                  <div
                    style={{
                      position: "relative",
                      height: "5px",
                    }}
                  ></div>

                  <CardContent>
                    <Typography
                      sx={{ backgroundColor: "grey", height: "32px" }}
                      key={index + 200}
                      paragraph
                      variant="h5"
                      component="div"
                    >
                      {proposal[0]}
                    </Typography>
                    <Typography
                      className={styles.Typography}
                      sx={{
                        height: "68px",
                        fontSize: "14px",
                      }}
                      variant="body2"
                      color="text.secondary"
                    >
                      {proposal[4].info.substr(0, 250) + "..."}
                    </Typography>
                    <div
                      style={{
                        position: "relative",
                        width: "100%",

                        height: "2rem",
                      }}
                    >
                      <LightDivider
                        sx={{
                          marginBottom: "5px",
                        }}
                        variant="middle"
                      />
                      <div
                        style={{
                          position: "absolute",

                          left: "0",
                          right: "0",
                          marginLeft: "auto",
                          marginRight: "auto",
                          width: "40%",
                        }}
                      >
                        <Tooltip
                          sx={{
                            position: "absolute",
                            zIndex: "10",
                          }}
                          title="Milestones reached"
                          placement="top"
                          arrow
                        >
                          <Button
                            style={{
                              opacity: "0",
                              position: "absolute",
                              right: 0,
                            }}
                          >
                            QWERTYUIOPASDF
                          </Button>
                        </Tooltip>
                        <Rating
                          sx={{
                            filter: "drop-shadow(0 0 10px goldenrod)",
                          }}
                          name="read-only"
                          value={proposal[2] / 5}
                          precision={0.2}
                          size="large"
                          readOnly
                        />
                      </div>
                    </div>

                    <LightDivider
                      sx={{
                        marginTop: "10px",
                      }}
                      variant="middle"
                    />
                    <div
                      style={{
                        position: "relative",
                      }}
                    >
                      <div className="showLinks">
                        <div
                          style={{
                            position: "absolute",
                            right: 0,
                            bottom: 0,
                          }}
                        >
                          <Tooltip title="Open menu" arrow>
                            <SpeedDial
                              key={index}
                              ariaLabel="SpeedDial controlled open"
                              sx={{
                                position: "absolute",
                                bottom: 16,
                                right: 0,
                              }}
                              icon={<MoreHorizIcon />}
                              onClick={() => handleClick(proposal)}
                              open={open}
                            ></SpeedDial>
                          </Tooltip>
                        </div>

                        <CardHeader
                          sx={{
                            zIndex: 0,
                            marginTop: "0px",
                            marginLeft: "-1rem",
                          }}
                          avatar={
                            <Avatar
                              sx={{ zIndex: 1, bgcolor: grey[500] }}
                              aria-label="name"
                            ></Avatar>
                          }
                          title={proposal[4].discord}
                          // subheader="3 June, 2022"
                        />
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
      <RightDrawer
        handleOpenFunc={handleOpen}
        open={open}
        proposal={user}
        userId={userId}
        giveVote={giveVote}
      />
    </>
  );
}
