import { bio, skills, experience, education, certificates, social } from '@/lib/data'

describe('lib/data', () => {
  it('bio has all required fields populated', () => {
    expect(bio.name).toBeTruthy()
    expect(bio.tagline).toBeTruthy()
    expect(bio.roles.length).toBeGreaterThan(0)
    expect(bio.aboutText).toBeTruthy()
    expect(bio.username).toBeTruthy()
  })

  it('skills has at least one entry per category', () => {
    expect(skills.languages.length).toBeGreaterThan(0)
    expect(skills.frameworks.length).toBeGreaterThan(0)
    expect(skills.tools.length).toBeGreaterThan(0)
  })

  it('every experience entry has required fields', () => {
    expect(experience.length).toBeGreaterThan(0)
    experience.forEach((entry) => {
      expect(entry.company).toBeTruthy()
      expect(entry.role).toBeTruthy()
      expect(entry.dateRange).toBeTruthy()
      expect(entry.bullets.length).toBeGreaterThan(0)
    })
  })

  it('every education entry has required fields', () => {
    expect(education.length).toBeGreaterThan(0)
    education.forEach((entry) => {
      expect(entry.institution).toBeTruthy()
      expect(entry.degree).toBeTruthy()
      expect(entry.dateRange).toBeTruthy()
      expect(entry.gpa).toBeTruthy()
    })
  })

  it('certificates array is defined', () => {
    expect(Array.isArray(certificates)).toBe(true)
    certificates.forEach((cert) => {
      expect(cert.issuer).toBeTruthy()
      expect(cert.title).toBeTruthy()
    })
  })

  it('social has all link fields', () => {
    expect(social.github).toBeTruthy()
    expect(social.linkedin).toBeTruthy()
    expect(social.email).toBeTruthy()
  })
})
