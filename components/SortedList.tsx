import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import styles from "../styles/Home.module.css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import CircularProgress from "@mui/material/CircularProgress";
import { ConfirmationDialogRaw } from "./ConfirmationDialogRaw";
// import { NameList } from "../components/Constants"

let opacity = 1;

// const options = ["0"];

let nameList = ["An", "error", "occurred"];

const SortedList = ({ userId, candidates, arr, giveVote }: any) => {
  // const [value, setValue] = React.useState("None selected");
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { data, setData } = useContext(UserContext);
  let Candidates = [];
  if (candidates !== undefined) {
    Candidates = candidates.map((names: any[]) => names[0]);
    nameList = Candidates;
  }

  useEffect(() => {
    opacity = 0;
    setLoaded(true);
  }, []);

  const letters = nameList.map((b) => b.charAt(0).toUpperCase());
  const uniqueLetters = Array.from(new Set(letters));
  const sortedLetters = Array.from(uniqueLetters).sort((a: string, b: string) =>
    a.localeCompare(b)
  );

  const groupedNames = () => {
    if (candidates == undefined) return;
    let tmp = [];

    for (let i = 0; i < sortedLetters.length; i++) {
      tmp.push(
        <>
          <div key={i} className={styles.letterDividerContainer}>
            <br></br>
            <Divider key={i * 10}>
              <h1 key={i * 10000}>{sortedLetters[i]}</h1>
            </Divider>
          </div>
        </>
      );
      let tmpGrid = [];
      let tmpCandidate = [];
      for (let j = 0; j < nameList.length; j++) {
        for (let k = 0; k < candidates.length; k++) {
          if (candidates[k].indexOf(nameList[j]) == 0) {
            tmpCandidate = candidates[k];
          }
        }
        if (nameList[j].charAt(0).toUpperCase() == sortedLetters[i]) {
          tmpGrid.push(
            <>
              <Grid key={j} item xs={12} sm={6} md={3} lg={3}>
                <Box
                  key={j * 10}
                  className={styles.CardHeaderContainer}
                  onClick={() => handleVote(nameList[j])}
                >
                  <CardHeader
                    key={j * 100}
                    className={styles.CardHeader}
                    avatar={
                      <Avatar
                        key={j * 1000}
                        className={styles.Avatar}
                        sx={{
                          bgcolor: "#eee",
                          // bgcolor: red[500],
                        }}
                        aria-label="name"
                        src={`https://avatars.dicebear.com/api/pixel-art-neutral/${nameList[j]}.svg?b=white&r=50`}
                      ></Avatar>
                    }
                    title={nameList[j]}
                    subheader={tmpCandidate[2]}
                  />
                </Box>
              </Grid>
            </>
          );
        }
      }
      tmp.push(
        <Grid key={i * 100} container spacing={1}>
          {tmpGrid}
        </Grid>
      );
    }
    return tmp;
  };

  const handleVote = (candidate: string) => {
    if (arr[0] == "Choose a campaign") {
      return window.alert("Please choose a campaign first");
    }
    if (userId == "0") {
      return window.alert("Please login first! (top right)");
    }
    let choice = [false];
    for (let i = 0; i < candidates.length; i++) {
      if (candidates[i].indexOf(candidate) == 0) {
        choice = candidates[i];
      }
    }

    if (choice[0] == false) {
      return;
    }
    let result = window.confirm(`Vote for ${candidate}?`);
    if (result) {
      return giveVote(choice);
    }
    window.alert("Cancelled");
  };

  const handleClose = (newValue?: string) => {
    setOpen(false);

    if (newValue) {
      setData({ ...data, candidate: newValue });
    }
  };

  return (
    <div className={styles.contactsContainer}>
      <main className={styles.main}>
        <>
          {loaded ? (
            <div key={0}>{groupedNames()}</div>
          ) : (
            <div
              className={styles.progress}
              style={{
                zIndex: 1204,
                position: "absolute",
                fontSize: "6rem",
                textAlign: "center",
                left: 0,
                right: 0,
                marginLeft: "auto",
                marginRight: "auto",
                textShadow: "0 0 10px grey",
                transition: `opacity 3s ease-out`,
                opacity: `${opacity}`,
                filter: "scale(2)",
              }}
            >
              <CircularProgress />
            </div>
          )}
        </>

        <ConfirmationDialogRaw
          id="campaign-menu"
          keepMounted
          open={open}
          onClose={handleClose}
          value={"value"}
        />
      </main>
      {/* <footer className={styles.footer}>
        Sorted list with Next.js + Material UI 0xlws
      </footer> */}
    </div>
  );
};

export default SortedList;
