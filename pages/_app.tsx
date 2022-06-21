import * as React from "react";
import "../styles/globals.css";
import Layout from "../components/Layout";
import theme from "../styles/theme";
import { ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { PageContext } from "../contexts/PageContext";

function MyApp({ Component, pageProps }: any) {
  const [data, setData] = useState({});
  const [page, setPage] = useState<any>(null);

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{ data, setData }}>
        <PageContext.Provider value={{ page, setPage }}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PageContext.Provider>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default MyApp;
