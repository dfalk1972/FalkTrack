import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppHeader from "../../components/AppHeader/AppHeader";
import styles from "./AssetDetail.module.css";

export default function AssetDetail() {
  const { id } = useParams();
  const { session } = useAuth();
  const [asset, setAsset] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    maintenance_type: "",
    notes: "",
    cost: "",
    next_due_date: "",
  });
  const [error, setError] = useState("");

  async function loadAsset() {
    setLoading(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assets/${id}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const data = await res.json();

    if (res.ok) {
      setAsset(data.asset);
      setRecords(data.maintenanceRecords);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadAsset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleAddRecord(e) {
    e.preventDefault();
    setError("");

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/assets/${id}/maintenance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ...form,
          cost: Number(form.cost),
          next_due_date: form.next_due_date || null,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Could not add maintenance record");
      return;
    }

    setForm({ maintenance_type: "", notes: "", cost: "", next_due_date: "" });
    loadAsset();
  }

  if (loading) return <p>Loading...</p>;
  if (!asset) return <p>Asset not found.</p>;

  return (
    <div>
      <AppHeader />
      <div className={styles.container}>
        <h1>{asset.name}</h1>
        <p className={styles.meta}>
          #{asset.asset_number} · {asset.category} · {asset.make}{" "}
          {asset.model} ({asset.year})
        </p>

        <h2>Add Maintenance Record</h2>
        <form onSubmit={handleAddRecord} className={styles.form}>
          <input
            placeholder="Type (e.g. Oil change)"
            value={form.maintenance_type}
            onChange={(e) => updateField("maintenance_type", e.target.value)}
            required
          />
          <input
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
          />
          <input
            placeholder="Cost"
            type="number"
            step="0.01"
            value={form.cost}
            onChange={(e) => updateField("cost", e.target.value)}
            required
          />
          <label className={styles.dateLabel}>
            Next due date
            <input
              type="date"
              value={form.next_due_date}
              onChange={(e) => updateField("next_due_date", e.target.value)}
            />
          </label>
          <button type="submit">Add Record</button>
        </form>
        {error && <p className={styles.error}>{error}</p>}

        <h2>Maintenance History</h2>
        {records.length === 0 ? (
          <p>No maintenance records yet.</p>
        ) : (
          <ul className={styles.recordList}>
            {records.map((r) => (
              <li key={r.id} className={styles.recordCard}>
                <strong>{r.maintenance_type}</strong> — ${r.cost}
                {r.notes && <p>{r.notes}</p>}
                {r.next_due_date && (
                  <p className={styles.meta}>Next due: {r.next_due_date}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
