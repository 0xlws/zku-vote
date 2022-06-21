import * as React from "react";
import ControlledAccordion from "./ControlledAccordion";
import { useEffect } from "react";
import { LoginButton } from "./LoginButton";
import { useRouter } from "next/router";

import { BytesLike, utils } from "ethers";
import { Strategy, ZkIdentity } from "@zk-kit/identity";
import { generateMerkleProof, Semaphore } from "@zk-kit/protocols";
import { parseIdArr } from "../utils/convertId";
import { poseidon } from "circomlibjs";
import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";

import Alert from "@mui/material/Alert";
import { contract } from "./Constants";
import { getLeaves } from "../components/Functions";

const VotePage = ({ props, userId, userRole, logs, setLogs }: any) => {
  const router = useRouter();
  let LoggedIn = Object.values(props).length !== 0;
  const [candidates, setCandidates] = React.useState<any>();
  const [refresh, setRefresh] = React.useState(false);

  React.useEffect(() => {
    if (LoggedIn) {
      addLeaf();
    }
  }, [LoggedIn]);

  if (!candidates) {
    load();
  }

  async function load() {
    const onChainData = await contract.getRatingAllExpensive(0);
    getCandidates(onChainData);
  }

  async function getCandidates(onChainData: any) {
    const items = onChainData as unknown as [string[], string[] | number[]];
    if (items != undefined) {
      const renderCandidates = [...Array(items[0].length)].map(
        (_: any, i: any) => [
          utils.parseBytes32String(items[0][i] as BytesLike),
          items[0][i] as BytesLike,
          parseInt(items[1][i] as string),
        ]
      );
      setCandidates(renderCandidates);
    }
  }

  async function addLeaf() {
    const identity = new ZkIdentity(Strategy.MESSAGE, userId);
    const identityCommitment = identity.genIdentityCommitment();
    let leavesBytes32 = await getLeaves();
    let identityCommitments = parseIdArr(leavesBytes32);
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
      await contract.setRoot(0, tree.root);
    }
    setLogs(`Welcome ${userRole![0]}`);
  }

  async function giveVote(choice: any) {
    setLogs("Verifiying ZK-identity...");

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
      const vote = choice[1];
      const shortenedVote = choice[1].slice(0, -50);
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

      const response = await fetch("/api/vote", {
        method: "POST",
        body: JSON.stringify({
          vote,
          shortenedVote,
          root,
          nullifierHash: publicSignals.nullifierHash,
          solidityProof: solidityProof,
        }),
      });

      if (response.status === 500) {
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

  useEffect(() => {
    if (router.asPath == "/votePage") router.replace("/");
  });

  return (
    <>
      <LoginButton props={props} />
      <ControlledAccordion
        props={props}
        userId={userId}
        giveVote={giveVote}
        candidates={candidates}
      />
      <Alert
        sx={{
          //  opacity: open ? 0.5 : 0.75,
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

export default VotePage;
