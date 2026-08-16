import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProjectCard from './ProjectCard'
import { PROJECTS } from '../data/projects'

const project = PROJECTS.find((p) => p.id === 'mcq-platform')!

describe('ProjectCard', () => {
  it('shows the name, purpose, and tech badges by default, details hidden', () => {
    render(<ProjectCard project={project} />)

    expect(screen.getByRole('heading', { name: project.name })).toBeInTheDocument()
    expect(screen.getByText(project.purpose)).toBeInTheDocument()
    for (const tech of project.tech) {
      expect(screen.getByText(tech)).toBeInTheDocument()
    }
    expect(screen.queryByText(project.problem)).not.toBeInTheDocument()
  })

  it('reveals problem/solution/architecture/decision/result on "How it works"', async () => {
    const user = userEvent.setup()
    render(<ProjectCard project={project} />)

    const toggle = screen.getByRole('button', { name: /how it works/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(project.problem)).toBeInTheDocument()
    expect(screen.getByText(project.solution)).toBeInTheDocument()
    expect(screen.getByText(project.architecture)).toBeInTheDocument()
    expect(screen.getByText(project.decision)).toBeInTheDocument()
    expect(screen.getByText(project.result)).toBeInTheDocument()
  })

  it('links to the real GitHub repo with safe external-link attributes', () => {
    render(<ProjectCard project={project} />)
    const link = screen.getByRole('link', { name: /github/i })
    expect(link).toHaveAttribute('href', project.github)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('shows a "Traced further below" link for a project with an architectureAnchor', () => {
    render(<ProjectCard project={project} />)
    expect(screen.getByRole('link', { name: /traced further below/i })).toBeInTheDocument()
  })

  it('omits the "Traced further below" link for a project without one', () => {
    const withoutAnchor = PROJECTS.find((p) => !p.architectureAnchor)!
    render(<ProjectCard project={withoutAnchor} />)
    expect(screen.queryByRole('link', { name: /traced further below/i })).not.toBeInTheDocument()
  })
})
