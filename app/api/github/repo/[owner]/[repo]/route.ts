const GITHUB_API = "https://api.github.com";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ owner: string; repo: string }> }
) {
    const { owner, repo } = await params;

    const headers: Record<string, string> = {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    };
    if (process.env.GITHUB_TOKEN) {
        headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
        headers, next: { revalidate: 60 },
    });

    if (!res.ok) {
        return Response.json({ error: "Repo not found" }, { status: res.status });
    }

    const r = await res.json();

    return Response.json({
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        description: r.description ?? null,
        url: r.html_url,
        stars: r.stargazers_count,
        forks: r.forks_count,
        watchers: r.watchers_count,
        open_issues: r.open_issues_count,
        language: r.language ?? null,
        license: r.license?.spdx_id ?? null,
        topics: r.topics ?? [],
        is_fork: r.fork,
        is_archived: r.archived,
        default_branch: r.default_branch,
        created_at: r.created_at,
        updated_at: r.updated_at,
        owner: {
            username: r.owner.login,
            avatar_url: r.owner.avatar_url,
        },
        raw: r,
    }, {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
}