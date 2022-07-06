import { providers, Contract, Wallet } from "ethers";
import VoterDemo from "../artifacts/contracts/VoterDemo.sol/VoterDemo.json";

/**
 * userRole
 * 0 : governor
 * 1 : mentor
 * 2 : ZKUGraduate
 * 3 : c2student
 * 4 : c3student
 */

export const Role = [
  ["governor", "952253953062621194"],
  ["mentor", "942319285664100413"],
  ["ZKUGraduate", "965988682165268480"],
  ["c3student", "969554058245447720"],
  ["c2student", "942604727613554799"],
];

export const cfg = {
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
// export const contract = VoterContract.connect(signer);

// mainnet
const VoterContract = new Contract(`${cfg.hmnyMainnet}`, VoterDemo.abi);
const provider = new providers.JsonRpcProvider(`${cfg.rinkebyUrl}`);
const signer = new Wallet(`${cfg.pKey}`, provider);
export const contract = VoterContract.connect(signer);

// localhost
// const provider = new providers.JsonRpcProvider();
// const signer = provider.getSigner();
// export const contract = new Contract(
//   "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
//   VoterDemo.abi,
//   signer
// );

// export const NameList = [
//   "Virginia Howard",
//   "Liz Faulkner",
//   "Gil Holland",
//   "Arron Berry",
//   "Ollie Mosley",
//   "Monica Chapman",
//   "Silvia Campos",
//   "Marisa Mckenzie",
//   "Glenda Davenport",
//   "Jamey Crane",
//   "Vince Dennis",
//   "Peggy Pham",
//   "Marilyn Henson",
//   "Tricia Horton",
//   "Mercedes Villegas",
//   "Carmen Norton",
//   "Jed Castaneda",
//   "Sol Bray",
//   "Tom Novak",
//   "Percy Mcdowell",
//   "Esmeralda Ellison",
//   "Darcy Villa",
//   "Janet Archer",
//   "Jacquelyn Rosales",
//   "Adriana Jacobson",
//   "Derick Taylor",
//   "Walter Rowe",
//   "Xavier Gaines",
//   "Vivian Allen",
//   "Mauricio Graves",
//   "Alton Gray",
//   "Gretchen Davila",
//   "Emma Mcintosh",
//   "Patsy Sloan",
//   "Wallace Donovan",
//   "Sherry Blake",
//   "Erik Glover",
//   "Noreen Gutierrez",
//   "Kenya Malone",
//   "Bettie Lewis",
//   "Alan Herring",
//   "Royal Cline",
//   "Matilda Parsons",
//   "Christi Carter",
//   "Garry Maynard",
//   "Roberto Wilcox",
//   "Nona Carey",
//   "Sammy Rubio",
//   "Caroline Nichols",
//   "Felicia Gardner",
// ];
