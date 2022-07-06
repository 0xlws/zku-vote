import React, { useContext } from "react";
import { useRouter } from "next/router";

import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { LoginContext } from "../../Contexts/LoginContext";

export const LoginButton = () => {
  const { LoggedIn } = useContext(LoginContext);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");

    router.push("/api/logout");
  };

  return (
    <Tooltip title={LoggedIn ? "Logout" : "Login"} arrow>
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
          LoggedIn ? () => handleLogout() : () => router.push("/api/oauth")
        }
      >
        {LoggedIn ? <LogoutIcon /> : <LoginIcon />}
      </IconButton>
    </Tooltip>
  );
};
