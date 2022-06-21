import React, { useState, useEffect } from "react";
import ProposalsPage from "../components/proposalsPage";
import { ParsedUrlQuery } from "querystring";
import { GetServerSidePropsContext, PreviewData } from "next";
import { parseUser } from "../utils/parseUser";
import { useContext } from "react";
import { PageContext } from "../contexts/PageContext";
import VotePage from "../components/votePage";
import {Role} from "../components/Constants"


export default function Home(props: any) {
  const { page, setPage } = useContext(PageContext);
  const [userState, setUserState] = useState<any>(props);


  let LoggedIn = Object.values(userState).length !== 0;

  let userId = "0";
  let roles = ["1"];

  if (LoggedIn) {
    userId = props.discordUser.user.id;
    roles = props.discordUser.roles;
  }



  let userRole: string[] | null = null;
  loop1: for (let i = 0; i < Role.length; i++) {
    loop2: for (let n = 0; n < roles.length; n++) {
      if (Role[i][1] === roles[n]) {
        userRole = Role[i];

        break loop1;
      }
    }
  }

  if (userRole == null) {
    userRole = [""];
  }

  const [logs, setLogs] = useState(`Welcome ${userRole![0]}`);


  useEffect(() => {
    if (localStorage.getItem("page") == null) {
      setPage("1");
    }
    if (localStorage.getItem("page") !== null) {
      if (page !== localStorage.getItem("page")) {
        setPage(localStorage.getItem("page")!);
      }
    }

    if (localStorage.getItem("user") !== null) {
      if (userState !== localStorage.getItem("user")) {
        setUserState(localStorage.getItem("user"));
      }
    }
  }, []);

  return (
    <>
      {page == "0" && <VotePage props={userState} userId={userId} userRole={userRole} logs={logs} setLogs={setLogs} />}
      {page == "1" && <ProposalsPage props={userState} userId={userId} userRole={userRole} logs={logs} setLogs={setLogs} />}
    </>
  );
}

export const getServerSideProps: any = async function (
  ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) {
  const user = parseUser(ctx);

  if (!user) return { props: {} };

  return { props: { discordUser: user } };
};
