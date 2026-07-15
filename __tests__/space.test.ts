import { generateConstellation, hashString } from '@/lib/space'

describe('hashString', () => {
  it('is deterministic', () => {
    expect(hashString('Vesper')).toBe(hashString('Vesper'))
  })

  it('differs across names', () => {
    expect(hashString('Vesper')).not.toBe(hashString('TaskZen'))
  })
})

describe('generateConstellation', () => {
  it('produces the same constellation for the same name', () => {
    expect(generateConstellation('my-repo')).toEqual(generateConstellation('my-repo'))
  })

  it('produces 4 to 7 stars, all within the unit cell', () => {
    for (const name of ['Vesper', 'TaskZen', 'StudyFlow', 'a', 'weird--name_123']) {
      const { stars } = generateConstellation(name)
      expect(stars.length).toBeGreaterThanOrEqual(4)
      expect(stars.length).toBeLessThanOrEqual(7)
      for (const star of stars) {
        expect(star.x).toBeGreaterThan(0)
        expect(star.x).toBeLessThan(1)
        expect(star.y).toBeGreaterThan(0)
        expect(star.y).toBeLessThan(1)
      }
    }
  })

  it('marks exactly one main star', () => {
    const { stars } = generateConstellation('some-project')
    expect(stars.filter((s) => s.main)).toHaveLength(1)
  })

  it('links every star into one connected chain', () => {
    const { stars, links } = generateConstellation('another-project')
    expect(links).toHaveLength(stars.length - 1)
    const touched = new Set(links.flat())
    expect(touched.size).toBe(stars.length)
  })
})
