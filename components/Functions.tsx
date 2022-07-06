import { contract } from "../Constants/Constants";

export async function getLeaves() {
  const leaves = await contract.getLeaves();
  return leaves;
}

export const loggedIn = (props: any) => {
  return Object.values(props).length !== 0;
};
