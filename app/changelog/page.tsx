const changelog = [
  {
    version: "0.1.0",
    date: "2026-03-20",
    changes: {
      added: [
        "Discord: User profile, avatar, banner, presence, guild, invite endpoints",
        "GitHub: User profile, repository endpoints",
        "NPM: Package info + download stats",
        "Twitch: User profile + live status",
        "Steam: Player profile + recently played games",
        "Preview pages for all services (/discord, /github, /npm, /twitch, /steam)",
        "Landing page with all endpoints listed",
        "/api/health endpoint",
        "Vercel deployment config (vercel.json)",
      ],
    },
  },
];

const tagStyle: Record<string, React.CSSProperties> = {
  added: { background: "var(--color-background-success)", color: "var(--color-text-success)" },
  changed: { background: "var(--color-background-warning)", color: "var(--color-text-warning)" },
  fixed: { background: "var(--color-background-info)", color: "var(--color-text-info)" },
  removed: { background: "var(--color-background-danger)", color: "var(--color-text-danger)" },
};

export default function ChangelogPage() {
  return (
    <main
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: "2rem 1rem",
        fontFamily: "monospace",
        color: "var(--color-text-primary)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
        <a
          href="/"
          style={{ fontSize: 13, color: "var(--color-text-secondary)", textDecoration: "none" }}
        >
          ← stack-api
        </a>
        <span style={{ color: "var(--color-text-secondary)" }}>/</span>
        <span style={{ fontSize: 20, fontWeight: 500 }}>changelog</span>
      </div>

      {changelog.map((release) => (
        <div key={release.version} style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 16, fontWeight: 500 }}>v{release.version}</span>
            <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
              {release.date}
            </span>
          </div>

          {(Object.entries(release.changes) as [string, string[]][]).map(([type, items]) => (
            <div key={type} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    padding: "2px 8px",
                    borderRadius: 4,
                    ...tagStyle[type],
                  }}
                >
                  {type}
                </span>
              </div>
              <div
                style={{
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                {items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "9px 14px",
                      fontSize: 13,
                      borderBottom:
                        i < items.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none",
                      background: "var(--color-background-primary)",
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}
