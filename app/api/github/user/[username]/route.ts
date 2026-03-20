const GITHUB_API = "https://api.github.com";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;

    if (!username || username.length < 1) {
        return Response.json({ error: "Invalid username" }, { status: 400 });
    }

    const headers: Record<string, string> = {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    };
    if (process.env.GITHUB_TOKEN) {
        headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const [userRes, reposRes] = await Promise.all([
        fetch(`${GITHUB_API}/users/${username}`, { headers, next: { revalidate: 60 } }),
        fetch(`${GITHUB_API}/users/${username}/repos?sort=stars&per_page=6`, { headers, next: { revalidate: 60 } }),
    ]);

    if (!userRes.ok) {
        return Response.json({ error: "User not found" }, { status: userRes.status });
    }

    const user = await userRes.json();
    const repos = reposRes.ok ? await reposRes.json() : [];

    return Response.json({
        id: user.id,
        username: user.login,
        display_name: user.name ?? null,
        avatar_url: user.avatar_url,
        bio: user.bio ?? null,
        location: user.location ?? null,
        website: user.blog ?? null,
        company: user.company ?? null,
        twitter: user.twitter_username ?? null,
        public_repos: user.public_repos,
        followers: user.followers,
        following: user.following,
        created_at: user.created_at,
        top_repos: repos.map((r: any) => ({
            name: r.name,
            description: r.description ?? null,
            url: r.html_url,
            stars: r.stargazers_count,
            forks: r.forks_count,
            language: r.language ?? null,
        })),
        raw: user,
    }, {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
}