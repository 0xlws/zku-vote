import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import subsInfo from "../public/proposals/submissionsInfoFixed.json";
import subsTitles from "../public/proposals/submissionsTitlesFixed.json";
import { contract } from "../Constants/Constants";
import { LoginContext } from "Contexts/LoginContext";
import CardGrid from "../Components/ProposalsPage/CardGrid";
import RightDrawer from "Components/ProposalsPage/RightDrawer";
import styles from "../styles/ProposalsPage.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import { BytesLike, utils } from "ethers";

let opacity: number;
let display = "block";
let height = "300%";

export const ProposalsPage = ({
  userId,
  addLeaf,
  vote,
  open,
  setOpen,
}: any) => {
  const { LoggedIn } = useContext(LoginContext);

  const [Data, setData] = useState<any>();
  const [user, setUser] = useState<any>();
  const [refresh, setRefresh] = useState(false);

  React.useEffect(() => {
    if (LoggedIn) {
      addLeaf(1);
    }
    opacity = 0;
    setTimeout(() => {
      display = "none";
    }, 3000);
  }, [LoggedIn]);

  if (!Data) {
    load();
  }

  const _handleOpen = () => setOpen(!open);

  async function load() {
    const onChainData = await contract.getProposalsAllExpensive(1);
    getData(onChainData);
  }

  async function getData(onChainData: any) {
    const items = onChainData as unknown as [string[], string[] | number[]];
    if (items != undefined) {
      const renderData = [...Array(items[0].length)].map((_: any, i: any) => [
        utils.parseBytes32String(items[0][i] as BytesLike),
        items[0][i] as BytesLike,
        parseInt(items[1][i] as string),
        subsTitles[i],
        subsInfo[i],
      ]);
      setData(renderData);
    }
  }

  async function giveVote(choice: any) {
    const success = vote(choice, 1);
    if (success) setRefresh(!refresh);
  }

  const router = useRouter();

  useEffect(() => {
    if (router.asPath == "/proposalsPage") router.replace("/");
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          position: "relative",
          alignContent: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          className={styles.progress}
          style={{
            zIndex: 9,
            position: "absolute",
            fontSize: "6rem",
            textAlign: "center",
            textShadow: "0 0 10px grey",
            transition: `opacity 3s ease-out`,
            display: `${display}`,
            opacity: `${opacity}`,
            filter: "scale(2)",
          }}
        >
          <CircularProgress />
        </div>
      </div>

      <div
        className={styles.fadePage}
        style={{
          zIndex: 1,
          transition: `opacity 4s ease-in`,
          opacity: `${opacity}`,
          height: `${height}`,
          width: "100vw",
          display: `${display}`,
          overflow: "hidden",
        }}
      ></div>

      <CardGrid
        Data={Data}
        userId={userId}
        giveVote={giveVote}
        open={open}
        setOpen={setOpen}
        handleOpen={_handleOpen}
        setUser={setUser}
      />
      
      <RightDrawer
        handleOpen={_handleOpen}
        open={open}
        proposal={user}
        userId={userId}
        giveVote={giveVote}
      />
    </>
  );
};

export default ProposalsPage;
