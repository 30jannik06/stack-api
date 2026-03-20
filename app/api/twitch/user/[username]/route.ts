import { getTwitchToken } from "../../token/route";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;

    if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
        return Response.json({ error: "Twitch credentials not set" }, { status: 500 });
    }

    const token = await getTwitchToken();

    const headers = {
        "Client-ID": process.env.TWITCH_CLIENT_ID!,
        Authorization: `Bearer ${token}`,
    };

    const [userRes, streamRes] = await Promise.all([
        fetch(`https://api.twitch.tv/helix/users?login=${username}`, { headers, next: { revalidate: 60 } }),
        fetch(`https://api.twitch.tv/helix/streams?user_login=${username}`, { headers, next: { revalidate: 30 } }),
    ]);

    if (!userRes.ok) {
        return Response.json({ error: "Twitch API error" }, { status: userRes.status });
    }

    const userData = await userRes.json();
    const user = userData.data?.[0];

    if (!user) {
        return Response.json({ error: "User not found" }, { status: 404 });
    }

    const streamData = await streamRes.json();
    const stream = streamData.data?.[0] ?? null;

    return Response.json({
        id: user.id,
        username: user.login,
        display_name: user.display_name,
        bio: user.description ?? null,
        profile_image_url: user.profile_image_url,
        offline_image_url: user.offline_image_url ?? null,
        view_count: user.view_count,
        created_at: user.created_at,
        is_live: !!stream,
        stream: stream ? {
            title: stream.title,
            game: stream.game_name,
            viewers: stream.viewer_count,
            started_at: stream.started_at,
            thumbnail_url: stream.thumbnail_url
                .replace("{width}", "640")
                .replace("{height}", "360"),
            tags: stream.tags ?? [],
        } : null,
    }, {
        headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
}