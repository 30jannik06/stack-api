"use client";
import { useState } from "react";

type Tab = "user" | "guild" | "invite";

export default function DiscordPage() {
    const [tab, setTab] = useState<Tab>("user");
    const [userId, setUserId] = useState("");
    const [guildId, setGuildId] = useState("");
    const [inviteCode, setInviteCode] = useState("");
    const [userData, setUserData] = useState<any>(null);
    const [presenceData, setPresenceData] = useState<any>(null);
    const [guildData, setGuildData] = useState<any>(null);
    const [inviteData, setInviteData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resultTab, setResultTab] = useState("info");

    async function loadUser() {
        if (!userId.trim()) return;
        setLoading(true); setError(""); setUserData(null); setPresenceData(null);
        try {
            const [userRes, presenceRes] = await Promise.allSettled([
                fetch(`/api/discord/user/${userId}`),
                fetch(`/api/discord/presence/${userId}`),
            ]);
            if (userRes.status === "rejected" || !userRes.value.ok) {
                const err = userRes.status === "fulfilled" ? await userRes.value.json() : {};
                throw new Error(err.error || "Fehler beim Laden");
            }
            setUserData(await userRes.value.json());
            setPresenceData(
                presenceRes.status === "fulfilled" && presenceRes.value.ok
                    ? await presenceRes.value.json() : null
            );
            setResultTab("info");
        } catch (e: any) { setError(e.message); }
        finally { setLoading(false); }
    }

    async function loadGuild() {
        if (!guildId.trim()) return;
        setLoading(true); setError(""); setGuildData(null);
        try {
            const res = await fetch(`/api/discord/guild/${guildId}`);
            if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Fehler"); }
            setGuildData(await res.json());
            setResultTab("info");
        } catch (e: any) { setError(e.message); }
        finally { setLoading(false); }
    }

    async function loadInvite() {
        if (!inviteCode.trim()) return;
        setLoading(true); setError(""); setInviteData(null);
        try {
            const code = inviteCode.replace("https://discord.gg/", "").replace("discord.gg/", "").trim();
            const res = await fetch(`/api/discord/invite/${code}`);
            if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Fehler"); }
            setInviteData(await res.json());
            setResultTab("info");
        } catch (e: any) { setError(e.message); }
        finally { setLoading(false); }
    }

    const s: Record<string, React.CSSProperties> = {
        page: { maxWidth: 700, margin: "0 auto", padding: "2rem 1rem", fontFamily: "monospace", color: "var(--color-text-primary)" },
        tabs: { display: "flex", gap: 8, marginBottom: "1.5rem" },
        inputRow: { display: "flex", gap: 8, marginBottom: "1.5rem" },
        card: {
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 12,
        },
        infoRow: {
            display: "flex", justifyContent: "space-between", fontSize: 13,
            padding: "5px 0", borderBottom: "0.5px solid var(--color-border-tertiary)",
            gap: 12, wordBreak: "break-all",
        },
        muted: { color: "var(--color-text-secondary)" },
        pre: {
            background: "var(--color-background-secondary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: 8, padding: 12, fontSize: 12, overflow: "auto", maxHeight: 400,
        },
        badge: {
            fontSize: 11, background: "var(--color-background-info)",
            color: "var(--color-text-info)", borderRadius: 6,
            padding: "2px 8px", marginRight: 4, display: "inline-block",
        },
        sectionLabel: { fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8, marginTop: 16 },
        get: {
            fontSize: 11, fontWeight: 500, padding: "2px 7px", borderRadius: 4,
            background: "var(--color-background-success)", color: "var(--color-text-success)",
        },
    };

    function tabStyle(active: boolean): React.CSSProperties {
        return {
            padding: "6px 16px", fontSize: 13, borderRadius: 8,
            border: "0.5px solid var(--color-border-secondary)", cursor: "pointer",
            background: active ? "var(--color-background-secondary)" : "transparent",
            color: active ? "var(--color-text-primary)" : "var(--color-text-secondary)",
        };
    }

    const statusColors: Record<string, string> = {
        online: "#23a55a", idle: "#f0b232", dnd: "#f23f43", offline: "#80848e",
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
                <span style={{ fontSize: 20, fontWeight: 500 }}>discord</span>
            </div>

            <div style={s.tabs}>
                {(["user", "guild", "invite"] as Tab[]).map((t) => (
                    <button key={t} style={tabStyle(tab === t)} onClick={() => { setTab(t); setError(""); }}>
                        {t}
                    </button>
                ))}
            </div>

            {tab === "user" && (
                <div style={s.inputRow}>
                    <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)}
                           placeholder="User ID..." onKeyDown={(e) => e.key === "Enter" && loadUser()} style={{ flex: 1 }} />
                    <button onClick={loadUser}>{loading ? "..." : "Laden"}</button>
                </div>
            )}
            {tab === "guild" && (
                <div style={s.inputRow}>
                    <input type="text" value={guildId} onChange={(e) => setGuildId(e.target.value)}
                           placeholder="Guild ID..." onKeyDown={(e) => e.key === "Enter" && loadGuild()} style={{ flex: 1 }} />
                    <button onClick={loadGuild}>{loading ? "..." : "Laden"}</button>
                </div>
            )}
            {tab === "invite" && (
                <div style={s.inputRow}>
                    <input type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)}
                           placeholder="discord.gg/... oder Code..." onKeyDown={(e) => e.key === "Enter" && loadInvite()} style={{ flex: 1 }} />
                    <button onClick={loadInvite}>{loading ? "..." : "Laden"}</button>
                </div>
            )}

            {error && <p style={{ color: "var(--color-text-danger)", fontSize: 13, marginBottom: 12 }}>{error}</p>}

            {(userData || guildData || inviteData) && (
                <>
                    <div style={{ ...s.tabs, marginBottom: 16 }}>
                        {["info", "raw"].map((t) => (
                            <button key={t} style={tabStyle(resultTab === t)} onClick={() => setResultTab(t)}>{t}</button>
                        ))}
                        {tab === "user" && userData && (
                            <button style={tabStyle(resultTab === "presence")} onClick={() => setResultTab("presence")}>presence</button>
                        )}
                    </div>

                    {resultTab === "raw" && (
                        <pre style={s.pre}>
              {JSON.stringify(userData || guildData || inviteData, null, 2)}
            </pre>
                    )}

                    {resultTab === "info" && tab === "user" && userData && (
                        <>
                            <div style={s.card}>
                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                    <img src={userData.avatar.url} style={{ width: 64, height: 64, borderRadius: "50%", flexShrink: 0 }} alt="avatar" />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 18, fontWeight: 500 }}>{userData.global_name || userData.username}</div>
                                        <div style={{ fontSize: 13, ...s.muted }}>@{userData.username}</div>
                                        <div style={{ marginTop: 6 }}>
                                            {userData.badges?.map((b: string) => (
                                                <span key={b} style={s.badge}>{b.replace(/_/g, " ").toLowerCase()}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {userData.banner?.url && (
                                    <img src={userData.banner.url} style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 8, marginTop: 12 }} alt="banner" />
                                )}
                            </div>
                            <div style={s.card}>
                                <InfoRow k="ID" v={userData.id} />
                                <InfoRow k="Bot" v={userData.bot ? "Ja" : "Nein"} />
                                <InfoRow k="Public Flags" v={userData.public_flags} />
                                <InfoRow k="Avatar animiert" v={userData.avatar.is_animated ? "Ja" : "Nein"} />
                                <InfoRow k="Avatar 256px" v={<span style={{ color: "var(--color-text-info)", fontSize: 11 }}>{userData.avatar.url}</span>} />
                                <InfoRow k="Avatar 512px" v={<span style={{ color: "var(--color-text-info)", fontSize: 11 }}>{userData.avatar.url_512}</span>} />
                                {userData.banner?.color && (
                                    <InfoRow k="Banner Farbe" v={
                                        <span style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                      <span style={{ width: 12, height: 12, borderRadius: 3, background: "#" + userData.banner.color.toString(16).padStart(6, "0"), display: "inline-block" }} />
                                            {"#" + userData.banner.color.toString(16).padStart(6, "0")}
                    </span>
                                    } />
                                )}
                            </div>
                        </>
                    )}

                    {resultTab === "presence" && tab === "user" && (
                        <>
                            {!presenceData ? (
                                <div style={s.card}>
                                    <p style={{ fontSize: 13, ...s.muted }}>
                                        Nutzer nicht auf Lanyard –{" "}
                                        <a href="https://discord.gg/lanyard" target="_blank" rel="noreferrer" style={{ color: "var(--color-text-info)" }}>
                                            discord.gg/lanyard
                                        </a> beitreten.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div style={s.card}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                                            <span style={{ width: 10, height: 10, borderRadius: "50%", background: statusColors[presenceData.discord_status] || "#80848e", display: "inline-block" }} />
                                            <span style={{ fontWeight: 500 }}>{presenceData.discord_status}</span>
                                        </div>
                                        <InfoRow k="Desktop" v={presenceData.active_on_discord_desktop ? "aktiv" : "—"} />
                                        <InfoRow k="Mobile" v={presenceData.active_on_discord_mobile ? "aktiv" : "—"} />
                                        <InfoRow k="Web" v={presenceData.active_on_discord_web ? "aktiv" : "—"} />
                                    </div>
                                    {presenceData.listening_to_spotify && presenceData.spotify && (
                                        <div style={s.card}>
                                            <p style={s.sectionLabel}>spotify</p>
                                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                                {presenceData.spotify.album_art_url && (
                                                    <img src={presenceData.spotify.album_art_url} style={{ width: 48, height: 48, borderRadius: 6 }} alt="art" />
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: 500 }}>{presenceData.spotify.song}</div>
                                                    <div style={{ fontSize: 12, ...s.muted }}>{presenceData.spotify.artist}</div>
                                                    <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{presenceData.spotify.album}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {presenceData.activities?.map((a: any) => (
                                        <div key={a.id} style={s.card}>
                                            <div style={{ fontWeight: 500, fontSize: 13 }}>{a.name}</div>
                                            {a.details && <div style={{ fontSize: 12, ...s.muted, marginTop: 4 }}>{a.details}</div>}
                                            {a.state && <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{a.state}</div>}
                                        </div>
                                    ))}
                                </>
                            )}
                        </>
                    )}

                    {resultTab === "info" && tab === "guild" && guildData && (
                        <>
                            <div style={s.card}>
                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                    {guildData.icon.url
                                        ? <img src={guildData.icon.url} style={{ width: 64, height: 64, borderRadius: 12, flexShrink: 0 }} alt="icon" />
                                        : <div style={{ width: 64, height: 64, borderRadius: 12, background: "var(--color-background-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, color: "var(--color-text-secondary)" }}>{guildData.name[0]}</div>
                                    }
                                    <div>
                                        <div style={{ fontSize: 18, fontWeight: 500 }}>{guildData.name}</div>
                                        {guildData.description && <div style={{ fontSize: 13, ...s.muted, marginTop: 4 }}>{guildData.description}</div>}
                                        <div style={{ marginTop: 6 }}>
                                            {guildData.features?.slice(0, 4).map((f: string) => (
                                                <span key={f} style={s.badge}>{f.replace(/_/g, " ").toLowerCase()}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {guildData.banner.url && (
                                    <img src={guildData.banner.url} style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 8, marginTop: 12 }} alt="banner" />
                                )}
                            </div>
                            <div style={s.card}>
                                <InfoRow k="ID" v={guildData.id} />
                                <InfoRow k="Mitglieder" v={guildData.member_count?.toLocaleString() ?? "—"} />
                                <InfoRow k="Online" v={guildData.online_count?.toLocaleString() ?? "—"} />
                                <InfoRow k="Owner ID" v={guildData.owner_id} />
                                <InfoRow k="Boost Level" v={`Tier ${guildData.premium_tier}`} />
                                <InfoRow k="Boosts" v={guildData.premium_subscription_count} />
                                <InfoRow k="Vanity URL" v={guildData.vanity_url_code ? `discord.gg/${guildData.vanity_url_code}` : "—"} />
                                <InfoRow k="Locale" v={guildData.preferred_locale} />
                            </div>
                        </>
                    )}

                    {resultTab === "info" && tab === "invite" && inviteData && (
                        <>
                            {inviteData.guild && (
                                <div style={s.card}>
                                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                        {inviteData.guild.icon
                                            ? <img src={inviteData.guild.icon} style={{ width: 56, height: 56, borderRadius: 12, flexShrink: 0 }} alt="icon" />
                                            : <div style={{ width: 56, height: 56, borderRadius: 12, background: "var(--color-background-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, color: "var(--color-text-secondary)" }}>{inviteData.guild.name[0]}</div>
                                        }
                                        <div>
                                            <div style={{ fontSize: 17, fontWeight: 500 }}>{inviteData.guild.name}</div>
                                            {inviteData.guild.description && <div style={{ fontSize: 13, ...s.muted, marginTop: 2 }}>{inviteData.guild.description}</div>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div style={s.card}>
                                <InfoRow k="Code" v={inviteData.code} />
                                <InfoRow k="Mitglieder" v={inviteData.member_count?.toLocaleString() ?? "—"} />
                                <InfoRow k="Online" v={inviteData.online_count?.toLocaleString() ?? "—"} />
                                <InfoRow k="Channel" v={inviteData.channel ? `#${inviteData.channel.name}` : "—"} />
                                <InfoRow k="Läuft ab" v={inviteData.expires_at ? new Date(inviteData.expires_at).toLocaleString("de-DE") : "Nie"} />
                                {inviteData.inviter && <InfoRow k="Erstellt von" v={`@${inviteData.inviter.username}`} />}
                            </div>
                        </>
                    )}
                </>
            )}
        </main>
    );
}