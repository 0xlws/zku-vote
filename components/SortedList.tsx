import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import styles from "../styles/Home.module.css";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import CircularProgress from "@mui/material/CircularProgress";


let opacity = 1

const options = ["0"];

export interface ConfirmationDialogRawProps {
  id: string;
  keepMounted: boolean;
  value: string;
  open: boolean;
  onClose: (value?: string) => void;
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const radioGroupRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>Confirm vote</DialogTitle>
      <DialogContent dividers>
        {/* <RadioGroup
          ref={radioGroupRef}
          aria-label="campaign"
          name="campaign"
          value={value}
          onChange={handleChange}
        >
          {options.map((option) => (
            <FormControlLabel
              value={option}
              key={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup> */}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Vote</Button>
      </DialogActions>
    </Dialog>
  );
}

// let nameList = [
//   "Virginia Howard",
//   "Liz Faulkner",
//   "Gil Holland",
//   "Arron Berry",
//   "Ollie Mosley",
//   "Monica Chapman",
//   "Silvia Campos",
//   "Marisa Mckenzie",
//   "Glenda Davenport",
//   "Jamey Crane",
//   "Vince Dennis",
//   "Peggy Pham",
//   "Marilyn Henson",
//   "Tricia Horton",
//   "Mercedes Villegas",
//   "Carmen Norton",
//   "Jed Castaneda",
//   "Sol Bray",
//   "Tom Novak",
//   "Percy Mcdowell",
//   "Esmeralda Ellison",
//   "Darcy Villa",
//   "Janet Archer",
//   "Jacquelyn Rosales",
//   "Adriana Jacobson",
//   "Derick Taylor",
//   "Walter Rowe",
//   "Xavier Gaines",
//   "Vivian Allen",
//   "Mauricio Graves",
//   "Alton Gray",
//   "Gretchen Davila",
//   "Emma Mcintosh",
//   "Patsy Sloan",
//   "Wallace Donovan",
//   "Sherry Blake",
//   "Erik Glover",
//   "Noreen Gutierrez",
//   "Kenya Malone",
//   "Bettie Lewis",
//   "Alan Herring",
//   "Royal Cline",
//   "Matilda Parsons",
//   "Christi Carter",
//   "Garry Maynard",
//   "Roberto Wilcox",
//   "Nona Carey",
//   "Sammy Rubio",
//   "Caroline Nichols",
//   "Felicia Gardner",
// ];

let nameList = ["An", "error", "occurred"];

const SortedList = ({ userId, candidates, arr, giveVote }: any) => {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false)
  // const [value, setValue] = React.useState("None selected");
  const { data, setData } = useContext(UserContext);
  let Candidates = [];
  if (candidates !== undefined) {
    Candidates = candidates.map((names: any[]) => names[0]);
    nameList = Candidates;
  }

  useEffect(()=>{
    opacity=0
    setLoaded(true)
  },[])

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
          {/* <Grid key={i} item xs={12} sm={6} md={4} lg={3}> */}
          <div key={i} className={styles.letterDividerContainer}>
            <br></br>
            {/* <Divider className={styles.letterDividerTop} variant="middle" /> */}
            <Divider key={i * 10}>
              <h1 key={i * 10000}>{sortedLetters[i]}</h1>
            </Divider>
            {/* <Divider className={styles.letterDividerBottom} variant="middle" /> */}
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
                  //   onClick={handleClickListItem}
                  onClick={() => handleVote(nameList[j])}
                >
                  {/* <Box
                  className={styles.CardHeaderContainer2}
                  onClick={handleClickListItem}
                > */}
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
                  {/* </Box> */}
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
      // console.log(tmp)
    }
    return tmp;
  };
  const handleClickListItem = () => {
    setOpen(true);
  };

  //   const handleVote = (candidate) => {
  const handleVote = (candidate: string) => {
    if (arr[0] == "Choose a campaign") {
      return window.alert("Please choose a campaign first");
    }
    if (userId == "0") {
      return window.alert("Please login first! (top right)");
    }
    // setData({ ...data, candidate: candidate });
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

    // console.log("Voted");
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
        <>{loaded?
          <div key={0}>{groupedNames()}</div> :
          <div
          className={styles.xxx}
          style={{
            zIndex: 1204,
            position: "absolute",
            fontSize: "6rem",
            textAlign: "center",
            left:0,
            right:0,
            marginLeft:"auto",
            marginRight:"auto",
            textShadow: "0 0 10px grey",
            transition: `opacity 3s ease-out`,
            opacity: `${opacity}`,
            filter: "scale(2)",
          }}
        >
          <CircularProgress />
        </div>
        }
        </>

        <ConfirmationDialogRaw
          id="campaign-menu"
          keepMounted
          open={open}
          onClose={handleClose}
          value={"value"}
          // candidate={candidate}
        />

        {/* <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
          <List component="div" role="group">
            <ListItem button divider disabled>
              <ListItemText primary="Interruptions" />
            </ListItem>
            <ListItem
              button
              divider
              aria-haspopup="true"
              aria-controls="ringtone-menu"
              aria-label="phone ringtone"
              onClick={handleClickListItem}
            >
              <ListItemText primary="Phone ringtone" secondary={value} />
            </ListItem>
            <ListItem button divider disabled>
              <ListItemText
                primary="Default notification ringtone"
                secondary="Tethys"
              />
            </ListItem>
          </List>
        </Box> */}
      </main>

      {/* <footer className={styles.footer}>
        Sorted list with Next.js + Material UI 0xlws
      </footer> */}
    </div>
  );
};

export default SortedList;
