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
    </div>
  );
}
