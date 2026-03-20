const DISCORD_API = "https://discord.com/api/v10";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const size = new URL(request.url).searchParams.get("size") || "256";

    if (!BOT_TOKEN) {
        return Response.json({ error: "DISCORD_BOT_TOKEN is not set" }, { status: 500 });
    }
    if (!/^\d{17,19}$/.test(id)) {
        return Response.json({ error: "Invalid Discord user ID" }, { status: 400 });
    }

    const res = await fetch(`${DISCORD_API}/users/${id}`, {
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
        next: { revalidate: 300 },
    });

    if (!res.ok) {
        return Response.json({ error: "User not found" }, { status: res.status });
    }

    const user = await res.json();

    let avatarUrl: string;
    if (user.avatar) {
        const ext = user.avatar.startsWith("a_") ? "gif" : "png";
        avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=${size}`;
    } else {
        const defaultIndex = (BigInt(user.id) >> 22n) % 6n;
        avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
    }

    return Response.redirect(avatarUrl, 302);
}
