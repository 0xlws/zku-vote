import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { BytesLike, utils } from "ethers";
import { contract } from "../Constants/Constants";
import { LoginContext } from "Contexts/LoginContext";
import ControlledAccordion from "../Components/VotePage/ControlledAccordion";
import CheckboxList from "../Components/VotePage/CheckboxList";
import SortedList from "../Components/VotePage/SortedList";

const VotePage = ({ userId, vote, addLeaf }: any) => {
  const router = useRouter();
  const { LoggedIn } = useContext(LoginContext);
  const [refresh, setRefresh] = useState(false);
  const [checked, setChecked] = useState<number>(-1);
  const [candidates, setCandidates] = useState<any>();
  const [expanded, setExpanded] = useState<string | false>("panel1");
  const [arr, setArr] = useState<(string | boolean)[]>([
    "Choose a campaign",
    false,
  ]);

  if (arr[1]) {
    setExpanded("panel2");
    const newArr = [...arr];
    newArr[1] = false;
    setArr(newArr);
  }

  React.useEffect(() => {
    if (LoggedIn) {
      addLeaf(0);
    }
  }, [LoggedIn]);

  if (!candidates) {
    load();
  }

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
    }
  }

  async function giveVote(choice: any) {
    const success = vote(choice, 0);
    if (success) setRefresh(!refresh);
  }

  useEffect(() => {
    if (router.asPath == "/votePage") router.replace("/");
  });

  return (
    <>
      <ControlledAccordion
        userId={userId}
        giveVote={giveVote}
        candidates={candidates}
        arr={arr}
        setArr={setArr}
        expanded={expanded}
        setExpanded={setExpanded}
      >
        <CheckboxList
          setArr={setArr}
          checked={checked}
          setChecked={setChecked}
        />
        <SortedList
          userId={userId}
          arr={arr}
          candidates={candidates}
          giveVote={giveVote}
        />
      </ControlledAccordion>
    </>
  );
};

export default VotePage;
