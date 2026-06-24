import { Link } from "react-router-dom";
import { Clock, Wrench, Smartphone } from "lucide-react";
import Paw from "../../components/Paw/Paw";
import dogsPhoto from "../../assets/Dogs.jpg";
import styles from "./Home.module.css";

const steps = [
  {
    number: "1",
    title: "Tap in",
    body: "A worker starts a timer with one tap from the job site. No paperwork, no separate stopwatch.",
  },
  {
    number: "2",
    title: "Log it",
    body: "Snap a photo, add a note, mark the job complete. FalkTrack adds up the hours automatically.",
  },
  {
    number: "3",
    title: "Track it",
    body: "Every piece of equipment's maintenance history is right there — last service, next one due.",
  },
];

const features = [
  {
    icon: Clock,
    title: "Jobs & Time",
    body: "Build jobs from templates, assign the work, and track hours without a single spreadsheet.",
    accentColor: "var(--color-indigo)",
  },
  {
    icon: Wrench,
    title: "Assets & Maintenance",
    body: "A complete maintenance log for every piece of equipment you own, with photos attached.",
    accentColor: "var(--color-orange)",
  },
  {
    icon: Smartphone,
    title: "Built for the Field",
    body: "Big buttons, simple screens — works on the phone already in your pocket.",
    accentColor: "var(--color-purple)",
  },
];
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
              <img
                src={dogsPhoto}
                alt="Two yellow Labs — the FalkTrack mascots"
                className={styles.mascotPhoto}
              />
            </div>
            <p className={styles.mascotCaption}>
              Chief Retrieval Officers, FalkTrack
            </p>
          </div>
        </section>
        <section className={styles.howItWorks}>
          <div className={styles.howItWorksInner}>
            <h2 className={styles.sectionHeading}>How it works</h2>
            <p className={styles.sectionSubtext}>
              Three steps, built around the way field crews actually work.
            </p>
            <div className={styles.steps}>
              {steps.map((step) => (
                <div key={step.number} className={styles.step}>
                  <div className={styles.stepIcon}>
                    <span className={styles.stepNumber}>{step.number}</span>
                  </div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepBody}>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className={styles.features}>
          <div className={styles.featuresInner}>
            <h2 className={styles.sectionHeading}>Features</h2>
            <div className={styles.featuresGrid}>
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className={styles.featureCard}>
                    <div
                      className={styles.featureIconWrap}
                      style={{ borderTopColor: feature.accentColor }}
                    >
                      <Icon size={28} color={feature.accentColor} />
                    </div>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureIconBody}>{feature.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
