/**
 * Phase 15's bridge between plain DOM components (InteractionEffects,
 * Navbar) and the lazy-loaded WebGL scene (`src/three/*`). A tiny
 * pub/sub, not a new state-management dependency: matches the
 * "expose a function, poll/subscribe from `useFrame`" idiom the site
 * already uses for `MusicContext.getAmplitude()`, rather than reaching
 * for Redux/Zustand for what is, at most, a handful of listeners.
 */

export type ClickKind = 'ink' | 'tech'

export interface ClickEvent {
  x: number
  y: number
  kind: ClickKind
}

export interface NavTransitionEvent {
  originX: number
  originY: number
}

type Listener<T> = (event: T) => void

function createChannel<T>() {
  const listeners = new Set<Listener<T>>()
  return {
    emit(event: T) {
      listeners.forEach((listener) => listener(event))
    },
    subscribe(listener: Listener<T>) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

const clickChannel = createChannel<ClickEvent>()
const navChannel = createChannel<NavTransitionEvent>()

export function emitClick(x: number, y: number, kind: ClickKind) {
  clickChannel.emit({ x, y, kind })
}

export function onClick(listener: Listener<ClickEvent>) {
  return clickChannel.subscribe(listener)
}

export function emitNavTransition(originX: number, originY: number) {
  navChannel.emit({ originX, originY })
}

export function onNavTransition(listener: Listener<NavTransitionEvent>) {
  return navChannel.subscribe(listener)
}

/**
 * Scroll velocity, smoothed by exponential decay toward the latest
 * per-frame delta so `ScrollTrail3D` reads a "velocity" rather than a
 * noisy raw diff. The tracking loop only starts if something is
 * actually watching (see `getScrollVelocity`'s note) and never starts
 * at all under reduced motion, since the one consumer of this value
 * doesn't mount there either.
 */
let scrollVelocity = 0
let lastScrollY = typeof window === 'undefined' ? 0 : window.scrollY
let trackingStarted = false

function trackScroll() {
  const currentY = window.scrollY
  const delta = currentY - lastScrollY
  lastScrollY = currentY
  scrollVelocity += (delta - scrollVelocity) * 0.3
  requestAnimationFrame(trackScroll)
}

export function getScrollVelocity() {
  if (!trackingStarted && typeof window !== 'undefined') {
    trackingStarted = true
    requestAnimationFrame(trackScroll)
  }
  return scrollVelocity
}
