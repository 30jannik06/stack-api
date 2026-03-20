"use client";
import { useState } from "react";

export default function NpmPage() {
  const [pkg, setPkg] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultTab, setResultTab] = useState("info");

  async function load() {
    if (!pkg.trim()) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch(`/api/npm/${pkg}`);
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || "Fehler");
      }
      setData(await res.json());
      setResultTab("info");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function tabStyle(active: boolean): React.CSSProperties {
    return {
      padding: "6px 16px",
      fontSize: 13,
      borderRadius: 8,
      border: "0.5px solid var(--color-border-secondary)",
      cursor: "pointer",
      background: active ? "var(--color-background-secondary)" : "transparent",
      color: active ? "var(--color-text-primary)" : "var(--color-text-secondary)",
    };
  }

  const s: Record<string, React.CSSProperties> = {
    page: {
      maxWidth: 700,
      margin: "0 auto",
      padding: "2rem 1rem",
      fontFamily: "monospace",
      color: "var(--color-text-primary)",
    },
    tabs: { display: "flex", gap: 8, marginBottom: "1.5rem" },
    inputRow: { display: "flex", gap: 8, marginBottom: "1.5rem" },
    card: {
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: 12,
      padding: "1rem 1.25rem",
      marginBottom: 12,
    },
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 13,
      padding: "5px 0",
      borderBottom: "0.5px solid var(--color-border-tertiary)",
      gap: 12,
      wordBreak: "break-all",
    },
    muted: { color: "var(--color-text-secondary)" },
    pre: {
      background: "var(--color-background-secondary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: 8,
      padding: 12,
      fontSize: 12,
      overflow: "auto",
      maxHeight: 400,
    },
    badge: {
      fontSize: 11,
      background: "var(--color-background-info)",
      color: "var(--color-text-info)",
      borderRadius: 6,
      padding: "2px 8px",
      marginRight: 4,
      display: "inline-block",
    },
  };

  function InfoRow({ k, v }: { k: string; v: React.ReactNode }) {
    return (
      <div style={s.infoRow}>
        <span style={s.muted}>{k}</span>
        <span style={{ textAlign: "right" }}>{v}</span>
      </div>
    );
  }

  return (
    <main style={s.page}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
        <a
          href="/"
          style={{ fontSize: 13, color: "var(--color-text-secondary)", textDecoration: "none" }}
        >
          ← stack-api
        </a>
        <span style={s.muted}>/</span>
        <span style={{ fontSize: 20, fontWeight: 500 }}>npm</span>
      </div>

      <div style={s.inputRow}>
        <input
          type="text"
          value={pkg}
          onChange={(e) => setPkg(e.target.value)}
          placeholder="Package name..."
          onKeyDown={(e) => e.key === "Enter" && load()}
          style={{ flex: 1 }}
        />
        <button onClick={load}>{loading ? "..." : "Laden"}</button>
      </div>

      {error && (
        <p style={{ color: "var(--color-text-danger)", fontSize: 13, marginBottom: 12 }}>{error}</p>
      )}

      {data && (
        <>
          <div style={{ ...s.tabs, marginBottom: 16 }}>
            {["info", "raw"].map((t) => (
              <button key={t} style={tabStyle(resultTab === t)} onClick={() => setResultTab(t)}>
                {t}
              </button>
            ))}
          </div>

          {resultTab === "raw" && <pre style={s.pre}>{JSON.stringify(data, null, 2)}</pre>}

          {resultTab === "info" && (
            <>
              <div style={s.card}>
                <div style={{ fontSize: 18, fontWeight: 500 }}>{data.name}</div>
                <div style={{ fontSize: 13, ...s.muted, marginTop: 4 }}>{data.description}</div>
                <div style={{ marginTop: 8 }}>
                  {data.keywords?.slice(0, 6).map((k: string) => (
                    <span key={k} style={s.badge}>
                      {k}
                    </span>
                  ))}
                </div>
              </div>
              <div style={s.card}>
                <InfoRow k="Version" v={data.version} />
                <InfoRow k="Author" v={data.author ?? "—"} />
                <InfoRow k="License" v={data.license ?? "—"} />
                <InfoRow
                  k="Downloads (letzter Monat)"
                  v={data.downloads_last_month?.toLocaleString() ?? "—"}
                />
                <InfoRow k="Dependencies" v={data.dependencies} />
                <InfoRow
                  k="Erstellt"
                  v={data.created_at ? new Date(data.created_at).toLocaleDateString("de-DE") : "—"}
                />
                <InfoRow
                  k="Aktualisiert"
                  v={data.updated_at ? new Date(data.updated_at).toLocaleDateString("de-DE") : "—"}
                />
                {data.homepage && (
                  <InfoRow
                    k="Homepage"
                    v={
                      <a
                        href={data.homepage}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "var(--color-text-info)" }}
                      >
                        {data.homepage}
                      </a>
                    }
                  />
                )}
                <InfoRow
                  k="NPM"
                  v={
                    <a
                      href={data.npm_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "var(--color-text-info)" }}
                    >
                      {data.npm_url}
                    </a>
                  }
                />
              </div>
              {Object.keys(data.dist_tags).length > 0 && (
                <div style={s.card}>
                  <p style={{ fontSize: 12, ...s.muted, marginBottom: 8 }}>dist tags</p>
                  {Object.entries(data.dist_tags).map(([tag, version]) => (
                    <InfoRow key={tag} k={tag} v={version as string} />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
