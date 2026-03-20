const DISCORD_API = "https://discord.com/api/v10";
const LANYARD_API = "https://api.lanyard.rest/v1/users";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

function buildAvatarUrl(userId: string, avatarHash: string | null, size = 256): string {
    if (!avatarHash) {
        const defaultIndex = parseInt(userId.slice(-4), 10) % 6;
        return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
    }
    const ext = avatarHash.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${ext}?size=${size}`;
}

function buildBannerUrl(userId: string, bannerHash: string | null): string | null {
    if (!bannerHash) return null;
    const ext = bannerHash.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/banners/${userId}/${bannerHash}.${ext}?size=600`;
}

function buildAvatarDecorationUrl(asset: string | null, size = 256): string | null {
    if (!asset) return null;
    return `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.png?size=${size}&passthrough=true`;
}

function parsePublicFlags(flags: number): string[] {
    const FLAGS: Record<string, number> = {
        STAFF: 1 << 0,
        PARTNER: 1 << 1,
        HYPESQUAD: 1 << 2,
        BUG_HUNTER_LEVEL_1: 1 << 3,
        HYPESQUAD_ONLINE_HOUSE_1: 1 << 6,
        HYPESQUAD_ONLINE_HOUSE_2: 1 << 7,
        HYPESQUAD_ONLINE_HOUSE_3: 1 << 8,
        PREMIUM_EARLY_SUPPORTER: 1 << 9,
        BUG_HUNTER_LEVEL_2: 1 << 14,
        VERIFIED_BOT: 1 << 16,
        VERIFIED_DEVELOPER: 1 << 17,
        CERTIFIED_MODERATOR: 1 << 18,
        ACTIVE_DEVELOPER: 1 << 22,
    };
    return Object.entries(FLAGS)
        .filter(([, value]) => (flags & value) === value)
        .map(([key]) => key);
}

export async function GET(
    _request: Request,
    {params}: { params: Promise<{ id: string }> }
) {
    const {id} = await params;

    if (!BOT_TOKEN) {
        return Response.json({error: "DISCORD_BOT_TOKEN is not set"}, {status: 500});
    }
    if (!/^\d{17,19}$/.test(id)) {
        return Response.json({error: "Invalid Discord user ID"}, {status: 400});
    }

    const [userRes, presenceRes] = await Promise.allSettled([
        fetch(`${DISCORD_API}/users/${id}`, {
            headers: {Authorization: `Bot ${BOT_TOKEN}`},
            next: {revalidate: 60},
        }),
        fetch(`${LANYARD_API}/${id}`, {
            next: {revalidate: 30},
        }),
    ]);

    if (userRes.status === "rejected" || !userRes.value.ok) {
        return Response.json({error: "User not found"}, {status: 404});
    }

    const user = await userRes.value.json();

    let presence = null;
    if (presenceRes.status === "fulfilled" && presenceRes.value.ok) {
        const lanyardData = await presenceRes.value.json();
        const d = lanyardData.data;
        presence = {
            discord_status: d.discord_status,
            active_on_discord_mobile: d.active_on_discord_mobile,
            active_on_discord_desktop: d.active_on_discord_desktop,
            active_on_discord_web: d.active_on_discord_web,
            listening_to_spotify: d.listening_to_spotify,
            spotify: d.spotify ?? null,
            activities: d.activities ?? [],
        };
    }

    return Response.json({
        id: user.id,
        username: user.username,
        global_name: user.global_name ?? null,
        avatar: {
            hash: user.avatar,
            url: buildAvatarUrl(user.id, user.avatar, 256),
            url_512: buildAvatarUrl(user.id, user.avatar, 512),
            is_animated: user.avatar?.startsWith("a_") ?? false,
        },
        avatar_decoration: user.avatar_decoration_data ? {
            asset: user.avatar_decoration_data.asset,
            sku_id: user.avatar_decoration_data.sku_id,
            url: buildAvatarDecorationUrl(user.avatar_decoration_data.asset, 256),
            url_512: buildAvatarDecorationUrl(user.avatar_decoration_data.asset, 512),
        } : null,
        banner: {
            hash: user.banner ?? null,
            url: buildBannerUrl(user.id, user.banner),
            color: user.accent_color ?? null,
        },
        bot: user.bot ?? false,
        public_flags: user.public_flags ?? 0,
        badges: parsePublicFlags(user.public_flags ?? 0),
        presence,
    }, {
        headers: {"Cache-Control": "public, s-maxage=30, stale-while-revalidate=60"},
    });
}