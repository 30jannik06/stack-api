export const runtime = "edge";

export async function GET() {
    return Response.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        services: {
            discord: !!process.env.DISCORD_BOT_TOKEN,
            github: !!process.env.GITHUB_TOKEN,
            twitch: !!(process.env.TWITCH_CLIENT_ID && process.env.TWITCH_CLIENT_SECRET),
            steam: !!process.env.STEAM_API_KEY,
        },
    });
}