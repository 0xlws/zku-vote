import "../styles/globals.css";

import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme";
import { UserContext } from "../contexts/UserContext";
import { AuthContext } from "../contexts/AuthContext";
import { useState } from "react";

import Layout from "../components/Layout";
import { PageContext } from "../contexts/PageContext";

function MyApp({ Component, pageProps }: any) {
  const [data, setData] = useState({});
  const [auth, setAuth] = useState<boolean | {}>(false);
  const [page, setPage] = useState<any>(null);

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{ data, setData }}>
        <AuthContext.Provider value={{ auth, setAuth }}>
          <PageContext.Provider value={{ page, setPage }}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </PageContext.Provider>
        </AuthContext.Provider>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default MyApp;
