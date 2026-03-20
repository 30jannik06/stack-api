import Link from "next/link";

const services = [
  {
    name: "discord",
    href: "/discord",
    endpoints: [
        {path: "/api/discord/user/:id", desc: "User profile, avatar, banner, badges"},
        {path: "/api/discord/profile/:id", desc: "Full profile + presence in one request"},
        {path: "/api/discord/avatar/:id", desc: "Redirect to avatar on Discord CDN"},
        {path: "/api/discord/banner/:id", desc: "Banner info as JSON"},
        {path: "/api/discord/banner/:id/redirect", desc: "Redirect to banner on Discord CDN"},
        {path: "/api/discord/presence/:id", desc: "Status, Spotify, activities via Lanyard"},
        {path: "/api/discord/guild/:id", desc: "Server info, member count, features"},
        {path: "/api/discord/invite/:code", desc: "Resolve invite link"},
    ],
  },
  {
    name: "github",
    href: "/github",
    endpoints: [
      { path: "/api/github/user/:username", desc: "Profile, bio, top repos" },
      { path: "/api/github/repo/:owner/:repo", desc: "Repo info, stars, topics" },
    ],
  },
  {
    name: "npm",
    href: "/npm",
    endpoints: [{ path: "/api/npm/:package", desc: "Package info, version, downloads" }],
  },
  {
    name: "twitch",
    href: "/twitch",
    endpoints: [{ path: "/api/twitch/user/:username", desc: "Profile, live status, stream info" }],
  },
  {
    name: "steam",
    href: "/steam",
    endpoints: [{ path: "/api/steam/user/:steamid", desc: "Profile, status, recently played" }],
  },
];

export default function Home() {
  return (
    <main
      style={{ maxWidth: 640, margin: "0 auto", padding: "2.5rem 1rem", fontFamily: "monospace" }}
    >
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 6 }}>stack-api</h1>
        <p style={{ fontSize: 14, color: "#888", marginBottom: "1.5rem" }}>
          A modular, self-hosted API proxy. Open source.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <a
            href="https://github.com/30jannik06/stack-api"
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 13,
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid #333",
              color: "inherit",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
            </svg>
            GitHub
          </a>
          <Link
            href="/changelog"
            style={{
              fontSize: 13,
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid #333",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Changelog
          </Link>
            <Link
                href="/health"
                style={{
                    fontSize: 13,
                    padding: "6px 14px",
                    borderRadius: 8,
                    border: "1px solid #333",
                    color: "inherit",
                    textDecoration: "none"
                }}
            >
                Health
            </Link>
        </div>
      </div>

      {services.map((service) => (
        <div key={service.name} style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#888",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {service.name}
            </p>
            <Link
              href={service.href}
              style={{ fontSize: 12, color: "#666", textDecoration: "none" }}
            >
              Try it →
            </Link>
          </div>
          <div style={{ border: "1px solid #222", borderRadius: 12, overflow: "hidden" }}>
            {service.endpoints.map((e, i) => (
              <div
                key={e.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderBottom: i < service.endpoints.length - 1 ? "1px solid #1a1a1a" : "none",
                  background: "#111",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    padding: "2px 7px",
                    borderRadius: 4,
                    background: "#0d2e1a",
                    color: "#4ade80",
                    flexShrink: 0,
                  }}
                >
                  GET
                </span>
                <div>
                  <div style={{ fontFamily: "monospace", fontSize: 13 }}>{e.path}</div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{e.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div
        style={{
          borderTop: "1px solid #1a1a1a",
          paddingTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 13, color: "#666" }}>
          made by{" "}
          <a
            href="https://github.com/30jannik06"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            @30jannik06
          </a>
        </span>
        <span style={{ fontSize: 12, color: "#444", fontFamily: "monospace" }}>v0.1.0</span>
      </div>
    </main>
  );
}
