const DISCORD_API = "https://discord.com/api/v10";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    const { code } = await params;

    if (!code || code.length < 2) {
        return Response.json({ error: "Invalid invite code" }, { status: 400 });
    }

    const res = await fetch(
        `${DISCORD_API}/invites/${code}?with_counts=true&with_expiration=true`,
        { next: { revalidate: 30 } }
    );

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return Response.json(
            { error: err.message || "Invalid or expired invite" },
            { status: res.status }
        );
    }

    const inv = await res.json();
    const g = inv.guild;
    const ch = inv.channel;

    return Response.json({
        code: inv.code,
        expires_at: inv.expires_at ?? null,
        member_count: inv.approximate_member_count ?? null,
        online_count: inv.approximate_presence_count ?? null,
        guild: g ? {
            id: g.id,
            name: g.name,
            description: g.description ?? null,
            icon: g.icon
                ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.${g.icon.startsWith("a_") ? "gif" : "png"}?size=256`
                : null,
            splash: g.splash
                ? `https://cdn.discordapp.com/splashes/${g.id}/${g.splash}.png?size=1024`
                : null,
            banner: g.banner
                ? `https://cdn.discordapp.com/banners/${g.id}/${g.banner}.png?size=600`
                : null,
            premium_tier: g.premium_tier,
            nsfw: g.nsfw,
            features: g.features ?? [],
            vanity_url_code: g.vanity_url_code ?? null,
            verification_level: g.verification_level,
        } : null,
        channel: ch ? {
            id: ch.id,
            name: ch.name,
            type: ch.type,
        } : null,
        inviter: inv.inviter ? {
            id: inv.inviter.id,
            username: inv.inviter.username,
            avatar: inv.inviter.avatar
                ? `https://cdn.discordapp.com/avatars/${inv.inviter.id}/${inv.inviter.avatar}.png?size=128`
                : null,
        } : null,
        raw: inv,
    }, {
        headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
}