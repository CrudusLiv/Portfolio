export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  language: string | null
  fork: boolean
  pushed_at?: string
}

export interface Telemetry {
  repoCount: number
  totalStars: number
  topLanguages: { name: string; count: number }[]
  /** ISO date of the most recent push across repos, if available. */
  lastPush: string | null
}

// Languages hidden from the "top systems" readout — the portfolio leads with
// core software-dev stack (TypeScript, JavaScript, React and the like).
const EXCLUDED_LANGUAGES = new Set(['Python', 'Jupyter Notebook'])

export function computeTelemetry(repos: GitHubRepo[]): Telemetry {
  const langCounts = new Map<string, number>()
  let lastPush: string | null = null
  for (const repo of repos) {
    if (repo.language && !EXCLUDED_LANGUAGES.has(repo.language)) {
      langCounts.set(repo.language, (langCounts.get(repo.language) ?? 0) + 1)
    }
    if (repo.pushed_at && (!lastPush || repo.pushed_at > lastPush)) {
      lastPush = repo.pushed_at
    }
  }
  return {
    repoCount: repos.length,
    totalStars: repos.reduce((sum, r) => sum + r.stargazers_count, 0),
    topLanguages: [...langCounts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3),
    lastPush,
  }
}

const EXCLUDED_REPOS = ['Portfolio', 'CrudusLiv']

export function filterRepos(repos: GitHubRepo[]): GitHubRepo[] {
  return repos
    .filter((repo) => !repo.fork && !EXCLUDED_REPOS.includes(repo.name))
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
}

export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`,
    { next: { revalidate: 0 } }
  )
  if (!res.ok) {
    throw new Error(`GitHub API returned ${res.status}`)
  }
  const data: GitHubRepo[] = await res.json()
  return filterRepos(data)
}
