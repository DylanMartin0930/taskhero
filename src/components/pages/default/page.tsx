"use client";
import styles from "./default.module.css";

export default function Default({ currentPage }) {
  return (
    <div className={styles.default}>
      <h1>Default Task Page</h1>
      <h3>{currentPage}</h3>

      {/* Task List */}
      <div>
        <h1>Tasks go here</h1>
      </div>
    </div>
  );
}
