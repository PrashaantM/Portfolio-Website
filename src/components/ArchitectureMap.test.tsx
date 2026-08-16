import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ArchitectureMap from './ArchitectureMap'
import { ARCHITECTURE_NODES } from '../data/architecture'

describe('ArchitectureMap', () => {
  it('shows the first node as active by default', () => {
    render(<ArchitectureMap />)
    const first = ARCHITECTURE_NODES[0]

    expect(screen.getByRole('button', { name: first.label })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(first.technology)).toBeInTheDocument()
  })

  it('updates the detail panel when a different node is clicked', async () => {
    const user = userEvent.setup()
    render(<ArchitectureMap />)
    const second = ARCHITECTURE_NODES[1]

    await user.click(screen.getByRole('button', { name: second.label }))

    expect(screen.getByRole('button', { name: second.label })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: ARCHITECTURE_NODES[0].label })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(screen.getByText(second.technology)).toBeInTheDocument()
    expect(screen.getByText(second.responsibility)).toBeInTheDocument()
    expect(screen.getByText(second.why)).toBeInTheDocument()
    expect(screen.getByText(second.detail)).toBeInTheDocument()
  })
})
