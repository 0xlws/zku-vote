import type { NextApiRequest, NextApiResponse } from "next";
import { Contract, providers, utils, Wallet } from "ethers";
import VoterDemo from "artifacts/contracts/VoterDemo.sol/VoterDemo.json";

const cfg = {
  rinkebyUrl: process.env.NEXT_PUBLIC_RINKEBY_URL,
  walletAddress: process.env.NEXT_PUBLIC_WALLET_ADDRESS,
  pKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
  hmnyMainnet: process.env.NEXT_PUBLIC_MAINNET_ADDRESS
};

// This API can represent a backend.
// The contract owner is the only account that can call the `vote` function,
// However they will not be aware of the identity of the users generating the proofs.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    commitment,
    vote,
    shortenedVote,
    root,
    nullifierHash,
    solidityProof,
  } = JSON.parse(req.body);

  // rinkeby
  // const contract = new Contract(
  //   "0xB16b883eE207CeBc98440c5A002bf7Cb4C71E42b", // rinkeby
  //   VoterDemo.abi
  // );
  // const provider = new providers.JsonRpcProvider(`${cfg.rinkebyUrl}`);
  // const signer = new Wallet(`${cfg.pKey}`, provider);
  // const contractOwner = contract.connect(signer);
  
  // mainnet
  const contract = new Contract(
    `${cfg.hmnyMainnet}`,
    VoterDemo.abi
  );
  const provider = new providers.JsonRpcProvider(`${cfg.rinkebyUrl}`);
  const signer = new Wallet(`${cfg.pKey}`, provider);
  const contractOwner = contract.connect(signer);

  // localhost
  // const contract = new Contract(
  //   "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // localhost
  //   VoterDemo.abi
  // );
  // const provider = new providers.JsonRpcProvider("http://localhost:8545");
  // const contractOwner = contract.connect(provider.getSigner());

  try {
    await contractOwner.vote(
      1,
      BigInt(commitment),
      vote,
      utils.formatBytes32String(shortenedVote),
      BigInt(root),
      nullifierHash,
      solidityProof
    );

    res.status(200).end();
  } catch (error: any) {
    const { message } = JSON.parse(error.body).error;
    const reason = message.substring(
      message.indexOf("'") + 1,
      message.lastIndexOf("'")
    );

    res.status(500).send(reason || "Unknown error!");
  }
}
