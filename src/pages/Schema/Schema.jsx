import AppHeader from "../../components/AppHeader/AppHeader";
import styles from "./Schema.module.css";

// Static page - just presents the database schema diagram inside the
// running app (a rubric requirement: "A Database Schema Diagram is
// presented in the application, following UML standards"). The image
// itself (public/schema-diagram.png) is generated straight from the
// real supabase/01_schema.sql - see DECISIONS.md for why this replaced
// the original diagrams/FalkTrack_ERD.png from earlier in the project.
export default function Schema() {
  return (
    <div>
      <AppHeader />
      <div className={styles.container}>
        <h1>Database Schema</h1>
        <p className={styles.intro}>
          FalkTrack's six tables, generated directly from the schema in{" "}
          <code>supabase/01_schema.sql</code>. Every table but{" "}
          <code>companies</code> traces back to a company (directly or
          through a relationship) - that's the multi-tenancy boundary this
          whole app is built around.
        </p>
        <img
          src="/schema-diagram.png"
          alt="FalkTrack database schema entity relationship diagram, showing the companies, users, assets, maintenance_records, jobs, and time_entries tables and how they relate."
          className={styles.diagram}
        />
      </div>
    </div>
  );
}
