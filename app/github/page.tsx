"use client";
import { useState } from "react";

export default function GitHubPage() {
    const [tab, setTab] = useState<"user" | "repo">("user");
    const [username, setUsername] = useState("");
    const [owner, setOwner] = useState("");
    const [repo, setRepo] = useState("");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resultTab, setResultTab] = useState("info");

    async function loadUser() {
        if (!username.trim()) return;
        setLoading(true); setError(""); setData(null);
        try {
            const res = await fetch(`/api/github/user/${username}`);
            if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Fehler"); }
            setData(await res.json());
            setResultTab("info");
        } catch (e: any) { setError(e.message); }
        finally { setLoading(false); }
    }

    async function loadRepo() {
        if (!owner.trim() || !repo.trim()) return;
        setLoading(true); setError(""); setData(null);
        try {
            const res = await fetch(`/api/github/repo/${owner}/${repo}`);
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
        badge: { fontSize: 11, background: "var(--color-background-info)", color: "var(--color-text-info)", borderRadius: 6, padding: "2px 8px", marginRight: 4, display: "inline-block" },
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
                <span style={{ fontSize: 20, fontWeight: 500 }}>github</span>
            </div>

            <div style={s.tabs}>
                {(["user", "repo"] as const).map((t) => (
                    <button key={t} style={tabStyle(tab === t)} onClick={() => { setTab(t); setError(""); setData(null); }}>{t}</button>
                ))}
            </div>

            {tab === "user" && (
                <div style={s.inputRow}>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                           placeholder="Username..." onKeyDown={(e) => e.key === "Enter" && loadUser()} style={{ flex: 1 }} />
                    <button onClick={loadUser}>{loading ? "..." : "Laden"}</button>
                </div>
            )}
            {tab === "repo" && (
                <div style={s.inputRow}>
                    <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)}
                           placeholder="Owner..." onKeyDown={(e) => e.key === "Enter" && loadRepo()} style={{ flex: 1 }} />
                    <input type="text" value={repo} onChange={(e) => setRepo(e.target.value)}
                           placeholder="Repo..." onKeyDown={(e) => e.key === "Enter" && loadRepo()} style={{ flex: 1 }} />
                    <button onClick={loadRepo}>{loading ? "..." : "Laden"}</button>
                </div>
            )}

            {error && <p style={{ color: "var(--color-text-danger)", fontSize: 13, marginBottom: 12 }}>{error}</p>}

            {data && (
                <>
                    <div style={{ ...s.tabs, marginBottom: 16 }}>
                        {["info", "raw"].map((t) => (
                            <button key={t} style={tabStyle(resultTab === t)} onClick={() => setResultTab(t)}>{t}</button>
                        ))}
                    </div>

                    {resultTab === "raw" && <pre style={s.pre}>{JSON.stringify(data, null, 2)}</pre>}

                    {resultTab === "info" && tab === "user" && (
                        <>
                            <div style={s.card}>
                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                    <img src={data.avatar_url} style={{ width: 64, height: 64, borderRadius: "50%", flexShrink: 0 }} alt="avatar" />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 18, fontWeight: 500 }}>{data.display_name || data.username}</div>
                                        <div style={{ fontSize: 13, ...s.muted }}>@{data.username}</div>
                                        {data.bio && <div style={{ fontSize: 13, marginTop: 6 }}>{data.bio}</div>}
                                    </div>
                                </div>
                            </div>
                            <div style={s.card}>
                                <InfoRow k="Repos" v={data.public_repos} />
                                <InfoRow k="Followers" v={data.followers} />
                                <InfoRow k="Following" v={data.following} />
                                {data.location && <InfoRow k="Location" v={data.location} />}
                                {data.company && <InfoRow k="Company" v={data.company} />}
                                {data.twitter && <InfoRow k="Twitter" v={`@${data.twitter}`} />}
                                {data.website && <InfoRow k="Website" v={<a href={data.website} target="_blank" rel="noreferrer" style={{ color: "var(--color-text-info)" }}>{data.website}</a>} />}
                                <InfoRow k="Dabei seit" v={new Date(data.created_at).toLocaleDateString("de-DE")} />
                            </div>
                            {data.top_repos?.length > 0 && (
                                <>
                                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8 }}>top repos</p>
                                    {data.top_repos.map((r: any) => (
                                        <div key={r.name} style={s.card}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                <div>
                                                    <a href={r.url} target="_blank" rel="noreferrer" style={{ fontWeight: 500, fontSize: 14, color: "var(--color-text-info)", textDecoration: "none" }}>{r.name}</a>
                                                    {r.description && <div style={{ fontSize: 12, ...s.muted, marginTop: 4 }}>{r.description}</div>}
                                                </div>
                                                <div style={{ display: "flex", gap: 12, fontSize: 12, ...s.muted, flexShrink: 0, marginLeft: 12 }}>
                                                    <span>★ {r.stars}</span>
                                                    <span>⑂ {r.forks}</span>
                                                </div>
                                            </div>
                                            {r.language && <span style={{ ...s.badge, marginTop: 8, display: "inline-block" }}>{r.language}</span>}
                                        </div>
                                    ))}
                                </>
                            )}
                        </>
                    )}

                    {resultTab === "info" && tab === "repo" && (
                        <>
                            <div style={s.card}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <a href={data.url} target="_blank" rel="noreferrer" style={{ fontSize: 18, fontWeight: 500, color: "var(--color-text-info)", textDecoration: "none" }}>{data.full_name}</a>
                                        {data.description && <div style={{ fontSize: 13, ...s.muted, marginTop: 6 }}>{data.description}</div>}
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                                    {data.topics?.map((t: string) => <span key={t} style={s.badge}>{t}</span>)}
                                </div>
                            </div>
                            <div style={s.card}>
                                <InfoRow k="Stars" v={data.stars.toLocaleString()} />
                                <InfoRow k="Forks" v={data.forks.toLocaleString()} />
                                <InfoRow k="Watchers" v={data.watchers.toLocaleString()} />
                                <InfoRow k="Open Issues" v={data.open_issues} />
                                <InfoRow k="Language" v={data.language ?? "—"} />
                                <InfoRow k="License" v={data.license ?? "—"} />
                                <InfoRow k="Default Branch" v={data.default_branch} />
                                <InfoRow k="Fork" v={data.is_fork ? "Ja" : "Nein"} />
                                <InfoRow k="Archiviert" v={data.is_archived ? "Ja" : "Nein"} />
                                <InfoRow k="Erstellt" v={new Date(data.created_at).toLocaleDateString("de-DE")} />
                                <InfoRow k="Aktualisiert" v={new Date(data.updated_at).toLocaleDateString("de-DE")} />
                            </div>
                        </>
                    )}
                </>
            )}
        </main>
    );
}