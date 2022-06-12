import React, { useState, useEffect } from "react";
import ProposalsPage from "../components/proposalsPage";
import { ParsedUrlQuery } from "querystring";
import { GetServerSidePropsContext, PreviewData } from "next";
import { parseUser } from "../utils/parseUser";
import { useContext } from "react";
import { PageContext } from "../contexts/PageContext";
import VotePage from "../components/votePage";

export default function Home(props: any) {
  const { page, setPage } = useContext(PageContext);
  const [userState, setUserState] = useState<any>(props);
  let LoggedIn = Object.values(userState).length !== 0;
  console.log({ userState });
  console.log({ LoggedIn });

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
      {page == "0" && <VotePage props={userState} />}
      {page == "1" && <ProposalsPage props={userState} />}
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
