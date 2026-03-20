<div align="center">

# stack-api

**A modular, self-hosted API proxy built with Next.js.**  
Fetch data from Discord, GitHub, Twitch, Steam and NPM — all from one place.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/30jannik06/stack-api)

</div>

---

## Services

<table>
  <tr>
    <td><b>Discord</b></td>
    <td>User profiles, avatars, banners, presence, guilds, invites</td>
  </tr>
  <tr>
    <td><b>GitHub</b></td>
    <td>User profiles, repositories</td>
  </tr>
  <tr>
    <td><b>NPM</b></td>
    <td>Package info, version, download stats</td>
  </tr>
  <tr>
    <td><b>Twitch</b></td>
    <td>User profiles, live status, stream info</td>
  </tr>
  <tr>
    <td><b>Steam</b></td>
    <td>Player profiles, status, recently played games</td>
  </tr>
</table>

---

## Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/30jannik06/stack-api.git
cd stack-api
npm install
```

### 2. Environment Variables
```bash
cp .env.example .env.local
```

| Variable | Required | Where to get it |
|---|---|---|
| `DISCORD_BOT_TOKEN` | ✅ | [discord.com/developers](https://discord.com/developers/applications) |
| `GITHUB_TOKEN` | ⚠️ optional | [github.com/settings/tokens](https://github.com/settings/tokens) |
| `TWITCH_CLIENT_ID` | ✅ Twitch | [dev.twitch.tv/console](https://dev.twitch.tv/console) |
| `TWITCH_CLIENT_SECRET` | ✅ Twitch | [dev.twitch.tv/console](https://dev.twitch.tv/console) |
| `STEAM_API_KEY` | ✅ Steam | [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey) |

> `GITHUB_TOKEN` is optional but increases the rate limit from **60 → 5000 requests/hour**.

### 3. Run locally
```bash
npm run dev
```

### 4. Deploy to Vercel
```bash
npx vercel
```

Add your environment variables in **Vercel Dashboard → Project → Settings → Environment Variables**.

---

## API Reference

### Discord
```
GET /api/discord/user/:id
GET /api/discord/avatar/:id?size=256
GET /api/discord/banner/:id
GET /api/discord/banner/:id/redirect?size=600
GET /api/discord/presence/:id
GET /api/discord/guild/:id
GET /api/discord/invite/:code
```

> `/presence` requires the user to join [discord.gg/lanyard](https://discord.gg/lanyard)  
> `/guild/:id` requires your bot to be a member of that server

### GitHub
```
GET /api/github/user/:username
GET /api/github/repo/:owner/:repo
```

### NPM
```
GET /api/npm/:package
```

### Twitch
```
GET /api/twitch/user/:username
```

### Steam
```
GET /api/steam/user/:steamid
```

---

## Self-hosting

stack-api works on any platform that supports Next.js:

| Platform | Notes |
|---|---|
| **Vercel** | Recommended – zero config |
| **Railway** | Great for bots + API together |
| **Fly.io** | Free tier available |
| **VPS** | `npm run build && npm start` |

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for all releases.

---

## License

MIT © [30jannik06](https://github.com/30jannik06)