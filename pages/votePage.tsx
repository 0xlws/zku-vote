import React from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { BytesLike, providers, Contract, utils, Wallet } from "ethers";
import { Strategy, ZkIdentity } from "@zk-kit/identity";
import { generateMerkleProof, Semaphore } from "@zk-kit/protocols";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { DiscordUser } from "utils/types";
import VoterDemo from "artifacts/contracts/VoterDemo.sol/VoterDemo.json";
import { formatId, parseIdArr } from "utils/convertId";
import GradeIcon from "@mui/icons-material/Grade";
import Layout from "components/Layout";
import { ParsedUrlQuery } from "querystring";
import { GetServerSidePropsContext, PreviewData } from "next";
import { parseUser } from "utils/parseUser";
import { poseidon } from "circomlibjs";
import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";

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

export default function VotePage(props: Props): any {
  const [Data, setData] = React.useState<any>();
  const [loaded, setLoaded] = React.useState(false);
  const [success, setSuccess] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [choice, setChoice] = React.useState([]);
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

  const [logs, setLogs] = React.useState(`Welcome ${userRole![0]}`);
  if (userRole == null) {
    return <div>Access denied</div>;
  }

  if (!Data) {
    load();
  }

  //__________________________________________________

  const handleClickOpen = (choice: any) => {
    const role: string = userRole![0];
    if (role !== Role[3][0] && role !== Role[4][0]) {
      setLogs("Only students can vote :)");
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
    getData(onChainData);
  }

  async function getData(onChainData: any) {
    const items = onChainData as unknown as [string[], string[] | number[]];
    if (items != undefined) {
      const renderData = [...Array(items[0].length)].map((_: any, i: any) => [
        utils.parseBytes32String(items[0][i] as BytesLike),
        items[0][i] as BytesLike,
        parseInt(items[1][i] as string),
      ]);
      setData(renderData);
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
                <Button onClick={handleClose}>Confirm</Button>
              </DialogActions>
            </Dialog>
          </div>
          <div className={styles.maindivdark}>
            <div className={styles.fade}></div>
            <Container
              maxWidth="sm"
              sx={{
                borderRadius: "5px",
                padding: "1%",
                paddingTop: "8%",
                paddingBottom: "8%",
                backgroundColor: "#08118f56",
                maxHeight: "75vh",
                overflow: "auto",
              }}
            >
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 0, sm: 1, md: 3 }}
              >
                {Data ? (
                  Data.map((uName: any, index: number) => (
                    <Grid
                      sx={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      key={uName[0]}
                      item
                      xs={25}
                      sm={4}
                      md={4}
                    >
                      <div className={styles.divnames} key={uName[1]}>
                        {uName[0]}
                      </div>
                      <div
                        onClick={() => handleClickOpen(uName)}
                        className={styles.button}
                      >
                        <GradeIcon
                          sx={{ display: "inline", color: "#FFD700" }}
                        ></GradeIcon>
                        <div className={styles.buttonTxt}>{uName[2]}</div>
                      </div>
                    </Grid>
                  ))
                ) : (
                  <div style={{ marginLeft: "20%" }}>
                    <p>Loading...</p>
                  </div>
                )}
              </Grid>
            </Container>
          </div>

          <div className={styles.logs}>{logs}</div>
          {/* <div onClick={() => emptyLeaves()} className={styles.button}>
          emptyLeaves
        </div> */}
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
