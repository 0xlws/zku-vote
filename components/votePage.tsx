import * as React from "react";
import ControlledAccordion from "./ControlledAccordion";
import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { LoginButton } from "./LoginButton";
import { useRouter } from "next/router";

// console.log(SortedList)

const VotePage = ({ props }: any) => {
  const router = useRouter();

  useEffect(() => {
    if (router.asPath == "/votePage") router.replace("/");
  });

  return (
    <>
      <LoginButton props={props} />
      <ControlledAccordion props={props} />
    </>
  );
};

export default VotePage;
