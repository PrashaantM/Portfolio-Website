#!/usr/bin/env node
// Phase 19: build-time GitHub data snapshot. Run this locally (needs
// `gh` authenticated, same tool Phase 9 already used to find these
// repos) and commit the result. The shipped site only ever reads the
// output JSON, never calls GitHub's API itself, so a rate limit or an
// outage never breaks the live site, only makes the next snapshot
// stale until this is re-run.
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Keyed by the same `id` src/data/projects.ts already uses, so
// ProjectCard can look a repo up by the project it's already
// rendering instead of matching on a URL string.
const REPOS = {
  'mcq-platform': 'Generate67-capstone-team-6',
  'job-portal': 'job-portal',
  'game-of-amazons': 'GameOfAmazons',
  bestbytes: 'BestBytes',
  bugzapper: 'BugZapper',
  'malware-containment-research': 'Malware-Containment-Research',
  crave: 'C.R.A.V.E',
  platformer: 'Platformer',
  'text-scanner': 'TextScanner',
  ai4sg: 'AI4SG',
  'text-escape-room': 'textEscapeRoom',
  enigma: 'Enigma',
  'desktop-workspace-manager': 'Desktop-Workspace-Manager',
}

const stats = {}

for (const [id, repo] of Object.entries(REPOS)) {
  const raw = execFileSync(
    'gh',
    ['repo', 'view', `PrashaantM/${repo}`, '--json', 'stargazerCount,primaryLanguage,pushedAt'],
    { encoding: 'utf-8' },
  )
  const data = JSON.parse(raw)
  stats[id] = {
    stars: data.stargazerCount,
    primaryLanguage: data.primaryLanguage?.name ?? null,
    pushedAt: data.pushedAt,
  }
  console.log(`${id} (${repo}): ${stats[id].stars} stars, pushed ${stats[id].pushedAt}`)
}

const outPath = fileURLToPath(new URL('../src/data/github-stats.json', import.meta.url))
writeFileSync(outPath, JSON.stringify(stats, null, 2) + '\n')
console.log(`\nWrote ${outPath}`)
