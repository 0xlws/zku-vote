import React, { useState, useEffect } from "react";
import ProposalsPage from "../components/proposalsPage";
import { ParsedUrlQuery } from "querystring";
import { GetServerSidePropsContext, PreviewData } from "next";
import { parseUser } from "../utils/parseUser";
import { useContext } from "react";
import { PageContext } from "../contexts/PageContext";
import VotePage from "../components/votePage";

export default function Home() {
  let props = {discordUser : false}
  const { page, setPage } = useContext(PageContext);
  const [userState, setUserState] = useState<any>(props);
  let discordUser: any

  if(props.discordUser !== false) {
    discordUser = props
  }

  useEffect(() => {
    // console.log(localStorage.getItem("user"))
    if (discordUser) {
      localStorage.setItem("user", JSON.stringify(discordUser));
    }
    if (
      JSON.stringify(discordUser) !== localStorage.getItem("user")
    ) {
      setUserState(JSON.parse(localStorage.getItem("user")!));
    }
    if (page !== localStorage.getItem("page")) {
      setPage(localStorage.getItem("page")!);
    }
    // console.log({ localStorage });
  },[discordUser, userState, page, setPage]);

  return (
    <>
      {page == "0" && <VotePage props={userState} />}
      {page == "1" && <ProposalsPage props={userState} />}
    </>
  );
}

// export const getServerSideProps: any = async function (
//   ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
// ) {
//   const user = parseUser(ctx);

//   if (user == null) return { props: { discordUser: false } };

//   return { props: { discordUser: user } };
// };
