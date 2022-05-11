import React from "react";
import { GetServerSidePropsContext, PreviewData } from "next";
import LoginPage from "./loginPage";
import { ParsedUrlQuery } from "querystring";
import Layout from "../components/Layout";
import { DiscordUser } from "../utils/types";
import { parseUser } from "../utils/parseUser";
import Menu from "./menu";

interface Props {
  user: DiscordUser;
}

export default function Home(props: Props) {
  if (!props.user || props.user == null) {
    return (
      <Layout>
        <LoginPage />
      </Layout>
    );
  }

  return (
    <Layout>
      <Menu />
    </Layout>
  );
}
export const getServerSideProps: any = async function (
  ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) {
  const user = parseUser(ctx);

  return { props: { user } };
};
