import { describe, expect, it } from 'vitest'
import { PROJECTS } from './projects'
import { SKILL_CATEGORIES } from './skills'
import { LAB_IDEAS } from './lab'
import { EXPERIENCE } from './experience'
import { INTERESTS } from './interests'

// Phase 20's "important data transformations" case: every card/section
// on this site is a straight map over one of these arrays, so a blank
// field or a broken URL here would silently ship as a blank spot or a
// dead link on the live site rather than fail anywhere loud. These
// tests exist to fail loud instead.

describe('PROJECTS', () => {
  it('has no duplicate ids', () => {
    const ids = PROJECTS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every project has non-empty required fields and a real-looking GitHub URL', () => {
    for (const project of PROJECTS) {
      expect(project.name.length).toBeGreaterThan(0)
      expect(project.purpose.length).toBeGreaterThan(0)
      expect(project.problem.length).toBeGreaterThan(0)
      expect(project.solution.length).toBeGreaterThan(0)
      expect(project.architecture.length).toBeGreaterThan(0)
      expect(project.decision.length).toBeGreaterThan(0)
      expect(project.result.length).toBeGreaterThan(0)
      expect(project.tech.length).toBeGreaterThan(0)
      expect(project.github).toMatch(/^https:\/\/github\.com\/PrashaantM\//)
    }
  })

  it('every demo link, where present, is a real https URL', () => {
    for (const project of PROJECTS) {
      if (project.demo) expect(project.demo).toMatch(/^https:\/\//)
    }
  })
})

describe('SKILL_CATEGORIES', () => {
  it('has no empty categories', () => {
    for (const category of SKILL_CATEGORIES) {
      expect(category.name.length).toBeGreaterThan(0)
      expect(category.skills.length).toBeGreaterThan(0)
    }
  })
})

describe('LAB_IDEAS', () => {
  it('has nine uniquely numbered ideas', () => {
    expect(LAB_IDEAS.length).toBe(9)
    const numbers = LAB_IDEAS.map((idea) => idea.number)
    expect(new Set(numbers).size).toBe(numbers.length)
  })

  it('every idea has non-empty required fields', () => {
    for (const idea of LAB_IDEAS) {
      expect(idea.name.length).toBeGreaterThan(0)
      expect(idea.tagline.length).toBeGreaterThan(0)
      expect(idea.concept.length).toBeGreaterThan(0)
      expect(idea.visual.length).toBeGreaterThan(0)
      expect(idea.tags.length).toBeGreaterThan(0)
    }
  })
})

describe('EXPERIENCE', () => {
  it('every entry has non-empty required fields and at least one bullet', () => {
    for (const entry of EXPERIENCE) {
      expect(entry.title.length).toBeGreaterThan(0)
      expect(entry.organization.length).toBeGreaterThan(0)
      expect(entry.location.length).toBeGreaterThan(0)
      expect(entry.start.length).toBeGreaterThan(0)
      expect(entry.end.length).toBeGreaterThan(0)
      expect(entry.bullets.length).toBeGreaterThan(0)
      for (const bullet of entry.bullets) expect(bullet.length).toBeGreaterThan(0)
    }
  })
})

describe('INTERESTS', () => {
  it('every interest has a name and description', () => {
    for (const interest of INTERESTS) {
      expect(interest.name.length).toBeGreaterThan(0)
      expect(interest.description.length).toBeGreaterThan(0)
    }
  })
})
