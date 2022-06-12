import * as React from "react";
import ControlledAccordion from "./ControlledAccordion";
import { useContext, useEffect } from "react";
import { UserContext } from "contexts/UserContext";
import { LoginButton } from "./LoginButton";
import { useRouter } from "next/router";

// console.log(SortedList)

const VotePage = ({ props }: any) => {
  const { data, setData } = useContext(UserContext);
  const router = useRouter();

  let userId = "0";
  let roles = [];
  if (props.discordUser) {
    userId = props.discordUser.user.id;
    roles = props.discordUser.roles;
  }
  useEffect(() => {
    if (router.asPath == "/votePage") router.replace("/");
  }, []);

  return (
    <>
      <LoginButton props={props} />
      <ControlledAccordion userId={userId} roles={roles} />
    </>
  );
};

export default VotePage;
