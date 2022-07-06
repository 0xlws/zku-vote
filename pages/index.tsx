import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { GetServerSidePropsContext, PreviewData } from "next";
import { Strategy, ZkIdentity } from "@zk-kit/identity";
import { generateMerkleProof, Semaphore } from "@zk-kit/protocols";
import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";
import { poseidon } from "circomlibjs";
import { ParsedUrlQuery } from "querystring";
import { parseUser } from "../utils/parseUser";
import { parseIdArr } from "../utils/convertId";
import VotePage from "../PageComponents/VotePage";
import ProposalsPage from "../PageComponents/ProposalsPage";
import { Role } from "../Constants/Constants";
import { contract } from "../Constants/Constants";
import { loggedIn } from "Components/Functions";
import { getLeaves } from "../Components/Functions";
import { PageContext } from "../Contexts/PageContext";
import { LoginContext } from "Contexts/LoginContext";
import Alert from "@mui/material/Alert";

export default function Home(props: any) {
  const { page, setPage } = useContext(PageContext);
  const [userState, setUserState] = useState<any>(props);
  const { LoggedIn, setLoggedIn } = useContext(LoginContext);
  const [_open, _setOpen] = useState(false);

  let userId = "0";
  let roles = ["1"];

  if (!LoggedIn && loggedIn(userState)) {
    setLoggedIn(true);
  }

  if (loggedIn(userState)) {
    userId = props.discordUser.user.id;
    roles = props.discordUser.roles;
  }

  let userRole: string[] | null = null;
  loop1: for (let i = 0; i < Role.length; i++) {
    loop2: for (let n = 0; n < roles.length; n++) {
      if (Role[i][1] === roles[n]) {
        userRole = Role[i];

        break loop1;
      }
    }
  }

  if (userRole == null) {
    userRole = [""];
  }

  const [_logs, _setLogs] = useState(`Welcome ${userRole![0]}`);

  useEffect(() => {
    if (localStorage.getItem("page") == null) {
      setPage("1");
    }

    if (localStorage.getItem("page") !== null) {
      if (page !== localStorage.getItem("page")) {
        setPage(localStorage.getItem("page")!);
      }
    }

    if (localStorage.getItem("user") !== null) {
      if (userState !== localStorage.getItem("user")) {
        setUserState(localStorage.getItem("user"));
      }
    }
  }, []);

  async function _addLeaf(_page: number) {
    const identity = new ZkIdentity(Strategy.MESSAGE, userId);
    const identityCommitment = identity.genIdentityCommitment();
    let leavesBytes32 = await getLeaves();
    let identityCommitments: any = parseIdArr(leavesBytes32);
    const leavesBool = identityCommitments.map(
      (leaf: string) => identityCommitment.toString() === leaf
    );
    if (!leavesBool.includes(true)) {
      _setLogs("Loading, please wait before voting...");
      leavesBytes32 = await getLeaves();
      identityCommitments = parseIdArr(leavesBytes32);
      const tree = new IncrementalMerkleTree(poseidon, 20, BigInt(0), 2);
      for (const identityCommitment of identityCommitments) {
        tree.insert(identityCommitment.toString());
      }
      await contract.setRoot(_page, tree.root);
    }
    _setLogs(`Welcome ${userRole![0]}`);
  }

  async function _vote(choice: any, page: number) {
    const role: string = userRole![0];

    if (page == 0 && !role) {
      _setLogs("Only ZKU members can vote :)");
      return null;
    }

    if (page == 1 && role !== Role[0][0]) {
      _setLogs("Only governors can vote :)");
      return null;
    }

    _setLogs("Verifiying ZK-identity...");

    const id = new ZkIdentity(Strategy.MESSAGE, userId + choice[1]);
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
      _setLogs("Verified user. Creating your Semaphore proof...");
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
      _setLogs("On-chain verification and voting in progress...");
      const reqBody =
        page == 0
          ? {
              vote,
              shortenedVote,
              root,
              nullifierHash: publicSignals.nullifierHash,
              solidityProof: solidityProof,
            }
          : page == 1
          ? {
              commitment,
              vote,
              shortenedVote,
              root,
              nullifierHash: publicSignals.nullifierHash,
              solidityProof: solidityProof,
            }
          : {};
      const response = await fetch(
        page == 0 ? "/api/vote" : page == 1 ? "/api/proposalVote" : "",
        {
          method: "POST",
          body: JSON.stringify(reqBody),
        }
      );

      if (response.status === 500) {
        const errorMessage = await response.json();
        const err = JSON.parse(errorMessage.error.error.body);
        _setLogs(err.error.message);
        if (errorMessage.length > 75) {
          _setLogs("Error: see console...");
          console.log(errorMessage);
          return false;
        }
      } else {
        _setLogs("Your anonymous vote is onchain :)");
        return true;
      }
    } catch (e: any) {
      _setLogs(e.toString());
      return false;
    }
  }

  return (
    <>
      {page == "0" && (
        <VotePage userId={userId} addLeaf={_addLeaf} vote={_vote} />
      )}
      {page == "1" && (
        <ProposalsPage
          userId={userId}
          addLeaf={_addLeaf}
          vote={_vote}
          open={_open}
          setOpen={_setOpen}
        />
      )}
      <Alert
        sx={{
          opacity: _open ? 0.5 : 0.75,
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
        {_logs}
      </Alert>
    </>
  );
}

export const getServerSideProps: any = async function (
  ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) {
  const user = parseUser(ctx);

  if (!user) return { props: {} };

  return { props: { discordUser: user } };
};
