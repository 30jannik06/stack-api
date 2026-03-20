const LANYARD_API = "https://api.lanyard.rest/v1/users";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!/^\d{17,19}$/.test(id)) {
    return Response.json({ error: "Invalid Discord user ID" }, { status: 400 });
  }

  const res = await fetch(`${LANYARD_API}/${id}`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return Response.json(
        { error: "User not found on Lanyard. They must join discord.gg/lanyard first." },
        { status: 404 }
      );
    }
    return Response.json({ error: "Lanyard API error" }, { status: res.status });
  }

  const { data } = await res.json();

  return Response.json(
    {
      discord_status: data.discord_status, // online | idle | dnd | offline
      active_on_discord_mobile: data.active_on_discord_mobile,
      active_on_discord_desktop: data.active_on_discord_desktop,
      active_on_discord_web: data.active_on_discord_web,
      listening_to_spotify: data.listening_to_spotify,
      spotify: data.spotify
        ? {
            song: data.spotify.song,
            artist: data.spotify.artist,
            album: data.spotify.album,
            album_art_url: data.spotify.album_art_url,
            track_id: data.spotify.track_id,
            timestamps: data.spotify.timestamps,
          }
        : null,
      activities: data.activities?.map((a: any) => ({
        id: a.id,
        name: a.name,
        type: a.type,
        state: a.state ?? null,
        details: a.details ?? null,
        emoji: a.emoji ?? null,
        timestamps: a.timestamps ?? null,
      })),
      discord_user: data.discord_user,
    },
    {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    }
  );
}
