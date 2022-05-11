import { utils } from "ethers";
import assert from "./assertTrue";

export function formatId(identityCommitment: bigint) {
  const msg1 = "Length must be smaller then 32";
  const msg2 = "sliceOne + sliceTwo + sliceThree does not equal strId";
  const strId = identityCommitment.toString();
  const sliceOne = strId.substring(0, 31);
  assert(sliceOne.length < 32, msg1);
  const sliceTwo = strId.toString().substring(31, 62);
  assert(sliceOne.length < 32, msg1);
  const sliceThree = strId.toString().substring(62);
  assert(sliceOne.length < 32, msg1);
  const tmp = [sliceOne, sliceTwo, sliceThree];
  assert(sliceOne + sliceTwo + sliceThree === strId, msg2);

  const bytes32Arr = tmp.map((strIdSub) => utils.formatBytes32String(strIdSub));
  return bytes32Arr;
}

export function formatId2(x: bigint) {
  const tmp = [];
  const y = x.toString();
  let n = 0;
  for (let i = 31; i < y.length; i += 31) {
    tmp.push(y.substring(i - 31, i));
    n = i;
  }
  if (y.length % 31 == 0) {
    const bytes32Arr = tmp.map((strIdSub) =>
      utils.formatBytes32String(strIdSub)
    );
    return bytes32Arr;
  }
  tmp.push(y.substring(n, y.length));
  const bytes32Arr = tmp.map((strIdSub) => utils.formatBytes32String(strIdSub));
  return bytes32Arr;
};

export function parseIdArr(bytes32Arr: string[][]) {
  let temp = [];
  const pB = utils.parseBytes32String;
  temp.push(
    bytes32Arr.map((tmp) => {
      tmp = [pB(tmp[0]) + pB(tmp[1]) + pB(tmp[2])];
      return tmp[0];
    })
  );
  return temp[0];
}

// const eventArgs = receipt.events[0].args;
// const parseEvents = () => {
//   for (const event of receipt.events) {
//       const tmp = event.args
//         .toString()
//         .split(",")
//         .map((a: any) => BigInt(a).toString()
//     );
//     return tmp
//   }
// }
// const eventArgs = parseEvents();
// const eventArgs = receipt.events[0].args;
// console.log("eventArgs", eventArgs);
