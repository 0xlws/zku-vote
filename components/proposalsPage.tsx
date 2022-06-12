import * as React from "react";
import CardGrid from "./CardGrid";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoginButton } from "./LoginButton";

export const ProposalsPage = ({ props }: any) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);
  const router = useRouter();

  console.log({ props });
  // let userId = "0";
  // let roles: any[] = [];

  // if (props.discordUser) {
  //   userId = props.discordUser.user.id;
  //   roles = props.discordUser.roles;
  // }

  useEffect(() => {
    if (router.asPath == "/proposalsPage") router.replace("/");
  });

  return (
    <>
      <LoginButton props={props} />
      <CardGrid props={props} />
      {/* <LoginButton props={props} /> */}
      {/* <CardGrid userId={userId} roles={roles} /> */}
    </>
  );
};

export default ProposalsPage;
