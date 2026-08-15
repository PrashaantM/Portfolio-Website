# Portfolio Website — Build & Learn Instruction Set

> **Purpose:** Build a polished, highly personal software-engineering portfolio while learning the engineering, design, animation, accessibility, performance, and deployment decisions behind it.
>
> **Working rule:** Use Claude Code as a pair programmer, not an autopilot. For every substantial change, understand what changed, why it was chosen, and how you would reproduce it without Claude.

---

## 0. Project Rules

### Learning rules

- [ ] Read this file before starting each phase.
- [ ] Complete phases in order unless a step explicitly says otherwise.
- [ ] Do not ask Claude Code to "build the whole portfolio" in one shot.
- [ ] Ask Claude Code for explanations before asking it to implement unfamiliar concepts.
- [ ] After every major implementation, inspect the files yourself.
- [ ] Be able to explain every dependency you add.
- [ ] Be able to explain the component architecture.
- [ ] Be able to explain how animations work at a high level.
- [ ] Run the project's checks after meaningful changes.
- [ ] Keep commits small and descriptive.
- [ ] Do not copy code you cannot explain.
- [ ] If Claude Code makes a large change, review the diff before accepting it.

### Design rules

The portfolio should feel like **a software engineer's personal world**, not an anime fan site.

Anime, music, drawing, gym, and other interests should influence the visual language without overwhelming the actual portfolio.

Use inspiration rather than directly copying copyrighted artwork.

The visual system should draw from:

- **Demon Slayer** — Japanese-inspired motifs, breathing/flow animations, ink/water/sword-motion ideas, dramatic transitions.
- **Attack on Titan** — military/document UI elements, map/grid motifs, restrained industrial textures, dramatic scale.
- **Naruto** — chakra-like motion, seals/symbols, scroll/document motifs, energetic transitions.
- **Takopi's Original Sin** — soft/cute visual elements contrasted with darker emotional themes, unusual transitions, hand-drawn imperfections.
- **Lorna Shore / Pain Remains** — dark atmospheric mood, cinematic intensity, layered textures, restrained use of red/black/white, heavy visual rhythm.
- **Bad Omens** — modern dark minimalism, typography, high-contrast composition, polished music-video-like transitions.

Do **not** turn the site into a collage of unrelated references.

---

# Phase 1 — Define the Portfolio Before Coding

## 1.1 Define the site's purpose

Write down answers to these questions in your own notes:

- Who is this portfolio for?
- What should a recruiter understand within 10 seconds?
- What should a technical interviewer understand after 2 minutes?
- What should a developer understand after inspecting the projects?
- What makes this portfolio different from a generic CS-student portfolio?

### Target positioning

The portfolio should communicate:

> Computer Science student and software developer who builds ambitious systems, experiments with AI, and has interests outside programming that influence how he thinks and creates.

Do not copy that sentence blindly. Rewrite it in your own voice.

---

## 1.2 Decide the core pages/sections

Start with a single-page portfolio.

Recommended structure:

1. Hero
2. About / Who I Am
3. Skills / Engineering
4. Featured Projects
5. Future Ideas / Experimental Lab
6. Experience
7. Interests
8. Contact
9. Footer

Do not create ten separate pages unless there is a real information-architecture reason.

---

## 1.3 Plan the user journey

A visitor should be able to:

`Landing → Understand who you are → See technical credibility → Explore projects → See personality → Contact you`

Write down what you want the visitor to think after each section.

---

# Phase 2 — Choose the Technology

## 2.1 Recommended baseline

Use a modern frontend stack you can actually understand.

Suggested:

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion / Motion for React
- Lucide React or another lightweight icon library
- ESLint
- Prettier
- Git

Optional later:

- Three.js / React Three Fiber
- Web Audio API
- GSAP
- Lenis or another smooth-scrolling library

### Important

Do not install every animation library immediately.

Start with CSS + React + one animation library.

Only add another dependency when you can explain why the existing tools are insufficient.

---

## 2.2 Before creating the project

Learn:

- [ ] What React components are
- [ ] What props are
- [ ] What state is
- [ ] What TypeScript adds
- [ ] What Vite does
- [ ] What Tailwind does
- [ ] What an npm package actually is
- [ ] What a build step does

### Claude Code learning prompt

Ask Claude:

> Explain React, TypeScript, Vite, Tailwind, and npm in the context of the portfolio I am about to build. I want the mental model rather than a tutorial. Explain what problem each tool solves and how they interact during development and production builds. Do not write code yet.

---

# Phase 3 — Initialize the Repository

## 3.1 Create the project

Create the project with the stack you selected.

Then verify:

- [ ] Development server starts
- [ ] Production build succeeds
- [ ] TypeScript works
- [ ] Linting works
- [ ] Git repository is initialized
- [ ] Initial commit exists

---

## 3.2 Establish the folder architecture

Aim for a structure conceptually similar to:

```text
portfolio/
├── public/
│   ├── audio/
│   ├── images/
│   └── fonts/
├── src/
│   ├── assets/
│   ├── components/
│   ├── sections/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── portfolio-build.md
├── package.json
└── ...
```

You do not need to copy this structure exactly.

Learn why each directory exists before creating it.

---

# Phase 4 — Create the Design System

Do this before building the actual sections.

## 4.1 Choose the visual identity

Define:

### Primary mood

- Dark
- Cinematic
- Technical
- Atmospheric
- Slightly unsettling
- Personal
- Controlled rather than chaotic

### Typography

Use:

- One display typeface
- One readable body typeface
- Optional monospace typeface for technical elements

Do not use five fonts.

---

## 4.2 Define colors

Create a small design token system.

Example categories:

```text
background
background-secondary
surface
surface-hover
text-primary
text-secondary
accent
accent-secondary
border
success
warning
```

Do not hard-code random colors throughout components.

---

## 4.3 Define spacing and sizing

Establish consistent:

- Section spacing
- Card radius
- Border thickness
- Container width
- Text sizes
- Heading hierarchy
- Button sizing

Learn why design tokens reduce inconsistency.

---

## 4.4 Create visual motifs

Pick a small number of recurring motifs.

Possible motifs:

- Ink particles
- Japanese brush strokes
- Thin grid lines
- Red thread/line animations
- Manga-panel framing
- Scroll/document panels
- Glowing technical diagrams
- Hand-drawn annotations
- Subtle paper/noise textures
- Audio waveform elements
- Constellation-like project connections

Use these repeatedly so the site has a coherent visual language.

---

# Phase 5 — Build the Global Layout

Create:

- [ ] Global background
- [ ] Navigation
- [ ] Main content container
- [ ] Section wrapper
- [ ] Footer
- [ ] Global typography
- [ ] Responsive breakpoints

Do not build complicated animations yet.

First make the layout work at:

- [ ] Mobile
- [ ] Tablet
- [ ] Desktop
- [ ] Large desktop

### Learning checkpoint

Understand:

- CSS layout
- Flexbox
- Grid
- Positioning
- `z-index`
- Responsive design
- CSS variables
- Component composition

---

# Phase 6 — Build the Hero

The hero is the most visually important section.

## Desired concept

The first screen should communicate:

- Your name
- Computer Science / Software Engineering identity
- What you build
- Your personality
- A clear CTA to projects
- A secondary CTA for contact/resume

Possible visual concept:

A dark cinematic environment containing:

- Your name as the dominant typography
- Animated technical diagrams
- A subtle red/white/black visual system
- Moving particles or ink
- A faint Japanese-inspired seal
- Code fragments appearing/disappearing
- A cursor or terminal-like interaction
- A subtle audio-reactive element if music is enabled

Avoid:

- Giant generic 3D laptop
- Stock developer illustrations
- Excessive floating cards
- Constant particle explosions
- A wall of text

---

## 6.1 Hero animation plan

Use animation deliberately.

Possible sequence:

1. Background fades in.
2. Ambient visual elements appear.
3. Name reveals.
4. Subtitle appears.
5. Technical metadata appears.
6. CTA buttons enter.
7. Background continues moving subtly.

Learn:

- Mount/unmount animation
- Opacity
- Transform
- Staggering
- Easing
- Animation duration
- Reduced-motion accessibility

---

# Phase 7 — Build the About Section

The About section should not be a generic biography.

Organize it around **how you think and what you do**.

Potential themes:

### Computer Science

- Software development
- Systems
- AI
- Backend/full-stack development
- Architecture
- Algorithms

### Outside the computer

- Gym
- Calisthenics
- Anime
- Drawing
- Deathcore
- Music
- Experimenting with ideas

### Personal principle

Explain that you enjoy learning by building.

---

## Visual idea

Create a visual "identity map":

```text
                COMPUTER SCIENCE
                       |
          +------------+------------+
          |            |             |
        AI         SOFTWARE       SYSTEMS
          |
          +----------------+
                           |
                        BUILDING
                           |
       +-------------------+-------------------+
       |                   |                   |
      GYM                MUSIC              DRAWING
       |                   |                   |
   DISCIPLINE         EXPERIMENTATION     CREATIVITY
```

This should become an interactive visual rather than literal ASCII art.

---

# Phase 8 — Build the Skills / Engineering Section

Do not make this a list of 40 technologies.

Group skills by what you can actually do.

Possible categories:

### Software Engineering

- Full-stack development
- Backend development
- API design
- Database design
- Testing
- CI/CD
- Docker
- Architecture

### Programming

- Java
- Python
- TypeScript
- JavaScript
- C/C++
- SQL

### Frontend

- React
- Vue
- Tailwind
- Responsive UI

### Systems / Architecture

- REST APIs
- Asynchronous processing
- Multiservice architecture
- PostgreSQL
- Docker
- Background workers

### AI / Development Workflow

- AI-assisted development
- Claude Code
- Prompt engineering
- AI workflows
- Agentic development

Only list technologies you can defend in an interview.

---

# Phase 9 — Build Featured Projects

This is one of the most important sections.

Prioritize projects that demonstrate engineering ability.

For each project show:

- Project name
- One-sentence purpose
- Problem
- Solution
- Architecture
- Technologies
- Interesting engineering decision
- Result
- GitHub
- Live demo when available

---

## 9.1 Project card concept

Do not make every project a basic rectangle.

Consider:

- Hover animation
- Animated architecture diagram
- Project-specific visual
- Tech stack badges
- Expandable technical details
- GitHub link
- Demo link
- "How it works" mode

---

## 9.2 Featured project priorities

Start with your strongest existing projects.

Potential examples include:

- MCQ Exam Management Platform
- BestBytes
- DormDash
- Job Portal
- Game of Amazons AI
- Super Bug Zapper
- Other strong GitHub projects

Do not include weak projects just to increase the project count.

---

# Phase 10 — Create the Experimental Lab

This is where your future ideas become a major differentiator.

Call it something like:

- Experimental Lab
- Ideas
- Research Lab
- Things I Want to Build
- The Workshop
- Unfinished Systems
- Projects From My Brain

Each idea should look like a concept rather than a completed product.

---

## 10.1 Idea #1 — Song Mashup Generator

Concept:

A music tool where users can:

- Select songs from supported sources
- Manually align/mash sections
- Generate an AI-assisted mashup
- Edit the generated result
- Adjust timing
- Potentially isolate vocals/instrumentals
- Export the result

Possible visual:

An interactive timeline/waveform.

---

## 10.2 Idea #2 — Vocal Accuracy / Metal Vocal Analyzer

Concept:

For clean vocals:

- Track fundamental frequency
- Convert frequency to MIDI notes
- Map melodies
- Analyze formants
- Analyze MFCCs
- Infer vowel characteristics

For screams:

- Do not rely on conventional pitch tracking
- Analyze spectral flatness
- Analyze zero-crossing rate
- Detect rhythmic timing
- Explore hidden vocal textures

Possible visual:

A live vocal-analysis dashboard showing:

```text
Pitch
MIDI
Formants
MFCC
Spectral Flatness
Zero Crossing Rate
Rhythm
```

This could become one of the most technically interesting future projects.

---

## 10.3 Idea #3 — Claude Code Instruction / Codebase Intelligence Tool

Concept:

An application that:

- Creates Claude Code instruction sets
- Generates project-specific prompts
- Visually maps a codebase
- Explains architecture
- Compares the current codebase against engineering best practices
- Identifies architectural weaknesses
- Helps create better development workflows

Possible portfolio visualization:

Interactive codebase graph:

```text
Frontend
   |
API Layer
   |
Services
   |
Database
```

with clickable dependencies.

---

## 10.4 Idea #4 — Email Filtering Tool

Concept:

A tool that:

- Categorizes emails
- Detects newsletters
- Prioritizes important messages
- Suggests actions
- Filters noise
- Potentially uses AI classification

Show this as an automation/productivity experiment.

---

## 10.5 Idea #5 — CS Learning Roadmap

Concept:

A GitHub-like learning system where:

- Courses become roadmap nodes
- Projects become milestones
- Notes are attached to topics
- Progress is tracked
- Previous work can be revisited
- AI can answer questions
- AI can re-teach concepts
- Knowledge gaps can be identified

Visual concept:

An interactive CS skill tree.

---

## 10.6 Idea #6 — Claude Brainrot Sound Effects Extension

Concept:

A browser/developer extension that adds ridiculous sound effects to Claude Code interactions.

This should be presented as a deliberately humorous project.

Possible interactions:

- Successful build → sound
- Failed test → sound
- Claude makes a questionable decision → sound
- Massive refactor → dramatic sound
- User accepts a change → sound

The contrast between serious engineering projects and this idea can add personality.

---

## 10.7 Idea #7 — AI-Assisted Drawing Tool

Concept:

A drawing application where the user hand-draws strokes and AI interprets those strokes.

Possible workflow:

```text
Hand-drawn stroke
       ↓
AI interpretation
       ↓
"Make this a sword"
       ↓
Generated visual
       ↓
Preserve original stroke structure
```

This connects directly to your interest in drawing.

---

## 10.8 Idea #8 — Split-Screen Window Manager

Concept:

A tool for organizing:

- Browser tabs
- Browser windows
- Desktop applications
- Multiple workspaces
- Split-screen layouts

The goal is reducing the chaos of managing many windows.

---

## 10.9 Idea #9 — Network Visibility / Educational Analyzer

Concept:

An educational network-analysis tool inspired by packet-analysis software.

Important:

Do not present it as a tool for secretly monitoring other people's activity.

Frame it around:

- Networks you own
- Authorized lab environments
- Packet metadata
- IP addresses
- Protocols
- Connections
- Application identification where technically/legal permitted

The portfolio can focus on the networking concepts rather than surveillance.

---

## 10.10 Idea #10 — Adaptive Unilateral Workout Tracker

Concept:

A workout tracking system designed around unilateral capability.

Potential functionality:

- Record left/right performance separately
- Track repetitions
- Estimate strength asymmetry
- Adjust workout recommendations
- Track progress over time
- Support users who cannot perform exercises symmetrically

Keep this project framed around adaptive training rather than medical treatment.

---

# Phase 11 — Music System

Music should be optional.

## Do not autoplay audio by default.

Browsers commonly restrict autoplay, and unexpected audio is poor UX.

Instead create an explicit music control.

Possible UI:

```text
[ MUSIC OFF ]

When enabled:

[ ▶ PAIN REMAINS ]
Volume ━━━━━━━
```

---

## 11.1 Music direction

Use music as atmosphere, not as a distraction.

Potential influences:

- Lorna Shore
- Pain Remains
- Bad Omens
- Glennwood

If using actual copyrighted recordings, make sure you have the rights/licensing needed for public distribution.

Safer alternatives:

- Original ambient audio
- Royalty-free tracks
- Self-created audio
- Short interface sound effects
- User-provided local playback

---

## 11.2 Audio-reactive visuals

A future enhancement could use:

- Web Audio API
- Frequency data
- Amplitude
- Waveforms
- Spectral information

Example:

Music playing:

```text
Audio
  ↓
Web Audio API
  ↓
Frequency analysis
  ↓
Animation parameters
  ↓
Particles / lines / glow / waveform
```

Build this only after the rest of the site is stable.

---

# Phase 12 — Anime-Inspired Visual System

Use references carefully.

## Demon Slayer

Possible implementation:

- Ink/water-like transitions
- Breathing-inspired animation rhythm
- Brush-stroke separators
- Sword-slash section transitions
- Japanese typography accents

## Attack on Titan

Possible implementation:

- Tactical diagrams
- Military-document cards
- Map-like backgrounds
- Grid systems
- "Mission" terminology for projects

## Naruto

Possible implementation:

- Chakra-like particles
- Scroll-like project details
- Seal-inspired UI markers
- Energy trails

## Takopi's Original Sin

Possible implementation:

- Cute visual accents
- Hand-drawn imperfections
- Abrupt tonal contrast
- Soft illustrations against darker UI

### Rule

Do not use copyrighted character images as decorative assets unless you have the rights.

Prefer original motifs that communicate the inspiration.

---

# Phase 13 — Animation Architecture

Animations should be reusable.

Create a small animation vocabulary.

Examples:

```text
fadeUp
fadeIn
scaleIn
slideIn
staggerChildren
hoverLift
glitch
inkReveal
drawLine
parallax
```

Do not create unique animation code for every element.

---

## 13.1 Learn animation fundamentals

Understand:

- Transform
- Opacity
- Easing
- Keyframes
- Transition
- RequestAnimationFrame
- Intersection Observer
- Framer Motion / Motion
- Layout animation
- Scroll-driven animation
- GPU-friendly properties

Prefer animating:

- `transform`
- `opacity`

Be cautious with expensive continuous layout calculations.

---

# Phase 14 — Interactive Project Visualization

Create at least one impressive technical visualization.

Recommended choice:

## Interactive architecture map

Example:

```text
                  FRONTEND
                     |
              REST / HTTP API
                     |
          +----------+----------+
          |                     |
      SERVICES              WORKER
          |                     |
          +----------+----------+
                     |
                  DATABASE
```

Clicking a node should reveal:

- Technology
- Responsibility
- Why it exists
- Interesting implementation detail

This demonstrates that you understand architecture rather than merely listing technologies.

---

# Phase 15 — Accessibility

Do not treat accessibility as an afterthought.

Implement:

- [ ] Semantic HTML
- [ ] Keyboard navigation
- [ ] Visible focus states
- [ ] Alt text where needed
- [ ] Proper button elements
- [ ] Proper headings
- [ ] Sufficient contrast
- [ ] Reduced-motion support
- [ ] No essential information hidden behind hover
- [ ] Audio controls accessible by keyboard

Respect:

```css
prefers-reduced-motion
```

Animations should be reduced or disabled when requested by the operating system.

---

# Phase 16 — Responsive Design

Test at minimum:

- [ ] 320px
- [ ] 375px
- [ ] 768px
- [ ] 1024px
- [ ] 1440px
- [ ] Large desktop

Do not simply shrink the desktop layout.

Some interactions should change entirely on mobile.

For example:

Desktop:

```text
Interactive architecture graph
```

Mobile:

```text
Scrollable architecture cards
```

---

# Phase 17 — Performance

Before adding more effects, measure the site.

Check:

- [ ] Bundle size
- [ ] Image sizes
- [ ] Font loading
- [ ] Animation performance
- [ ] Layout shifts
- [ ] Initial page load
- [ ] Lighthouse
- [ ] Mobile performance

Avoid:

- Huge unoptimized images
- Constant JavaScript animation loops
- Excessive particle counts
- Loading every section's assets immediately
- Large dependencies for tiny effects

Use lazy loading where appropriate.

---

# Phase 18 — SEO and Metadata

Add:

- Page title
- Description
- Open Graph metadata
- Social preview image
- Favicon
- Semantic headings
- Canonical URL when appropriate

Create a portfolio preview image that matches the site's visual identity.

---

# Phase 19 — GitHub Integration

Where useful, show real project information.

Possible integrations:

- GitHub repositories
- Commit activity
- Languages
- Stars
- Project links

Do not make the portfolio dependent on GitHub's API for core content.

If the API fails, the portfolio should still work.

---

# Phase 20 — Testing

Create meaningful tests.

At minimum:

### Unit/component tests

Test:

- Navigation
- Project cards
- Filters
- Interactive controls
- Music toggle
- Important data transformations

### Accessibility

Test keyboard navigation.

### End-to-end

Test:

```text
Open site
→ Navigate
→ Open project
→ Use interaction
→ Contact
```

---

# Phase 21 — Security

Review:

- [ ] No API keys in frontend source
- [ ] No secrets committed
- [ ] External links use appropriate security attributes when needed
- [ ] User input is sanitized where applicable
- [ ] Third-party scripts are minimized
- [ ] Dependencies are reviewed
- [ ] Forms have abuse protection if a backend is used

Remember:

A frontend application is public code.

Never put secrets into it.

---

# Phase 22 — Deployment

Choose a deployment platform.

Possible options:

- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages

The deployment should:

- Build automatically
- Deploy from Git
- Use HTTPS
- Have a custom domain if you eventually want one

---

# Phase 23 — Final Portfolio Content

Before calling it complete, verify that the portfolio contains:

## Identity

- [ ] Name
- [ ] CS / software engineering positioning
- [ ] Short description
- [ ] Contact
- [ ] GitHub
- [ ] LinkedIn
- [ ] Resume

## Engineering

- [ ] Strong featured projects
- [ ] Technical details
- [ ] Architecture
- [ ] Skills
- [ ] Experience
- [ ] GitHub links

## Personality

- [ ] Gym
- [ ] Anime
- [ ] Music
- [ ] Drawing
- [ ] Other genuine interests

## Experimental work

- [ ] Song mashup idea
- [ ] Vocal analyzer
- [ ] Claude Code/codebase tool
- [ ] Email filter
- [ ] CS learning platform
- [ ] Brainrot extension
- [ ] AI drawing app
- [ ] Window manager
- [ ] Network-analysis project
- [ ] Adaptive workout tracker

---

# Phase 24 — Final Visual Review

Open the site as if you are a recruiter.

Ask:

### First 5 seconds

Can I tell:

- Who is this?
- What does he do?
- Why should I care?

### First 30 seconds

Can I find:

- Projects?
- Experience?
- GitHub?
- Contact?
- Resume?

### First 2 minutes

Can I understand:

- What he is technically capable of?
- What he has actually built?
- How he thinks?
- What makes him different?

---

# Phase 25 — Claude Code Workflow

Use Claude Code in this order.

## Step A — Ask for understanding

Example:

> Before changing anything, inspect the current project and explain the architecture. Tell me what each relevant file does and what you recommend changing. Do not modify files yet.

## Step B — Ask for a plan

> Create a small implementation plan for this feature. Identify which files should change, why they should change, and any risks. Do not implement it yet.

## Step C — Implement

> Implement only the plan we agreed on. Keep the changes minimal and follow the existing architecture.

## Step D — Review

> Review your changes as a senior engineer. Identify bugs, unnecessary complexity, accessibility issues, performance problems, and architectural issues. Do not change anything yet.

## Step E — Test

> Run the relevant tests, linting, and build checks. Explain any failures and their likely causes.

## Step F — Teach

> Now explain the implementation to me as if I need to recreate it myself without Claude Code. Focus on the important concepts rather than explaining every line.

---

# Phase 26 — Claude Code Rules for This Project

Do not routinely use:

> "Make the website better."

Instead use specific tasks:

> "Implement the hero entrance animation using the existing animation system. Keep the animation under 1.2 seconds, support reduced motion, and do not add a new dependency."

Good prompts specify:

1. Goal
2. Constraints
3. Existing architecture
4. Expected behavior
5. Verification

---

# Phase 27 — Build Order

Follow this exact order unless you have a good reason not to.

- [ ] Phase 1 — Portfolio purpose
- [ ] Phase 2 — Technology decisions
- [ ] Phase 3 — Repository initialization
- [ ] Phase 4 — Design system
- [ ] Phase 5 — Global layout
- [ ] Phase 6 — Hero
- [ ] Phase 7 — About
- [ ] Phase 8 — Skills
- [ ] Phase 9 — Featured projects
- [ ] Phase 10 — Experimental Lab
- [ ] Phase 11 — Music
- [ ] Phase 12 — Anime-inspired visual language
- [ ] Phase 13 — Animation architecture
- [ ] Phase 14 — Architecture visualization
- [ ] Phase 15 — Accessibility
- [ ] Phase 16 — Responsive design
- [ ] Phase 17 — Performance
- [ ] Phase 18 — SEO
- [ ] Phase 19 — GitHub integration
- [ ] Phase 20 — Testing
- [ ] Phase 21 — Security
- [ ] Phase 22 — Deployment
- [ ] Phase 23 — Final content
- [ ] Phase 24 — Visual review

---

# Phase 28 — Definition of Done

The portfolio is not complete merely because it looks good.

It is complete when:

- [ ] The design is recognizably mine.
- [ ] The site works without JavaScript errors.
- [ ] Production build succeeds.
- [ ] Tests pass.
- [ ] Linting passes.
- [ ] It is responsive.
- [ ] It is keyboard accessible.
- [ ] Reduced motion works.
- [ ] Audio is opt-in.
- [ ] Performance is acceptable on mobile.
- [ ] No secrets are exposed.
- [ ] Project information is accurate.
- [ ] Links work.
- [ ] Resume is accessible.
- [ ] Contact method works.
- [ ] The site has meaningful engineering details.
- [ ] The visual effects support the content instead of hiding it.
- [ ] I can explain the architecture.
- [ ] I can explain the major dependencies.
- [ ] I can explain the animation system.
- [ ] I can explain the deployment process.
- [ ] I understand the code Claude Code generated.

---

# Phase 29 — Ongoing Project Log

Use this section while building.

## Decisions

Record important decisions and why you made them.

```text
Date:
Decision:
Alternatives considered:
Why:
Tradeoffs:
```

## Things I Learned

```text
Concept:
What I thought before:
What I understand now:
Example:
```

## Claude Code Mistakes

Record mistakes Claude makes.

```text
Problem:
Why it happened:
How I detected it:
How it was fixed:
How I can prevent it:
```

This is important. The goal is not simply to produce a portfolio; it is to become better at reviewing AI-generated software.

## Future Improvements

Keep ideas here rather than interrupting the current build.

```text
-
-
-
```

---

# Final Principle

The portfolio should demonstrate three things simultaneously:

### 1. I can build.

The projects prove technical ability.

### 2. I can think.

The architecture explanations, experiments, and ideas prove curiosity and engineering judgment.

### 3. I have a personality.

The anime, music, gym, drawing, and other interests make the site recognizable as mine.

The goal is **not** to build the most complicated portfolio possible.

The goal is to build a portfolio that makes someone think:

> "This person clearly knows how to build software, thinks deeply about what they build, and has a distinctive personality."

Build it incrementally. Learn the concepts. Review the code. Keep the visual system coherent. Let the engineering work remain the centerpiece.
