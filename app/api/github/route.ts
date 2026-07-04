import { NextResponse } from 'next/server';

// Live GitHub stats for the featured repos.
// Set GITHUB_TOKEN in your env for higher rate limits (recommended on Cloud Run).
// Revalidates hourly so numbers stay fresh without hammering the API.
export const revalidate = 3600;

const API = 'https://' + 'api.github.com';
const USER = 'SudhanshuBiswas01';
const REPOS = ['Justice-AI', 'HackRush_Hackhon_IITGN'];

async function gh(path: string) {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (token) headers.Authorization = 'Bearer ' + token;
  const res = await fetch(API + path, { headers, next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('GitHub ' + path + ' -> ' + res.status);
  return res.json();
}

export async function GET() {
  try {
    const repos = await Promise.all(
      REPOS.map(async (name) => {
        const r = await gh('/repos/' + USER + '/' + name);
        return {
          name: r.name as string,
          full_name: r.full_name as string,
          stars: r.stargazers_count as number,
          forks: r.forks_count as number,
          language: (r.language as string | null) ?? null,
          pushed_at: r.pushed_at as string,
          html_url: r.html_url as string,
        };
      }),
    );
    return NextResponse.json({ ok: true, repos });
  } catch (e) {
    // Graceful fallback so the UI shows the exact provided data instead.
    return NextResponse.json({ ok: false, error: (e as Error).message });
  }
}
