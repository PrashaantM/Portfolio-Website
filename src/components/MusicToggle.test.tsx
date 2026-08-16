import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MusicToggle from './MusicToggle'
import { MusicContext, type MusicContextValue } from '../context/musicContext'
import { TRACKS } from '../lib/audio'

function renderWithMusic(overrides: Partial<MusicContextValue> = {}) {
  const value: MusicContextValue = {
    isPlaying: false,
    volume: 0.25,
    trackId: TRACKS[0].id,
    toggle: vi.fn(),
    setVolume: vi.fn(),
    setTrack: vi.fn(),
    getAmplitude: () => 0,
    ...overrides,
  }
  render(
    <MusicContext.Provider value={value}>
      <MusicToggle />
    </MusicContext.Provider>,
  )
  return value
}

describe('MusicToggle', () => {
  it('shows "MUSIC OFF" and no controls when not playing', () => {
    renderWithMusic({ isPlaying: false })
    expect(screen.getByText('MUSIC OFF')).toBeInTheDocument()
    expect(screen.queryByLabelText('Volume')).not.toBeInTheDocument()
  })

  it('shows the active track name and volume/track controls when playing', () => {
    renderWithMusic({ isPlaying: true, trackId: TRACKS[0].id })
    expect(screen.getByText(TRACKS[0].name.toUpperCase())).toBeInTheDocument()
    expect(screen.getByLabelText('Volume')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('calls toggle() when the play/pause button is clicked', async () => {
    const user = userEvent.setup()
    const value = renderWithMusic({ isPlaying: false })

    await user.click(screen.getByRole('button', { name: /music off/i }))
    expect(value.toggle).toHaveBeenCalledOnce()
  })

  it('calls setVolume() with a numeric value when the slider changes', () => {
    const value = renderWithMusic({ isPlaying: true })
    const slider = screen.getByLabelText('Volume')

    // fireEvent.change, not user.click/type: it's Testing Library's own
    // recommended way to drive a range input, and sets the value
    // through React's native-input-value setter so the component's
    // controlled `onChange` actually fires, unlike a plain
    // hand-dispatched `change` event.
    fireEvent.change(slider, { target: { value: '0.75' } })

    expect(value.setVolume).toHaveBeenCalledWith(0.75)
  })

  it('calls setTrack() with the selected track id when the picker changes', async () => {
    const user = userEvent.setup()
    const value = renderWithMusic({ isPlaying: true, trackId: TRACKS[0].id })

    await user.selectOptions(screen.getByRole('combobox'), TRACKS[1].id)
    expect(value.setTrack).toHaveBeenCalledWith(TRACKS[1].id)
  })
})
