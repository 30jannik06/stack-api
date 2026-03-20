const NPM_API = "https://registry.npmjs.org";
const NPM_DOWNLOADS = "https://api.npmjs.org/downloads/point/last-month";

export async function GET(_request: Request, { params }: { params: Promise<{ package: string }> }) {
  const { package: pkg } = await params;

  const [pkgRes, dlRes] = await Promise.all([
    fetch(`${NPM_API}/${pkg}`, { next: { revalidate: 300 } }),
    fetch(`${NPM_DOWNLOADS}/${pkg}`, { next: { revalidate: 300 } }),
  ]);

  if (!pkgRes.ok) {
    return Response.json({ error: "Package not found" }, { status: pkgRes.status });
  }

  const data = await pkgRes.json();
  const downloads = dlRes.ok ? await dlRes.json() : null;
  const latest = data["dist-tags"]?.latest;
  const version = data.versions?.[latest];

  return Response.json(
    {
      name: data.name,
      version: latest,
      description: data.description ?? null,
      author: version?.author?.name ?? data.author?.name ?? null,
      license: version?.license ?? null,
      homepage: version?.homepage ?? null,
      repository: version?.repository?.url ?? null,
      keywords: version?.keywords ?? [],
      dependencies: version?.dependencies ? Object.keys(version.dependencies).length : 0,
      downloads_last_month: downloads?.downloads ?? null,
      npm_url: `https://www.npmjs.com/package/${data.name}`,
      created_at: data.time?.created ?? null,
      updated_at: data.time?.modified ?? null,
      dist_tags: data["dist-tags"] ?? {},
    },
    {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    }
  );
}
