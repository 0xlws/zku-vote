import Head from "next/head";
import React from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
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
        </Head>

        <div className={styles.banner}>
          <Link href="/">
            <a>
              <div className={styles.logodiv}>
                <span className={styles.logo}>
                  <Image
                    src="/zkulogo.png"
                    alt="ZKU_logo"
                    width={48}
                    height={36}
                  />
                  <Tooltip
                    sx={{
                      zIndex: "10",
                      position: "absolute",
                      left: "-100px",
                      color: "rgba(0,0,0,0)",
                    }}
                    title="Click to go back to home page. [Logo by Tosin Shada]"
                    placement="bottom"
                  >
                    <Button>QWERTYUIOPASDFGHJKLZXCVBNM</Button>
                  </Tooltip>
                </span>
                <span className={styles.bannertext1}>
                  <h1>vote</h1>
                </span>
              </div>
            </a>
          </Link>
        </div>
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
}
