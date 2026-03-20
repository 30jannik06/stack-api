"use client";
import { useState, useEffect } from "react";

type HealthData = {
    status: string;
    timestamp: string;
    services: {
        discord: boolean;
        github: boolean;
        twitch: boolean;
        steam: boolean;
    };
};

export default function HealthPage() {
    const [data, setData] = useState<HealthData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/health")
            .then((r) => r.json())
            .then((d) => { setData(d); setLoading(false); });
    }, []);

    const s: Record<string, React.CSSProperties> = {
        page: { maxWidth: 700, margin: "0 auto", padding: "2rem 1rem", fontFamily: "monospace", color: "var(--color-text-primary)" },
        card: { background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 12 },
        row: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, padding: "8px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" },
        lastRow: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, padding: "8px 0" },
    };

    return (
        <main style={s.page}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
                <a href="/" style={{ fontSize: 13, color: "var(--color-text-secondary)", textDecoration: "none" }}>← stack-api</a>
                <span style={{ color: "var(--color-text-secondary)" }}>/</span>
                <span style={{ fontSize: 20, fontWeight: 500 }}>health</span>
            </div>

            {loading ? (
                <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Laden...</p>
            ) : data ? (
                <>
                    <div style={s.card}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                            <span style={{ width: 10, height: 10, borderRadius: "50%", background: data.status === "ok" ? "#23a55a" : "#f23f43", display: "inline-block" }} />
                            <span style={{ fontWeight: 500, fontSize: 15 }}>{data.status === "ok" ? "All systems operational" : "Degraded"}</span>
                        </div>
                        <p style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                            Last checked: {new Date(data.timestamp).toLocaleString("de-DE")}
                        </p>
                    </div>

                    <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                        Services
                    </p>
                    <div style={s.card}>
                        {Object.entries(data.services).map(([service, active], i, arr) => (
                            <div key={service} style={i < arr.length - 1 ? s.row : s.lastRow}>
                                <span>{service}</span>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: active ? "#23a55a" : "#f23f43", display: "inline-block" }} />
                                    <span style={{ fontSize: 12, color: active ? "var(--color-text-success)" : "var(--color-text-danger)" }}>
                    {active ? "configured" : "missing key"}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 8 }}>
                        NPM is always available — no key required.
                    </p>
                </>
            ) : (
                <p style={{ fontSize: 13, color: "var(--color-text-danger)" }}>Fehler beim Laden.</p>
            )}
        </main>
    );
}