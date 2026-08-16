import type { LucideIcon } from 'lucide-react'
import {
  ClipboardCheck,
  Briefcase,
  Swords,
  Clapperboard,
  Gamepad2,
  ShieldAlert,
  Bike,
} from 'lucide-react'

export interface Project {
  id: string
  name: string
  icon: LucideIcon
  purpose: string
  problem: string
  solution: string
  architecture: string
  tech: string[]
  decision: string
  result: string
  github: string
  demo?: string
  /** Set only on the one project with a deeper system breakdown
   *  further down the page (Phase 14). Renders as a small red-thread
   *  link on the card, the "constellation-like project connections"
   *  motif Phase 4's own notes deferred to this later animation work. */
  architectureAnchor?: string
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
    icon: ClipboardCheck,
    architectureAnchor: '#architecture-deep-dive',
    purpose:
      'A platform for a UBC Okanagan department that lets instructors build question banks, generate multi-variant exams, and see results from one dashboard.',
    problem:
      'Creating multiple exam variants with matching answer keys, then grading and analyzing results, is slow and error-prone to do by hand at university scale. Variants also matter for academic integrity: without them, students sitting near each other can just copy answers, and spotting suspicious patterns across hundreds of submissions by hand is not realistic either.',
    solution:
      'A centralized platform where instructors manage question banks, import questions, generate multiple exam variants with matching answer keys, and analyze results through one dashboard, including surfacing answer patterns worth a second look for possible cheating.',
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
    icon: Briefcase,
    purpose:
      'A role-based job portal where job seekers, employers, and admins each get their own workflow.',
    problem:
      'Most student job-board projects only build one side of the marketplace, like just the listings. A real job portal needs separate, secure experiences for job seekers, employers, and admins alike.',
    solution:
      'A job portal built with React, Node, and MongoDB, where each user type logs in securely and only sees the tools meant for them. The API is documented with Swagger, so another developer can explore it and plug into it easily.',
    architecture:
      'A React frontend talks to a Node and Express backend, with MongoDB handling storage. Everything runs in Docker, and a GitHub Actions pipeline automatically lints the code and runs both unit and end-to-end tests every time new code is pushed.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Docker', 'GitHub Actions', 'JWT', 'Playwright', 'Swagger'],
    decision:
      'Made sure tests actually catch bugs early instead of only running right before a release: linting, unit tests, and full end-to-end tests all run automatically on every push.',
    result: 'A real, working pipeline backing a live deployment, not just something that runs on my laptop.',
    github: 'https://github.com/PrashaantM/job-portal',
    demo: 'https://job-portal-cyan-sigma.vercel.app',
  },
  {
    id: 'game-of-amazons',
    name: 'Game of Amazons AI Agent',
    icon: Swords,
    purpose:
      'A Java program that plays the board game Game of Amazons by searching ahead and picking the strongest move it can find.',
    problem:
      'Game of Amazons has so many possible moves at each turn that a computer cannot realistically check every single one before deciding what to play.',
    solution:
      'An agent that looks a few moves ahead and picks the best one using a search technique called minimax, sped up with a trick called alpha-beta pruning that skips over branches that clearly will not matter. To judge how good a position is, it does not just count pieces. It also considers how much of the board each side can still reach, how many moves are available, and how much pressure a position puts on the opponent.',
    architecture:
      'Written entirely in Java with no outside game engine or library, just search, pruning, and the scoring logic that evaluates each position.',
    decision:
      'Piece count alone is not a good way to judge a position in this game. The scoring function instead balances how much territory each side can still reach, how many moves they have available, and how much pressure they are putting on the opponent, since that combination is what actually separates a good move from a merely legal one.',
    tech: ['Java', 'Minimax', 'Alpha-Beta Pruning', 'BFS', 'Heuristic Design'],
    result:
      'Alpha-beta pruning cut the number of positions the agent had to check by 60%, and the agent placed 10th out of the whole class in a competitive tournament.',
    github: 'https://github.com/PrashaantM/GameOfAmazons',
  },
  {
    id: 'bestbytes',
    name: 'BestBytes Movie Database & Review System',
    icon: Clapperboard,
    purpose: 'A movie review platform built with a FastAPI backend and a 4-person Agile team.',
    problem:
      'Building an app with several big features (logins, a movie catalog, reviews) as a team, without everyone getting stuck waiting on the same piece of code.',
    solution:
      'A backend built with FastAPI that exposes separate endpoints for logins, the movie catalog, and reviews, with a React frontend on top.',
    architecture:
      'The FastAPI backend is split into separate services for auth, catalog, and reviews rather than one big block of code, all running in Docker, with a React frontend.',
    decision:
      'Split the backend into separate services from the very start so all four of us could work at the same time without stepping on each other\'s code.',
    tech: ['Python', 'FastAPI', 'React', 'Docker', 'REST APIs', 'Agile/Scrum'],
    result: 'Shipped in stages as a 4-person Agile team, with each service working on its own.',
    github: 'https://github.com/PrashaantM/BestBytes',
  },
  {
    id: 'bugzapper',
    name: 'BugZapper',
    icon: Gamepad2,
    purpose: 'A 3D browser game with a rendering pipeline built entirely from scratch, no game engine involved.',
    problem:
      'Building 3D graphics in a browser usually means reaching for a library like Three.js, which does the hard work for you but hides how it actually works underneath.',
    solution:
      'A 3D browser game built directly on WebGL, the browser\'s low-level graphics API, with every shader (the small program that tells the GPU how to draw each pixel) written by hand. No external 3D library does any of the work.',
    architecture:
      'Plain JavaScript and WebGL, with custom shaders controlling how shapes are positioned and colored. No rendering framework or game engine underneath.',
    decision:
      'Chose to write the shaders and rendering pipeline by hand instead of using an existing 3D library. It took longer, but it meant actually understanding how graphics get from code to pixels on screen instead of trusting a library to handle it.',
    tech: ['JavaScript', 'WebGL', 'GLSL', 'Shaders'],
    result: 'A playable 3D browser game running at 60 FPS with adaptive difficulty scaling.',
    github: 'https://github.com/PrashaantM/BugZapper',
  },
  {
    id: 'malware-containment-research',
    name: 'Malware Containment Research',
    icon: ShieldAlert,
    purpose:
      'A network science research project (UBC COSC 421 team project) on the most effective way to contain a malware outbreak.',
    problem:
      'When malware starts spreading through a network, the usual advice is to cut off the busiest, most connected computers first. That is standard practice, but the team had not seen it actually tested against other strategies to see if it is really the best one.',
    solution:
      'Turned over 125,000 real network traffic records into a map of the network, where each computer is a point and each connection is a line between them. Then tested 8 different ways of ranking which computers matter most, including a method called PageRank (the same idea Google uses to rank web pages), and simulated an outbreak spreading through the network to see which ranking actually contained it best when those computers were cut off first.',
    architecture:
      'Built in R, using a graph analysis library called igraph to build and analyze the network, and standard R data tools to process the results and make charts.',
    decision:
      'Instead of assuming the standard approach (cutting off the busiest computers) was actually the best one, tested it directly against a PageRank-based approach and let a simulation decide which one actually worked better.',
    tech: ['R', 'igraph', 'Graph Theory', 'SIR Simulation', 'Network Science'],
    result:
      'The PageRank-based approach contained outbreaks about 15 to 20 percent more effectively than just cutting off the busiest computers. Quiet "bottleneck" computers, the ones connecting otherwise-separate parts of the network, also turned out to matter more for stopping the spread than the busiest ones did in several of the network layouts tested.',
    github: 'https://github.com/PrashaantM/Malware-Containment-Research',
  },
  {
    id: 'crave',
    name: 'C.R.A.V.E',
    icon: Bike,
    purpose:
      'A mobile cycling app (UBC COSC 341 team project) that combines real-time ride tracking with discovering nearby spots and game-like rewards for riding.',
    problem:
      'Cycling apps usually pick one lane: fitness tracking or navigation. Neither makes a ride more interesting, and neither gives a rider a reason to come back tomorrow.',
    solution:
      'A React Native app combining live GPS ride tracking, route suggestions weighed by distance, safety, and scenery, discovery of nearby restaurants, cafes, and parks along the route, and a badge and monthly leaderboard system to keep people riding.',
    architecture:
      'React Native for the app, the Google Maps API for navigation and real-time tracking, and Figma driving the design process.',
    decision:
      'Ran two full rounds of user testing and shipped what the tests actually surfaced instead of the original design: safety warnings before a ride starts, a fixed km versus km/h mixup, and a reworked rating system after the first round showed people wanted feedback on the places they visited.',
    tech: ['React Native', 'Google Maps API', 'Figma'],
    result:
      'A working app with real GPS tracking and gamification, refined through two rounds of real user testing rather than shipped on a single guess.',
    github: 'https://github.com/PrashaantM/C.R.A.V.E',
  },
]
