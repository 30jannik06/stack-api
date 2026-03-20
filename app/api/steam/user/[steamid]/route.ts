const STEAM_API = "https://api.steampowered.com";
const KEY = () => process.env.STEAM_API_KEY;

export async function GET(_request: Request, { params }: { params: Promise<{ steamid: string }> }) {
  const { steamid } = await params;

  if (!KEY()) {
    return Response.json({ error: "STEAM_API_KEY is not set" }, { status: 500 });
  }
  if (!/^\d{17}$/.test(steamid)) {
    return Response.json({ error: "Invalid SteamID64" }, { status: 400 });
  }

  const [summaryRes, gamesRes] = await Promise.all([
    fetch(`${STEAM_API}/ISteamUser/GetPlayerSummaries/v2/?key=${KEY()}&steamids=${steamid}`, {
      next: { revalidate: 60 },
    }),
    fetch(
      `${STEAM_API}/IPlayerService/GetRecentlyPlayedGames/v1/?key=${KEY()}&steamid=${steamid}&count=5`,
      { next: { revalidate: 60 } }
    ),
  ]);

  if (!summaryRes.ok) {
    return Response.json({ error: "Steam API error" }, { status: summaryRes.status });
  }

  const summaryData = await summaryRes.json();
  const player = summaryData.response?.players?.[0];

  if (!player) {
    return Response.json({ error: "Player not found" }, { status: 404 });
  }

  const gamesData = gamesRes.ok ? await gamesRes.json() : null;
  const recentGames = gamesData?.response?.games ?? [];

  const visibilityMap: Record<number, string> = { 1: "private", 2: "friends_only", 3: "public" };
  const statusMap: Record<number, string> = {
    0: "offline",
    1: "online",
    2: "busy",
    3: "away",
    4: "snooze",
    5: "looking_to_trade",
    6: "looking_to_play",
  };

  return Response.json(
    {
      steamid: player.steamid,
      username: player.personaname,
      profile_url: player.profileurl,
      avatar: {
        small: player.avatar,
        medium: player.avatarmedium,
        large: player.avatarfull,
      },
      status: statusMap[player.personastate] ?? "offline",
      visibility: visibilityMap[player.communityvisibilitystate] ?? "private",
      currently_playing: player.gameextrainfo ?? null,
      currently_playing_appid: player.gameid ?? null,
      country: player.loccountrycode ?? null,
      created_at: player.timecreated ? new Date(player.timecreated * 1000).toISOString() : null,
      last_online: player.lastlogoff ? new Date(player.lastlogoff * 1000).toISOString() : null,
      recent_games: recentGames.map((g: any) => ({
        appid: g.appid,
        name: g.name,
        playtime_2weeks_hours: Math.round((g.playtime_2weeks / 60) * 10) / 10,
        playtime_total_hours: Math.round((g.playtime_forever / 60) * 10) / 10,
        icon_url: `https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`,
      })),
    },
    {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    }
  );
}
