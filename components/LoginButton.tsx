import React from "react";
import { useRouter } from "next/router";

import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

export const LoginButton = ({ props }: any) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.setItem("user", JSON.stringify(false));

    router.push("/api/logout");
  };

  return (
    <Tooltip title={props.discordUser ? "Logout" : "Login"} arrow>
      <IconButton
        sx={{
          zIndex: 1202,
          position: "fixed",
          fontSize: "large",
          color: "#666",
          marginRight: "1rem",
          marginTop: "0.6rem",
          transform: "scale(1.5)",
          top: "0px",
          right: "0px",
          borderRadius: "2",
        }}
        onClick={
          props.discordUser
            ? () => handleLogout()
            : () => router.push("/api/oauth")
        }
      >
        {props.discordUser ? <LogoutIcon /> : <LoginIcon />}
      </IconButton>
    </Tooltip>
  );
};
