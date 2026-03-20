export const changelog = [
    {
        version: "0.3.0",
        date: "2026-03-20",
        changes: {
            added: [
                "/health page – visual health check for all configured services",
                "Discord: avatar_decoration field added to /api/discord/user/:id and /api/discord/profile/:id",
            ],
        },
    },
    {
        version: "0.2.0",
        date: "2026-03-20",
        changes: {
            added: [
                "Discord: /api/discord/profile/:id – combined profile + presence in a single request",
            ],
        },
    },
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