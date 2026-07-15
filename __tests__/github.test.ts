import { filterRepos, type GitHubRepo } from '@/lib/github'

const makeRepo = (overrides: Partial<GitHubRepo> = {}): GitHubRepo => ({
  id: 1,
  name: 'test-repo',
  description: 'A test repo',
  html_url: 'https://github.com/user/test-repo',
  stargazers_count: 0,
  language: 'TypeScript',
  fork: false,
  ...overrides,
})

describe('filterRepos', () => {
  it('keeps non-fork repos regardless of description', () => {
    const repos = [
      makeRepo({ description: 'Has a description' }),
      makeRepo({ id: 2, description: null }),
      makeRepo({ id: 3, description: '' }),
    ]
    expect(filterRepos(repos)).toHaveLength(3)
  })

  it('removes forked repos', () => {
    const repos = [makeRepo({ fork: true })]
    expect(filterRepos(repos)).toHaveLength(0)
  })

  it('sorts by stars descending', () => {
    const repos = [
      makeRepo({ id: 1, stargazers_count: 1 }),
      makeRepo({ id: 2, stargazers_count: 5 }),
      makeRepo({ id: 3, stargazers_count: 0 }),
    ]
    const result = filterRepos(repos)
    expect(result.map((r) => r.stargazers_count)).toEqual([5, 1, 0])
  })

  it('keeps mixed list, removes only forks', () => {
    const repos = [
      makeRepo({ id: 1, fork: false }),
      makeRepo({ id: 2, fork: true }),
      makeRepo({ id: 3, fork: false, description: null }),
    ]
    const result = filterRepos(repos)
    expect(result).toHaveLength(2)
    expect(result.map((r) => r.id)).toEqual([1, 3])
  })
})
