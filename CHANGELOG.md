# Changelog

All notable changes to stack-api will be documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.3.0] – 2026-03-20

### Added
- `/health` page – visual health check for all configured services
- Discord: `avatar_decoration` field added to `/api/discord/user/:id` and `/api/discord/profile/:id`

---

## [0.2.0] – 2026-03-20

### Added
- Discord: `/api/discord/profile/:id` – combined profile + presence in a single request

---

## [0.1.0] – 2026-03-20

### Added

- Discord: User profile, avatar, banner, presence, guild, invite endpoints
- GitHub: User profile, repository endpoints
- NPM: Package info + download stats
- Twitch: User profile + live status
- Steam: Player profile + recently played games
- Preview pages for all services (`/discord`, `/github`, `/npm`, `/twitch`, `/steam`)
- Landing page with all endpoints listed
- `/api/health` endpoint
- Vercel deployment config (`vercel.json`)
