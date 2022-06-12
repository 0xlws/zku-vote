import * as React from "react";
import { useState } from "react";
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
import GitHubIcon from "@mui/icons-material/GitHub";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import Rating from "@mui/material/Rating";
import Tooltip from "@mui/material/Tooltip";
import SpeedDial from "@mui/material/SpeedDial";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styles from "../styles/proposalsPage.module.css";
import subsInfo from "../public/proposals/submissionsInfoFixed.json";
import RightDrawer from "../components/RightDrawer";
import CircularProgress from "@mui/material/CircularProgress";
import { Strategy, ZkIdentity } from "@zk-kit/identity";
import { generateMerkleProof, Semaphore } from "@zk-kit/protocols";
import { BytesLike, providers, Contract, utils, Wallet } from "ethers";
import VoterDemo from "../artifacts/contracts/VoterDemo.sol/VoterDemo.json";
import subsTitles from "../public/proposals/submissionsTitlesFixed.json";
import { DiscordUser } from "../utils/types";
import { formatId, parseIdArr } from "../utils/convertId";
import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";
import { poseidon } from "circomlibjs";
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

const actions = [
  { icon: <ThumbUpIcon />, name: "Approve" },
  { icon: <OpenInNewIcon />, name: "Website" },
  { icon: <OndemandVideoIcon />, name: "Demo video" },
  { icon: <GitHubIcon />, name: "Source code" },
];

const LightDivider = styled(Divider)({
  opacity: 0.3,
});

const HiddenButton = styled(Button)({
  position: "absolute",
  marginLeft: "auto",
  marginRight: "auto",
  left: 0,
  right: 0,
  top: "-120px",
  width: "50%",
});

let Data: any[];
let opacity: number;
let display = "block";
let height = "300%";
let user = {};

export default function CardGrid({ userId, roles }: any) {
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const handleClick = (proposal: any) => {
    user = proposal;
    handleOpen();
  };

  const [Data, setData] = useState<any>();
  const [success, setSuccess] = useState("");
  const [open2, setOpen2] = useState(false);
  const [proposal, setProposal] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [userData, setUserData] = useState<any>("");
  const [refresh, setRefresh] = useState(false);

  //__________________________________________________

  React.useEffect(() => {
    if (userId !== "0") {
      addLeaf();
    }
    opacity = 0;
    setTimeout(() => {
      display = "none";
    }, 3000);
  }, []);

  React.useEffect(() => {
    load();
  }, [refresh]);

  //__________________________________________________

  // console.log({Data})
  if (!Data) {
    load();
  }

  const Role = [
    ["governor", "952253953062621194"],
    ["mentor", "942319285664100413"],
    ["ZKUGraduate", "965988682165268480"],
    ["c3student", "969554058245447720"],
    ["c2student", "942604727613554799"],
  ];

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

  // console.log({ userRole });

  const [logs, setLogs] = useState(`Welcome ${userRole![0]}`);

  console.log({ logs });

  if (userRole == null) {
    return <div>Access denied</div>;
  }

  //__________________________________________________

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClickOpen = (proposal: any) => {
    const role: string = userRole![0];
    if (role !== Role[0][0]) {
      setLogs("Only governors can vote :)");
      return null;
    }
    setProposal(proposal);
    setOpen(true);
  };

  const handleClickOpen2 = (proposal: any) => {
    // proposal[4]
    // .info
    // .source_code
    // .website
    // .demo
    // .discord
    const text = (
      <div>
        <Typography paragraph>
          Source code: {proposal[4].source_code}
        </Typography>
        <Typography paragraph>
          Website: <a>href={proposal[4].website}</a>
        </Typography>
        <Typography paragraph>
          Demo video:{" "}
          {proposal[4].demo == "" ? "Not available" : proposal[4].demo}
        </Typography>
      </div>
    );

    setUserData(text);
    setOpen2(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseAndVote = () => {
    setOpen(false);
    giveVote(proposal);
  };

  const handleClickWebsite = (proposal: any) => {
    return window.open(proposal[4].website);
  };

  const handleClickGithub = (proposal: any) => {
    return window.open(proposal[4].source_code);
  };

  //__________________________________________________

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
      setLoaded(true);
    }
  }
  async function getLeaves() {
    const leaves = await contract.getLeaves();
    return leaves;
  }
  async function addLeaf() {
    // console.log({ userId });
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
      const strIdentityCommitment = identityCommitment.toString();
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
        setSuccess(strIdentityCommitment);
        setLogs("Your anonymous vote is onchain :)");
        setRefresh(!refresh);
      }
    } catch (e: any) {
      setLogs(e.toString());
    }
  }

  // useEffect(() => {
  //   const getData = async () => {
  //     opacity = 1;
  //     let z = await subsInfo.map(async (value, index) => {
  //       let url = `/images/img_${index}.png`;
  //       try {
  //         let res = await fetch(url);
  //         if (res.ok) {
  //           return { ...value, img: url };
  //         } else {
  //           return { ...value, img: "/zkulogo.png" };
  //         }
  //       } catch (error) {}
  //     });
  //     Data = await Promise.all(z);
  //     setLoaded(true);
  //   };

  //   getData();
  //   opacity = 0;
  //   setTimeout(() => {
  //     display = "none";
  //   }, 3000);
  // }, []);

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
          className={styles.xxx}
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
        style={{
          zIndex: 1,
          transition: `opacity 4s ease-in`,
          opacity: `${opacity}`,
          height: `${height}`,
          width: "100vw",
          display: `${display}`,
          overflow: "hidden",
        }}
        className={styles.fadePage}
      ></div>
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
                              // onClose={handleClose}
                              // onOpen={handleOpen}
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
    </>
  );
}
