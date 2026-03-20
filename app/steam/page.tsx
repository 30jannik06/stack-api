"use client";
import { useState } from "react";

export default function SteamPage() {
    const [steamid, setSteamid] = useState("");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resultTab, setResultTab] = useState("info");

    async function load() {
        if (!steamid.trim()) return;
        setLoading(true); setError(""); setData(null);
        try {
            const res = await fetch(`/api/steam/user/${steamid}`);
            if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Fehler"); }
            setData(await res.json());
            setResultTab("info");
        } catch (e: any) { setError(e.message); }
        finally { setLoading(false); }
    }

    function tabStyle(active: boolean): React.CSSProperties {
        return {
            padding: "6px 16px", fontSize: 13, borderRadius: 8,
            border: "0.5px solid var(--color-border-secondary)", cursor: "pointer",
            background: active ? "var(--color-background-secondary)" : "transparent",
            color: active ? "var(--color-text-primary)" : "var(--color-text-secondary)",
        };
    }

    const s: Record<string, React.CSSProperties> = {
        page: { maxWidth: 700, margin: "0 auto", padding: "2rem 1rem", fontFamily: "monospace", color: "var(--color-text-primary)" },
        tabs: { display: "flex", gap: 8, marginBottom: "1.5rem" },
        inputRow: { display: "flex", gap: 8, marginBottom: "1.5rem" },
        card: { background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 12 },
        infoRow: { display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", borderBottom: "0.5px solid var(--color-border-tertiary)", gap: 12, wordBreak: "break-all" },
        muted: { color: "var(--color-text-secondary)" },
        pre: { background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 8, padding: 12, fontSize: 12, overflow: "auto", maxHeight: 400 },
        badge: { fontSize: 11, background: "var(--color-background-success)", color: "var(--color-text-success)", borderRadius: 6, padding: "2px 8px", marginRight: 4, display: "inline-block" },
    };

    const statusColors: Record<string, string> = {
        online: "#23a55a", busy: "#f23f43", away: "#f0b232",
        snooze: "#f0b232", offline: "#80848e",
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
                <a href="/" style={{ fontSize: 13, color: "var(--color-text-secondary)", textDecoration: "none" }}>← stack-api</a>
                <span style={s.muted}>/</span>
                <span style={{ fontSize: 20, fontWeight: 500 }}>steam</span>
            </div>

            <div style={s.inputRow}>
                <input type="text" value={steamid} onChange={(e) => setSteamid(e.target.value)}
                       placeholder="SteamID64..." onKeyDown={(e) => e.key === "Enter" && load()} style={{ flex: 1 }} />
                <button onClick={load}>{loading ? "..." : "Laden"}</button>
            </div>

            {error && <p style={{ color: "var(--color-text-danger)", fontSize: 13, marginBottom: 12 }}>{error}</p>}

            {data && (
                <>
                    <div style={{ ...s.tabs, marginBottom: 16 }}>
                        {["info", "raw"].map((t) => (
                            <button key={t} style={tabStyle(resultTab === t)} onClick={() => setResultTab(t)}>{t}</button>
                        ))}
                    </div>

                    {resultTab === "raw" && <pre style={s.pre}>{JSON.stringify(data, null, 2)}</pre>}

                    {resultTab === "info" && (
                        <>
                            <div style={s.card}>
                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                    <img src={data.avatar.large} style={{ width: 64, height: 64, borderRadius: 8, flexShrink: 0 }} alt="avatar" />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 18, fontWeight: 500 }}>{data.username}</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusColors[data.status] || "#80848e", display: "inline-block" }} />
                                            <span style={{ fontSize: 13, ...s.muted }}>{data.status}</span>
                                        </div>
                                        {data.currently_playing && (
                                            <div style={{ fontSize: 13, marginTop: 6 }}>
                                                Spielt gerade: <span style={{ color: "var(--color-text-success)" }}>{data.currently_playing}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={s.card}>
                                <InfoRow k="SteamID64" v={data.steamid} />
                                <InfoRow k="Profil" v={<a href={data.profile_url} target="_blank" rel="noreferrer" style={{ color: "var(--color-text-info)" }}>Link</a>} />
                                <InfoRow k="Sichtbarkeit" v={data.visibility} />
                                {data.country && <InfoRow k="Land" v={data.country} />}
                                {data.created_at && <InfoRow k="Dabei seit" v={new Date(data.created_at).toLocaleDateString("de-DE")} />}
                                {data.last_online && <InfoRow k="Zuletzt online" v={new Date(data.last_online).toLocaleString("de-DE")} />}
                            </div>

                            {data.recent_games?.length > 0 && (
                                <>
                                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8 }}>zuletzt gespielt</p>
                                    {data.recent_games.map((g: any) => (
                                        <div key={g.appid} style={s.card}>
                                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                                <img src={g.icon_url} style={{ width: 32, height: 32, borderRadius: 4, flexShrink: 0 }} alt={g.name} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 13, fontWeight: 500 }}>{g.name}</div>
                                                    <div style={{ fontSize: 12, ...s.muted, marginTop: 2 }}>
                                                        {g.playtime_2weeks_hours}h letzte 2 Wochen · {g.playtime_total_hours}h gesamt
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </main>
    );
}