import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import SortedList from "./SortedList";
import CheckboxList from "./CheckboxList";

import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";

//

import { BytesLike, providers, Contract, utils, Wallet } from "ethers";
import { Strategy, ZkIdentity } from "@zk-kit/identity";
import { generateMerkleProof, Semaphore } from "@zk-kit/protocols";
import { DiscordUser } from "../utils/types";
import VoterDemo from "../artifacts/contracts/VoterDemo.sol/VoterDemo.json";
import { formatId, parseIdArr } from "../utils/convertId";
import { poseidon } from "circomlibjs";
import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";

import Alert from "@mui/material/Alert";

const cfg = {
  rinkebyUrl: process.env.NEXT_PUBLIC_RINKEBY_URL,
  walletAddress: process.env.NEXT_PUBLIC_WALLET_ADDRESS,
  pKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
  hmnyMainnet: process.env.NEXT_PUBLIC_MAINNET_ADDRESS,
};

// rinkeby
// const VoterContract = new Contract(
//   "0xB16b883eE207CeBc98440c5A002bf7Cb4C71E42b", // rinkeby
//   VoterDemo.abi
// );
// const provider = new providers.JsonRpcProvider(`${cfg.rinkebyUrl}`);
// const signer = new Wallet(`${cfg.pKey}`, provider);
// const contract = VoterContract.connect(signer);

// mainnet
const VoterContract = new Contract(`${cfg.hmnyMainnet}`, VoterDemo.abi);
const provider = new providers.JsonRpcProvider(`${cfg.rinkebyUrl}`);
const signer = new Wallet(`${cfg.pKey}`, provider);
const contract = VoterContract.connect(signer);

// localhost
// const provider = new providers.JsonRpcProvider();
// const signer = provider.getSigner();
// const contract = new Contract(
//   "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
//   VoterDemo.abi,
//   signer
// );

interface Props {
  user: DiscordUser;
}

export default function ControlledAccordions({ userId, roles }: any) {
  const [expanded, setExpanded] = useState<string | false>("panel1");
  const { data, setData } = useContext(UserContext);
  const [arr, setArr] = useState<(string | boolean)[]>([
    "Choose a campaign",
    false,
  ]);
  const [candidates, setCandidates] = React.useState<any>();
  const [loaded, setLoaded] = React.useState(false);
  const [success, setSuccess] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [choice, setChoice] = React.useState([]);
  const [refresh, setRefresh] = React.useState(false);

  //__________________________________________________

  React.useEffect(() => {
    if (userId !== "0") {
      addLeaf();
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [refresh]);

  //__________________________________________________

  /**
   * userRole
   * 0 : governor
   * 1 : mentor
   * 2 : ZKUGraduate
   * 3 : c2student
   * 4 : c3student
   */

  const Role = [
    ["governor", "952253953062621194"],
    ["mentor", "942319285664100413"],
    ["ZKUGraduate", "965988682165268480"],
    ["c3student", "969554058245447720"],
    ["c2student", "942604727613554799"],
  ];

  let userRole: any[] | null = null;
  loop1: for (let i = 0; i < Role.length; i++) {
    loop2: for (let n = 0; n < roles.length; n++) {
      if (Role[i][1] === roles[n]) {
        userRole = Role[i];
        // setUrole(userRole![0]);
        break loop1;
      }
    }
  }

  if (userRole == null) {
    userRole = [""];
  }

  const [logs, setLogs] = React.useState(`Welcome ${userRole![0]}`);
  if (userRole == null) {
    return <div>Access denied</div>;
  }

  console.log({ logs });

  if (!candidates) {
    load();
  }

  //__________________________________________________

  const handleClickOpen = (choice: any) => {
    const role: string = userRole![0];
    if (
      role !== Role[0][0] &&
      role !== Role[1][0] &&
      role !== Role[2][0] &&
      role !== Role[3][0] &&
      role !== Role[4][0]
    ) {
      setLogs("Only ZKU members can vote :)");
      return null;
    }
    setChoice(choice);
    setValue(choice[0]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (value != "") {
      giveVote(choice);
    }
  };

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
      setLoaded(true);
    }
  }

  async function emptyLeaves() {
    await contract.emptyLeaves();
  }

  async function getLeaves() {
    const leaves = await contract.getLeaves();
    return leaves;
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

      const identityArr = formatId(identityCommitment);

      let tx = await contract.addLeaf(identityArr);
      let receipt = await tx.wait();
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
      const strIdentityCommitment = identityCommitment.toString();
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
        // const errorMessage = await response.text();
        const errorMessage = await response.json();
        const err = JSON.parse(errorMessage.error.error.body);
        setLogs(err.error.message);
        if (errorMessage.length > 75) {
          setLogs("Error: see console...");
          console.log(errorMessage);
        }
      } else {
        setSuccess(strIdentityCommitment);
        setLogs("Your anonymous vote is onchain :)");
        setRefresh(!refresh);
      }
    } catch (e: any) {
      setLogs(e.toString());
    }
  }

  //

  if (arr[1]) {
    setExpanded("panel2");
    const newArr = [...arr];
    newArr[1] = false;
    setArr(newArr);
  }

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  // console.log({ candidates });
  return (
    <div>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>Step 1.</Typography>
          <div>
            <Typography sx={{ color: "text.secondary" }}>{arr[0]}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <CheckboxList setArrFunc={setArr} />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>Step 2.</Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Choose a candidate
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SortedList
            userId={userId}
            arr={arr}
            candidates={candidates}
            giveVote={giveVote}
          />
        </AccordionDetails>
      </Accordion>
      {/* <ConsecutiveSnackbars logs ={logs} /> */}
      <Alert
        sx={{
          // display:"flex",
          zIndex: "1204",
          position: "fixed",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          bottom: "10px",
          width: "40%",
        }}
        variant="filled"
        severity="info"
      >
        {logs}
      </Alert>
    </div>
  );
}
