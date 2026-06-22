import { Link } from "react-router-dom";
import Paw from "../../components/Paw/Paw";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>
              <Paw size={26} />
            </span>
            <span className={styles.logoText}>FalkTrack</span>
          </Link>
          <Link to="/login" className={styles.navLink}>
            Log in
          </Link>
          <Link to="/signup" className={styles.signupButton}>
            Sign Up
          </Link>
        </div>
      </header>
      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.heroBadge}>Automotive · Utility · Ag</p>
            <h1 className={styles.heroHeadline}>
              Track the job.
              <br />
              Not the paperwork.
            </h1>
            <p className={styles.heroSubtext}>
              FalkTrack keeps job time, equipment history, and maintenance
              records in one place — simple enough for the field, solid enough
              for the shop.
            </p>
            <div className={styles.heroButtons}>
              <Link to="/signup" className={styles.buttonPrimary}>
                Get started
              </Link>
              <Link to="/login" className={styles.buttonOutline}>
                Log in
              </Link>
            </div>
          </div>

          <div className={styles.heroMascot}>
            <p className={styles.mascotLabel}>Meet the crew</p>
            <div className={styles.mascotCard}>
              <p>📸 Photo goes here</p>
              <p>Swap this for a photo of your two Labs</p>
            </div>
            <p className={styles.mascotCaption}>
              Chief Retrieval Officers, FalkTrack
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
