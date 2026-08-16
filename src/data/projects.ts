export interface Project {
  id: string
  name: string
  purpose: string
  problem: string
  solution: string
  architecture: string
  tech: string[]
  decision: string
  result: string
  github: string
  demo?: string
}

// Source of truth: public/PrashaantMudgala_Resume.pdf for the facts
// (stack, features, numbers), and `gh repo list PrashaantM` for the
// actual GitHub URLs, matched by each repo's own description against
// the resume's project descriptions rather than guessed. See
// notes/phase-9.md for the exact lookups.
export const PROJECTS: Project[] = [
  {
    id: 'mcq-platform',
    name: 'MCQ Exam Management Platform',
    purpose:
      'A platform for a UBC Okanagan department that lets instructors build question banks, generate multi-variant exams, and see results from one dashboard.',
    problem:
      'Creating multiple exam variants with matching answer keys, then grading and analyzing results, is slow and error-prone to do by hand at university scale.',
    solution:
      'A centralized platform where instructors manage question banks, import questions, generate multiple exam variants with matching answer keys, and analyze results through one dashboard.',
    architecture:
      'React and Tailwind frontend talking to a JWT-secured FastAPI backend with role-based access control, PostgreSQL for storage, and a Dockerized background worker that handles exam variant generation off the request path.',
    tech: [
      'React',
      'Tailwind CSS',
      'FastAPI',
      'Python',
      'PostgreSQL',
      'Docker',
      'JWT',
      'REST APIs',
      'Pytest',
      'Vitest',
      'React Testing Library',
    ],
    decision:
      'Moved multi-variant exam generation into an asynchronous background worker instead of generating it inline, since the algorithm is heavy enough to block a request. Optimized and load tested that worker for up to 10 concurrent task executions.',
    result:
      'Validated under 100+ concurrent users and high-volume data workloads without falling over.',
    github: 'https://github.com/PrashaantM/Generate67-capstone-team-6',
  },
  {
    id: 'job-portal',
    name: 'Full-Stack Job Portal',
    purpose:
      'A role-based job portal where job seekers, employers, and admins each get their own workflow.',
    problem:
      'Most student job-board projects only build one side of the marketplace. A real job portal needs distinct, secure workflows for job seekers, employers, and admins.',
    solution:
      'A MERN job portal with JWT authentication and role-based views for all three user types, documented with Swagger OpenAPI so the API is easy to explore and integrate against.',
    architecture:
      'React frontend, Node.js and Express backend, MongoDB for storage, containerized with Docker, and a GitHub Actions pipeline running lint, Vitest, and Playwright end-to-end tests on every push.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Docker', 'GitHub Actions', 'JWT', 'Playwright', 'Swagger'],
    decision:
      'Set up CI to actually catch regressions instead of only running before a release: lint, unit tests, and Playwright end-to-end tests all run on every push.',
    result: 'A working CI/CD pipeline backing a live deployment, not just a local demo.',
    github: 'https://github.com/PrashaantM/job-portal',
    demo: 'https://job-portal-cyan-sigma.vercel.app',
  },
  {
    id: 'game-of-amazons',
    name: 'Game of Amazons AI Agent',
    purpose: 'A Java agent that plays the board game Game of Amazons using minimax search.',
    problem:
      'Game of Amazons has an enormous branching factor. Brute-force search cannot explore the full game tree in a reasonable time.',
    solution:
      'A depth-limited minimax agent with alpha-beta pruning and a multi-factor heuristic combining BFS territory reachability, mobility, and positional pressure, plus a legal-move generator.',
    architecture: 'Pure Java. No external engine or framework, just search, pruning, and heuristic evaluation.',
    decision:
      'The heuristic is not just piece count. It weighs BFS-computed territory reachability against mobility and positional pressure, which is what actually separates a good move from a legal one in this game.',
    tech: ['Java', 'Minimax', 'Alpha-Beta Pruning', 'BFS', 'Heuristic Design'],
    result: 'Cut evaluated branches by 60% with alpha-beta pruning and placed 10th class-wide in a competitive tournament.',
    github: 'https://github.com/PrashaantM/GameOfAmazons',
  },
  {
    id: 'bestbytes',
    name: 'BestBytes Movie Database & Review System',
    purpose: 'A movie review platform built with a FastAPI backend and a 4-person Agile team.',
    problem:
      'Building a multi-feature app (auth, catalog, reviews) as a team without everyone blocking on the same code.',
    solution:
      'A FastAPI backend exposing REST endpoints for auth, catalog, and review services, with a React frontend on top.',
    architecture:
      'FastAPI backend split into modular services (auth, catalog, review), containerized with Docker, React frontend.',
    decision:
      'Split the backend into modular services from the start so the 4-person team could work in parallel without stepping on each other\'s endpoints.',
    tech: ['Python', 'FastAPI', 'React', 'Docker', 'REST APIs', 'Agile/Scrum'],
    result: 'Shipped iteratively as a 4-person Agile team with working modular services.',
    github: 'https://github.com/PrashaantM/BestBytes',
  },
  {
    id: 'bugzapper',
    name: 'BugZapper',
    purpose: 'A 3D browser game with a rendering pipeline built entirely from scratch, no game engine involved.',
    problem:
      'Building convincing 3D graphics in the browser usually means reaching for a library like Three.js, which hides how the actual rendering pipeline works underneath it.',
    solution:
      'A 3D browser game built directly on raw WebGL and hand-written GLSL shaders, with zero external 3D libraries, handling the full rendering pipeline itself.',
    architecture: 'Vanilla JavaScript and WebGL, custom GLSL vertex and fragment shaders, no rendering framework or game engine.',
    decision:
      'Wrote the shaders and rendering pipeline by hand instead of pulling in an existing 3D library, trading development speed for actually understanding how the graphics pipeline works end to end.',
    tech: ['JavaScript', 'WebGL', 'GLSL', 'Shaders'],
    result: 'A playable 3D browser game running at 60 FPS with adaptive difficulty scaling.',
    github: 'https://github.com/PrashaantM/BugZapper',
  },
  {
    id: 'malware-containment-research',
    name: 'Malware Containment Research',
    purpose:
      'A network science research project (UBC COSC 421 team project) on the most effective way to contain a malware outbreak.',
    problem:
      'Standard security practice quarantines high-traffic "hub" nodes first during an outbreak, but that is an assumption, not something the team had seen actually tested against alternatives.',
    solution:
      'Modeled 125,000+ NSL-KDD network traffic records as weighted directed graphs, evaluated network vulnerability across 8 centrality measures (including PageRank, betweenness, closeness, and eigenvector centrality), and ran a weighted SIR outbreak simulation to compare node-removal strategies head to head.',
    architecture: 'R, using igraph for graph modeling and centrality analysis, and tidyverse/ggplot2 for analysis and visualization.',
    decision:
      'Tested PageRank centrality as a containment strategy against the conventional degree/traffic-volume approach instead of assuming the standard approach was correct, and backed the comparison with simulation rather than intuition.',
    tech: ['R', 'igraph', 'Graph Theory', 'SIR Simulation', 'Network Science'],
    result:
      'PageRank-based node removal contained outbreaks about 15 to 20 percent more effectively than degree-based removal, and high-betweenness "bottleneck" nodes turned out to matter more than high-volume hub nodes in several network topologies.',
    github: 'https://github.com/PrashaantM/Malware-Containment-Research',
  },
  {
    id: 'crave',
    name: 'C.R.A.V.E',
    purpose:
      'A mobile cycling app (UBC COSC 341 team project) that combines real-time ride tracking with local discovery and gamification.',
    problem:
      'Cycling apps usually pick one lane: fitness tracking or navigation. Neither makes a ride more interesting, and neither gives a rider a reason to come back tomorrow.',
    solution:
      'A React Native app combining live GPS ride tracking, route suggestions weighed by distance, safety, and scenery, discovery of nearby restaurants, cafes, and parks along the route, and a badge and monthly leaderboard system to keep people riding.',
    architecture: 'React Native for the app, the Google Maps API for navigation and real-time tracking, Figma driving the UX process.',
    decision:
      'Ran two full rounds of user testing and shipped what the tests actually surfaced instead of the original design: safety warnings before a ride starts, a fixed km versus km/h unit inconsistency, and a reworked rating system after the first round showed people wanted feedback on the places they visited.',
    tech: ['React Native', 'Google Maps API', 'Figma'],
    result: 'A working app with real GPS tracking and gamification, refined through two rounds of real user testing rather than shipped on a single guess.',
    github: 'https://github.com/PrashaantM/C.R.A.V.E',
  },
]
