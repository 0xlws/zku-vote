import { contract } from "./Constants";

export async function getLeaves() {
  const leaves = await contract.getLeaves();
  return leaves;
}
