const DISCORD_API = "https://discord.com/api/v10";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const size = new URL(request.url).searchParams.get("size") || "600";

    if (!BOT_TOKEN) {
        return Response.json({ error: "DISCORD_BOT_TOKEN is not set" }, { status: 500 });
    }
    if (!/^\d{17,19}$/.test(id)) {
        return Response.json({ error: "Invalid Discord user ID" }, { status: 400 });
    }

    const res = await fetch(`${DISCORD_API}/users/${id}`, {
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        return Response.json({ error: "User not found" }, { status: res.status });
    }

    const user = await res.json();

    if (!user.banner) {
        return Response.json({ error: "User has no banner" }, { status: 404 });
    }

    const ext = user.banner.startsWith("a_") ? "gif" : "png";
    const bannerUrl = `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${ext}?size=${size}`;

    return Response.redirect(bannerUrl, 302);
}