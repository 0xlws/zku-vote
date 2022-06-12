import * as React from "react";
import CardGrid from "./CardGrid";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoginButton } from "./LoginButton";

export const ProposalsPage = ({ props }: any) => {
  const router = useRouter();

  useEffect(() => {
    if (router.asPath == "/proposalsPage") router.replace("/");
  });

  return (
    <>
      <LoginButton props={props} />
      <CardGrid props={props} />
    </>
  );
};

export default ProposalsPage;
