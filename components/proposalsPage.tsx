import * as React from "react";
import CardGrid from "./CardGrid";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoginButton } from "./LoginButton";
import { useState } from "react";
import styles from "../styles/proposalsPage.module.css";
import subsInfo from "../public/proposals/submissionsInfoFixed.json";
import CircularProgress from "@mui/material/CircularProgress";
import { Strategy, ZkIdentity } from "@zk-kit/identity";
import { generateMerkleProof, Semaphore } from "@zk-kit/protocols";
import { BytesLike, utils } from "ethers";
import subsTitles from "../public/proposals/submissionsTitlesFixed.json";
import { parseIdArr } from "../utils/convertId";
import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";
import { poseidon } from "circomlibjs";
import Alert from "@mui/material/Alert";
import { Role, contract } from "./Constants";
import { getLeaves } from "../components/Functions";

let opacity: number;
let display = "block";
let height = "300%";

export const ProposalsPage = ({
  props,
  userId,
  userRole,
  logs,
  setLogs,
}: any) => {
  let LoggedIn = Object.values(props).length !== 0;
  const [open, setOpen] = useState(false);

  const [Data, setData] = useState<any>();
  const [refresh, setRefresh] = useState(false);

  React.useEffect(() => {
    if (LoggedIn) {
      addLeaf();
    }
    opacity = 0;
    setTimeout(() => {
      display = "none";
    }, 3000);
  }, [LoggedIn]);

  if (!Data) {
    load();
  }

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

  async function addLeaf() {
    const identity = new ZkIdentity(Strategy.MESSAGE, userId);
    const identityCommitment = identity.genIdentityCommitment();
    let leavesBytes32 = await getLeaves();
    let identityCommitments: any = parseIdArr(leavesBytes32);
    const leavesBool = identityCommitments.map(
      (leaf: string) => identityCommitment.toString() === leaf
    );
    if (!leavesBool.includes(true)) {
      setLogs("Loading, please wait before voting...");

      leavesBytes32 = await getLeaves();
      identityCommitments = parseIdArr(leavesBytes32);
      const tree = new IncrementalMerkleTree(poseidon, 20, BigInt(0), 2);

      for (const identityCommitment of identityCommitments) {
        tree.insert(identityCommitment.toString());
      }
      await contract.setRoot(1, tree.root);
    }
    setLogs(`Welcome ${userRole![0]}`);
  }

  async function giveVote(proposal: any) {
    const role: string = userRole![0];
    if (role !== Role[0][0]) {
      setLogs("Only governors can vote :)");
      return null;
    }
    setLogs("Verifiying ZK-identity...");

    const id = new ZkIdentity(Strategy.MESSAGE, userId + proposal[1]);
    const commitment = id.genIdentityCommitment().toString();
    const identity = new ZkIdentity(Strategy.MESSAGE, userId);
    const identityCommitment = identity.genIdentityCommitment();
    const leavesBytes32 = await getLeaves();
    const identityCommitments = parseIdArr(leavesBytes32);

    try {
      const merkleProof = generateMerkleProof(
        20,
        BigInt(0),
        identityCommitments,
        identityCommitment.toString()
      );
      setLogs("Verified user. Creating your Semaphore proof...");
      const vote = proposal[1];
      const shortenedVote = proposal[1].slice(0, -50);
      const witness = Semaphore.genWitness(
        identity.getTrapdoor(),
        identity.getNullifier(),
        merkleProof,
        merkleProof.root,
        shortenedVote
      );
      const root = merkleProof.root.toString();
      const { proof, publicSignals } = await Semaphore.genProof(
        witness,
        "./semaphore.wasm",
        "./semaphore_final.zkey"
      );
      const solidityProof = Semaphore.packToSolidityProof(proof);
      setLogs("On-chain verification and voting in progress...");
      const response = await fetch("/api/proposalVote", {
        method: "POST",
        body: JSON.stringify({
          commitment,
          vote,
          shortenedVote,
          root,
          nullifierHash: publicSignals.nullifierHash,
          solidityProof: solidityProof,
        }),
      });

      if (response.status === 500) {
        // const errorMessage = await response.text();
        const errorMessage = await response.json();
        const err = JSON.parse(errorMessage.error.error.body);
        setLogs(err.error.message);
        if (errorMessage.length > 75) {
          setLogs("Error: see console...");
          console.log(errorMessage);
        }
      } else {
        setLogs("Your anonymous vote is onchain :)");
        setRefresh(!refresh);
      }
    } catch (e: any) {
      setLogs(e.toString());
    }
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

      <LoginButton props={props} />

      <CardGrid
        props={props}
        Data={Data}
        userId={userId}
        giveVote={giveVote}
        open={open}
        setOpen={setOpen}
      />

      <Alert
        sx={{
          // display:"flex",
          opacity: open ? 0.5 : 0.75,
          pointerEvents: "none",
          zIndex: "1204",
          position: "fixed",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          bottom: "10px",
          width: "40%",
          fontWeight: "bold",
        }}
        variant="filled"
        severity="info"
      >
        {logs}
      </Alert>
    </>
  );
};

export default ProposalsPage;
