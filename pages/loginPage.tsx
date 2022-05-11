import React from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function LoginPage() {

  return (
    <>
      <div className={styles.startdiv}>
        <h1 className={styles.title}>🌟</h1>
        <p>
          “Dwell on the beauty of life. Watch the stars, and see yourself
          running with them.” ― Marcus Aurelius, Meditations
        </p>
        <div className={styles.button}>
          <Link href="/api/oauth">Login</Link>
        </div>
      </div>
    </>
  );
}
