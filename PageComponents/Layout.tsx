import * as React from "React"
import { useState, useEffect, ReactNode} from "react";
import Head from "next/head";
import Image from "next/image";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import styles from "../styles/Home.module.css";
import ResponsiveDrawer from "../Components/Layout/ResponsiveDrawer";
import { LoginButton } from "../Components/Layout/LoginButton";


export default function Layout({ children }: { children: ReactNode }) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setOpacity(1);
    }, 500);
  }, []);

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>ZKU-Vote</title>
          <meta
            name="description"
            content="A simple Next.js/Hardhat privacy application with Semaphore."
          />
          <link rel="icon" href="/favicon.ico" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap"
            rel="stylesheet"
          />
        </Head>

        <div
          className={styles.banner}
          style={{
            zIndex: "1201",
          }}
        >
          <div
            className={styles.logoContainer}
            style={{
              opacity: `${opacity}`,
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                fontSize: "large",
                color: "grey",
                marginLeft: "1.3rem",
                marginTop: "0.6rem",
                transform: "scale(1.5)",
              }}
            ></span>
              <>
                <span className={styles.logo}>
                  <Image
                    src="/zkulogo.png"
                    blurDataURL="/zkulogo.png"
                    alt="ZKU_logo"
                    width={48}
                    height={36}
                    placeholder="blur"
                  />
                  <Tooltip
                    sx={{
                      zIndex: "12",
                      position: "absolute",
                      left: "-100px",
                      color: "rgba(0,0,0,0)",
                    }}
                    title="ZKU Logo by Tosin Shada"
                    placement="bottom"
                    arrow
                  >
                    <Button
                      sx={{
                        left: "-250%",
                        right: "0",
                        opacity: "0",
                        position: "absolute",
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0)",
                        },
                      }}
                    >
                      QWERTYUIOPASDFGHJKLZXCVBNM
                    </Button>
                  </Tooltip>
                </span>
                <span className={styles.bannerText}>
                  <h1>vote</h1>
                </span>
              </>
            
          </div>
        </div>

        {/* <MiniDrawer/> */}

        <ResponsiveDrawer />
        <LoginButton/>
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
}
