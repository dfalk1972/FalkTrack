import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppHeader from "../../components/AppHeader/AppHeader";
import styles from "./Assets.module.css";

export default function Assets() {
  const { session } = useAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    asset_number: "",
    category: "",
    make: "",
    model: "",
    year: "",
  });
  const [error, setError] = useState("");

  async function loadAssets() {
    setLoading(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assets`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const data = await res.json();
    setAssets(data.assets || []);
    setLoading(false);
  }

  useEffect(() => {
    loadAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ ...form, year: Number(form.year) }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Could not create asset");
      return;
    }

    setForm({
      name: "",
      asset_number: "",
      category: "",
      make: "",
      model: "",
      year: "",
    });
    loadAssets();
  }

  return (
    <div>
      <AppHeader />
      <div className={styles.container}>
        <h1>Assets</h1>

        <form onSubmit={handleCreate} className={styles.createForm}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
          />
          <input
            placeholder="Asset number"
            value={form.asset_number}
            onChange={(e) => updateField("asset_number", e.target.value)}
            required
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
            required
          />
          <input
            placeholder="Make"
            value={form.make}
            onChange={(e) => updateField("make", e.target.value)}
            required
          />
          <input
            placeholder="Model"
            value={form.model}
            onChange={(e) => updateField("model", e.target.value)}
            required
          />
          <input
            placeholder="Year"
            type="number"
            value={form.year}
            onChange={(e) => updateField("year", e.target.value)}
            required
          />
          <button type="submit">Add Asset</button>
        </form>
        {error && <p className={styles.error}>{error}</p>}

        {loading ? (
          <p>Loading assets...</p>
        ) : assets.length === 0 ? (
          <p>No assets yet - add the first one above.</p>
        ) : (
          <ul className={styles.assetList}>
            {assets.map((asset) => (
              <li key={asset.id} className={styles.assetCard}>
                <Link to={`/assets/${asset.id}`}>
                  <strong>{asset.name}</strong>
                  <span className={styles.meta}>
                    {" "}
                    — {asset.make} {asset.model} ({asset.year})
                  </span>
                  <p className={styles.meta}>
                    #{asset.asset_number} · {asset.category}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
