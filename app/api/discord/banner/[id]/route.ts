const DISCORD_API = "https://discord.com/api/v10";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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
    return Response.json({
      has_banner: false,
      color: user.accent_color ?? null,
    });
  }

  const ext = user.banner.startsWith("a_") ? "gif" : "png";
  const url = `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${ext}?size=600`;
  const url_1024 = `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${ext}?size=1024`;

  return Response.json(
    {
      has_banner: true,
      hash: user.banner,
      url,
      url_1024,
      is_animated: user.banner.startsWith("a_"),
      color: user.accent_color ?? null,
    },
    {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    }
  );
}
