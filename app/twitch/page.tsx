"use client";
import { useState } from "react";

export default function TwitchPage() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultTab, setResultTab] = useState("info");

  async function load() {
    if (!username.trim()) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch(`/api/twitch/user/${username}`);
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
    liveBadge: {
      fontSize: 11,
      fontWeight: 500,
      background: "var(--color-background-danger)",
      color: "var(--color-text-danger)",
      borderRadius: 6,
      padding: "2px 8px",
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
        <span style={{ fontSize: 20, fontWeight: 500 }}>twitch</span>
      </div>

      <div style={s.inputRow}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username..."
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
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <img
                    src={data.profile_image_url}
                    style={{ width: 64, height: 64, borderRadius: "50%", flexShrink: 0 }}
                    alt="avatar"
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 18, fontWeight: 500 }}>{data.display_name}</span>
                      {data.is_live && <span style={s.liveBadge}>LIVE</span>}
                    </div>
                    <div style={{ fontSize: 13, ...s.muted }}>@{data.username}</div>
                    {data.bio && <div style={{ fontSize: 13, marginTop: 6 }}>{data.bio}</div>}
                  </div>
                </div>
              </div>

              {data.is_live && data.stream && (
                <div style={s.card}>
                  <p style={{ fontSize: 12, ...s.muted, marginBottom: 10 }}>live stream</p>
                  <img
                    src={data.stream.thumbnail_url}
                    style={{ width: "100%", borderRadius: 8, marginBottom: 10 }}
                    alt="thumbnail"
                  />
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{data.stream.title}</div>
                  <div style={{ fontSize: 13, ...s.muted, marginTop: 4 }}>{data.stream.game}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    {data.stream.tags?.map((t: string) => (
                      <span key={t} style={s.badge}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <InfoRow k="Zuschauer" v={data.stream.viewers.toLocaleString()} />
                    <InfoRow
                      k="Live seit"
                      v={new Date(data.stream.started_at).toLocaleString("de-DE")}
                    />
                  </div>
                </div>
              )}

              <div style={s.card}>
                <InfoRow k="Views gesamt" v={data.view_count.toLocaleString()} />
                <InfoRow k="Dabei seit" v={new Date(data.created_at).toLocaleDateString("de-DE")} />
                <InfoRow k="Status" v={data.is_live ? "Live" : "Offline"} />
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}
