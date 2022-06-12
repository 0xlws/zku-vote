import React, { useState, useEffect } from "react";
import ProposalsPage from "../components/proposalsPage";
import { ParsedUrlQuery } from "querystring";
import { GetServerSidePropsContext, PreviewData } from "next";
import { parseUser } from "../utils/parseUser";
import { useContext } from "react";
import { PageContext } from "../contexts/PageContext";
import VotePage from "../components/votePage";

export default function Home(props: any) {
// export default function Home() {
  // let props = { discordUser: false };
  const { page, setPage } = useContext(PageContext);
  const [userState, setUserState] = useState<any>(props);
  // let discordUser: any;
  console.log({props})
  let LoggedIn = Object.values(userState).length !== 0
  console.log({LoggedIn})
  // if (props.discordUser !== false) {
  //   discordUser = props;
  // }
  
  useEffect( () => {

    if (localStorage.getItem("page") == null) {
      setPage('1')
    }
    if (localStorage.getItem("page") !== null) {
      if (page !== localStorage.getItem("page")) {
        setPage(localStorage.getItem("page")!);

      }
    }
    console.log([localStorage][0])
    if (localStorage.getItem("user") !== null){

    }

    // if (!LoggedIn) {
    //   localStorage.setItem("user", JSON.stringify(discordUser));
    // }
    // if (JSON.stringify(discordUser) !== localStorage.getItem("user")) {
      // setUserState(JSON.parse(localStorage.getItem("user")!));
    // }
    // console.log({ localStorage });
  },[]);


  return (
    <>
      {page == "0" && <VotePage />}
      {page == "1" && <ProposalsPage />}
      {/* {page == "0" && <VotePage props={props} />} */}
      {/* {page == "1" && <ProposalsPage props={props} />} */}
    </>
  );
}

export const getServerSideProps: any = async function (
  ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) {
  const user = parseUser(ctx);

  if (!user) return { props: { } };

  return { props: { discordUser: user } };
};
