import * as React from "react";
import { useState } from "react";
import Layout from "../PageComponents/Layout";
import { PageContext } from "../Contexts/PageContext";
import { LoginContext } from "../Contexts/LoginContext";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: any) {
  const [LoggedIn, setLoggedIn] = useState<any>(false);
  const [page, setPage] = useState<any>(null);

  return (
    <ThemeProvider theme={theme}>
      <LoginContext.Provider value={{ LoggedIn, setLoggedIn }}>
        <PageContext.Provider value={{ page, setPage }}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PageContext.Provider>
      </LoginContext.Provider>
    </ThemeProvider>
  );
}

export default MyApp;
