// import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";
// import { poseidon } from "circomlibjs";
import { Contract } from "ethers";
import { task, types } from "hardhat/config";
// import identityCommitments from "../public/identityCommitments.json";
import _proposals from "../public/proposals/submissionsTitlesFixed.json"

task("deploy", "Deploy a VoterDemo contract")
  .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
  .setAction(async ({ logs }, { ethers }): Promise<Contract> => {
    const VerifierContract = await ethers.getContractFactory("Verifier");
    const verifier = await VerifierContract.deploy();

    await verifier.deployed();

    logs &&
      console.log(
        `Verifier contract has been deployed to: ${verifier.address}`
      );

    const VoterDemoContract = await ethers.getContractFactory("VoterDemo");

    // const tree = new IncrementalMerkleTree(poseidon, 20, BigInt(0), 2);

    // for (const identityCommitment of identityCommitments) {
    //   tree.insert(identityCommitment);
    // }

    const _users = [
      "0xlws",
      "Tomo",
      "Margulus",
      "JanR",
      "Kousik",
      "Hakwan Lau",
      "CathieSo",
      "Vivian",
      "Bianca",
      "Naveen",
      "Malachi",
      "Alice",
      "Jolee",
      "Abigail",
      "Jack",
      "Georgina",
      "Carlen",
      "Mae",
      "Kalan",
      "Jasper",
      "Raven",
      "Aryn",
      "Vanessa",
      "Levi",
      "Rory",
      "Julian",
      "Harrison",
      "Gavin",
      "Zachary",
      "Kae",
      "Kingston",
      "Rose",
    ];
    // const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vestibulum morbi blandit cursus risus at. Pretium fusce id velit ut tortor pretium viverra suspendisse potenti. Sed euismod nisi porta lorem mollis aliquam. Viverra justo nec ultrices dui. Gravida dictum fusce ut placerat. Enim tortor at auctor urna nunc id cursus metus. Donec pretium vulputate sapien nec. Egestas pretium aenean pharetra magna ac. Lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare. Sagittis id consectetur purus ut. Urna porttitor rhoncus dolor purus non enim praesent. Felis eget velit aliquet sagittis id consectetur purus ut faucibus. Turpis massa sed elementum tempus. At ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Dapibus ultrices in iaculis nunc sed. Sed blandit libero volutpat sed cras ornare. Enim sed faucibus turpis in. Eget aliquet nibh praesent tristique. Adipiscing elit duis tristique sollicitudin nibh sit amet commodo.";
    // const _users = text.split(' ');
    const users = _users.map((user) => ethers.utils.formatBytes32String(user));

    const proposals = _proposals.map((user) => ethers.utils.formatBytes32String(user));

    const voterDemo = await VoterDemoContract.deploy(
      users,
      proposals,
      // tree.root,
      verifier.address
    );

    await voterDemo.deployed();

    logs &&
      console.log(
        `VoterDemo contract has been deployed to: ${voterDemo.address}`
      );

    return voterDemo;
  });
