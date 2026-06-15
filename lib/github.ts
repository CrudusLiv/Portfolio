export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  language: string | null
  fork: boolean
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
