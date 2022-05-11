import React from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Menu() {
  return (
    <div style={{ textAlign: "center" }}>
      <div className={styles.logoutButton}>
        <Link href="/api/logout">Logout</Link>
      </div>
      Vote for final submissions
      <div className={styles.button2}>
        <Link href="/proposalsPage">
          <a>
            <Image
              src="/jodyhongfilms.jpeg"
              alt="finals"
              width={500}
              height={130}
            />
          </a>
        </Link>
      </div>
      <br></br>
      Vote for classmates
      <div className={styles.button2}>
        <Link href="/votePage">
          <a>
            <Image
              src="/jonas-jacobsson.jpeg"
              alt="finals"
              width={500}
              height={130}
            />
          </a>
        </Link>
      </div>
    </div>
  );
}
