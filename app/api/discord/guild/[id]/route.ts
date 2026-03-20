const DISCORD_API = "https://discord.com/api/v10";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

function buildIconUrl(guildId: string, iconHash: string | null): string | null {
    if (!iconHash) return null;
    const ext = iconHash.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.${ext}?size=256`;
}

function buildSplashUrl(guildId: string, splashHash: string | null): string | null {
    if (!splashHash) return null;
    return `https://cdn.discordapp.com/splashes/${guildId}/${splashHash}.png?size=1024`;
}

function buildBannerUrl(guildId: string, bannerHash: string | null): string | null {
    if (!bannerHash) return null;
    const ext = bannerHash.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/banners/${guildId}/${bannerHash}.${ext}?size=600`;
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!BOT_TOKEN) {
        return Response.json({ error: "DISCORD_BOT_TOKEN is not set" }, { status: 500 });
    }
    if (!/^\d{17,19}$/.test(id)) {
        return Response.json({ error: "Invalid Guild ID" }, { status: 400 });
    }

    const res = await fetch(`${DISCORD_API}/guilds/${id}?with_counts=true`, {
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return Response.json(
            { error: err.message || "Discord API error", code: err.code },
            { status: res.status }
        );
    }

    const g = await res.json();

    return Response.json({
        id: g.id,
        name: g.name,
        description: g.description ?? null,
        icon: {
            hash: g.icon,
            url: buildIconUrl(g.id, g.icon),
            is_animated: g.icon?.startsWith("a_") ?? false,
        },
        splash: {
            hash: g.splash,
            url: buildSplashUrl(g.id, g.splash),
        },
        banner: {
            hash: g.banner,
            url: buildBannerUrl(g.id, g.banner),
        },
        owner_id: g.owner_id,
        verification_level: g.verification_level,
        nsfw_level: g.nsfw_level,
        premium_tier: g.premium_tier,
        premium_subscription_count: g.premium_subscription_count ?? 0,
        member_count: g.approximate_member_count ?? null,
        online_count: g.approximate_presence_count ?? null,
        features: g.features ?? [],
        preferred_locale: g.preferred_locale,
        vanity_url_code: g.vanity_url_code ?? null,
        raw: g,
    }, {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
}