import { Strategy, ZkIdentity } from "@zk-kit/identity";
import { generateMerkleProof, Semaphore } from "@zk-kit/protocols";
import { BytesLike, providers, Contract, utils, Wallet } from "ethers";
import VoterDemo from "artifacts/contracts/VoterDemo.sol/VoterDemo.json";
import subsTitles from "../public/proposals/submissionsTitlesFixed.json";
import subsInfo from "../public/proposals/submissionsInfoFixed.json";
import React from "react";
import styles from "../styles/proposalsPage.module.css";
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DiscordUser } from "utils/types";
import { GetServerSidePropsContext, PreviewData } from "next";
import { parseUser } from "utils/parseUser";
import { ParsedUrlQuery } from "querystring";
import { formatId, parseIdArr } from "utils/convertId";
import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";
import { poseidon } from "circomlibjs";
import Layout from "components/Layout";
import Link from "next/link";

const cfg = {
  rinkebyUrl: process.env.NEXT_PUBLIC_RINKEBY_URL,
  walletAddress: process.env.NEXT_PUBLIC_WALLET_ADDRESS,
  pKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
  hmnyMainnet: process.env.NEXT_PUBLIC_MAINNET_ADDRESS
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
const VoterContract = new Contract(
  `${cfg.hmnyMainnet}`,
  VoterDemo.abi
);
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

export default function Home(props: Props) {
  const [loaded, setLoaded] = React.useState(false);
  const [Data, setData] = React.useState<any>();
  const [success, setSuccess] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [choice, setChoice] = React.useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [userData, setUserData] = React.useState<any>("");
  const [refresh, setRefresh] = React.useState(false);

  //__________________________________________________

  React.useEffect(() => {
    addLeaf();
  }, []);

  React.useEffect(() => {
    load();
  }, [refresh]);

  //__________________________________________________

  const userId = props.user.user.id;
  const roles = props.user.roles;

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

  const [logs, setLogs] = React.useState(`Welcome ${userRole![0]}`);

  if (userRole == null) {
    return <div>Access denied</div>;
  }

  //__________________________________________________

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClickOpen = (choice: any) => {
    const role: string = userRole![0];
    if (role !== Role[0][0]) {
      setLogs("Only governors can vote :)");
      return null;
    }
    setChoice(choice);
    setOpen(true);
  };

  const handleClickOpen2 = (choice: any) => {
    // choice[4]
    // .info
    // .source_code
    // .website
    // .demo
    // .discord
    const text = (
      <div>
        <Typography paragraph>Source code: {choice[4].source_code}</Typography>
        <Typography paragraph>
          Website: <a>href={choice[4].website}</a>
        </Typography>
        <Typography paragraph>
          Demo video: {choice[4].demo == "" ? "Not available" : choice[4].demo}
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
    giveVote(choice);
  };

  const handleClickWebsite = (choice: any) => {
    return window.open(choice[4].website);
  };

  const handleClickGithub = (choice: any) => {
    return window.open(choice[4].source_code);
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
    const identity = new ZkIdentity(Strategy.MESSAGE, userId);
    const identityCommitment = identity.genIdentityCommitment();
    let leavesBytes32 = await getLeaves();
    let identityCommitments = parseIdArr(leavesBytes32);
    const leavesBool = identityCommitments.map(
      (leaf: string) => identityCommitment.toString() === leaf
    );
    if (!leavesBool.includes(true)) {
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
  }

  async function giveVote(choice: any) {
    const role: string = userRole![0];
    if (role !== Role[4][0]) {
      setLogs("Only governors can vote :)");
      return null;
    }
    setLogs("Verifiying ZK-identity...");

    const id = new ZkIdentity(Strategy.MESSAGE, userId + choice[1]);
    const commitment = id.genIdentityCommitment().toString();
    const identity = new ZkIdentity(Strategy.MESSAGE, userId);
    const identityCommitment = identity.genIdentityCommitment();
    const leavesBytes32 = await getLeaves();
    const identityCommitments = parseIdArr(leavesBytes32);

    setLogs("Registered user");

    try {
      const merkleProof = generateMerkleProof(
        20,
        BigInt(0),
        identityCommitments,
        identityCommitment.toString()
      );
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
      setLogs("Verified user. Creating your Semaphore proof...");
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
        const errorMessage = await response.text();
        setLogs(errorMessage);
      } else {
        setSuccess(strIdentityCommitment);
        setLogs("Your anonymous vote is onchain :)");
        setRefresh(!refresh);
      }
    } catch (e: any) {
      setLogs(e.toString());
    }
  }

  //__________________________________________________

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.logoutButton}>
          <Link href="/api/logout">Logout</Link>
        </div>
        <main className={styles.main}>
          <div className={styles.textfield}>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Confirmation</DialogTitle>
              <DialogContent>
                <DialogContentText>Vote for {choice[0]}?</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleCloseAndVote}>Confirm</Button>
              </DialogActions>
            </Dialog>
          </div>
          <div className={styles.maindivdark}>
            <div className={styles.fade}></div>
            <Container
              key={600}
              maxWidth="xl"
              sx={{
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "5px",
                padding: "1%",
                paddingTop: "2%",
                paddingBottom: "8%",
                marginBottom: "100%",
                // backgroundColor: "#08118f56",
                maxHeight: "80vh",
                maxWidth: "100vw",
                overflow: "auto",
              }}
            >
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 2, sm: 3, md: 25, lg: 5 }}
              >
                {Data ? (
                  Data.map((uName: any, index: number) => (
                    <Grid key={index + 999} item xs={25} sm={10} md={5} lg={4}>
                      <Card
                        key={index + 10}
                        sx={{
                          maxWidth: 345,
                          minWidth: 285,
                          borderRadius: "5px",
                          bgcolor: "rgb(250, 245, 240)",
                          boxShadow: "0 0 50px black",
                        }}
                      >
                        <CardHeader
                          sx={{
                            bgcolor: "#0057B8",
                            color: "white",
                            borderBottom: "1px solid black",
                            borderRadius: "5px 5px 0 0",
                          }}
                          avatar={
                            <Avatar
                              sx={{
                                zIndex: "0",
                                bgcolor: "#FFD700",
                                fontSize: "1.5rem",
                                // color:"grey"
                              }}
                              aria-label="name"
                            >
                              {uName[4].discord[0]}
                            </Avatar>
                          }
                          action={
                            <IconButton aria-label="settings">
                              <MoreVertIcon />
                            </IconButton>
                          }
                          title={uName[4].discord}
                        />
                        <CardMedia
                          sx={{ borderBottom: "1px solid" }}
                          key={index + 998}
                          component="img"
                          alt="Please upload a preview image"
                          height="140"
                          image={`images/img_${index}.png`}
                        />
                        <CardContent
                          key={index + 100}
                          sx={{ backgroundColor: "grey" }}
                        >
                          <Typography
                            sx={{ backgroundColor: "grey" }}
                            key={index + 200}
                            paragraph
                            variant="h5"
                            component="div"
                          >
                            {uName[0]}
                          </Typography>
                          <Typography
                            key={index + 300}
                            variant="body2"
                            color="text.secondary"
                          >
                            {uName[4].info}
                            <span className={styles.span}>
                              <Rating
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: "50px",
                                }}
                                key={index + 400}
                                name="read-only"
                                value={uName[2]}
                                size="large"
                                readOnly
                              />
                            </span>
                          </Typography>
                        </CardContent>
                        <CardActions key={index + 700}>
                          <Button
                            sx={{
                              color: "#0057B8",
                              fontSize: "1rem",
                              fontWeight: "bold",
                              boxShadow: "0 0 10px #FFD700",
                              left: "5px",
                              bgcolor: "#FFD700",
                            }}
                            key={index + 8040}
                            onClick={() => handleClickOpen(uName)}
                            size="small"
                          >
                            Vote
                          </Button>
                          <span className={styles.span}>
                            <Button
                              sx={{ border: "1px solid", left: "5%" }}
                              key={index + 8020}
                              onClick={() => handleClickWebsite(uName)}
                              size="small"
                            >
                              Site
                            </Button>

                            <Button
                              sx={{ border: "1px solid", left: "6%" }}
                              key={index + 8100}
                              onClick={() => handleClickGithub(uName)}
                              size="small"
                            >
                              Github
                            </Button>
                            <Button
                              sx={{ border: "1px solid", left: "7%" }}
                              key={index + 900}
                              onClick={() => handleClickOpen2(uName)}
                              size="small"
                            >
                              More
                            </Button>
                          </span>
                        </CardActions>
                      </Card>

                      <br></br>
                    </Grid>
                  ))
                ) : (
                  <div className={styles.buttonLoading}>
                    <p>Loading...</p>
                    <p></p>
                  </div>
                )}
              </Grid>
            </Container>
          </div>

          <div className={styles.logs}>{logs}</div>
        </main>
      </div>
    </Layout>
  );
}

export const getServerSideProps: any = async function (
  ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) {
  const user = parseUser(ctx);

  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: { user } };
};
