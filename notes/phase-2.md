# Phase 2 — Choose the Technology

## 2.1 Stack decision

**Core baseline:**

- React
- TypeScript
- Vite
- Tailwind CSS
- Motion (Framer Motion) — animation

**Deliberately deferred:**

- React Three Fiber (Three.js) — held back for one signature moment (Hero
  background or the Phase 14 interactive architecture map), not part of the
  initial build. Added only once the 2D/Motion stack proves insufficient for
  that specific moment.

**Why this stack:**

The "wow" factor for a portfolio comes from craft and restraint (smooth
60fps motion, no jank, one or two standout moments) rather than from the
number of libraries used. React + TS + Vite + Tailwind + Motion covers
scroll-driven reveals, staggered entrances, and layout animation to a level
that's already impressive on its own. A single tasteful WebGL/3D touch later
is what typically produces an actual "how did they build that" reaction —
but adding it now would front-load complexity and dependency weight before
it's earned, which is exactly what Phase 2's "do not install every animation
library immediately" rule warns against.

## 2.2 Concepts learned before creating the project:

- [x] **React components**
      A component is a JS function that returns markup (JSX/TSX). 
      
      You build the UI out of small, reusable pieces — `<Navbar />`, `<Hero />`, `<ProjectCard />` and compose them like building blocks. 
      
      `App.tsx` is just a component that renders other components.

- [x] **Props**
      Short for "properties" 
      
      data passed *into* a component from its parent, like arguments to a function.
      
      One `ProjectCard` component gets reused for every project by passing different props each time: `<ProjectCard title="DormDash" tech={["React","Node"]} />`. Props flow
      
      one direction: parent → child.

- [x] **State**
      Data that lives *inside* a component and can change while the app is running and when it changes, React re-renders that part of the UI automatically. 
      
      Example: whether the mobile nav is open, whether music is playing, which project card is expanded. 
      
      Props answer "what was I given," state answers "what's changing right now."

- [x] **What TypeScript adds**
      Plain JavaScript with types layered on top. 
      
      You describe the *shape* of your data (e.g. every `Project` has a `title: string` `github: string`, `tech: string[]`), and your editor catches mistakes like a typo'd field or passing a number where text is expected before you ever run the code, instead of finding out at runtime.

- [x] **What Vite does**
      Two jobs. 
      
      In development, it's a fast local server with hot reload: save a file, see the change in the browser almost instantly without a
      full page refresh. 
      
      In production, it bundles and minifies everything into a small set of optimized static files (`npm run build` → a n`dist/` folder) that you actually deploy.

- [x] **What Tailwind does**
      Instead of writing custom CSS files and inventing class names, you style elements directly in your markup with small utility classes: `className="flex items-center gap-4 text-red-500"`. 
      
      It solves the problem of styles drifting out of sync like spacing, color, and sizing come from a shared scale, which is exactly what Phase 4's design tokens plug into.

- [x] **What an npm package actually is**
      Code someone else wrote and published to the npm registry that you install (`npm install <package>`) and `import` into your own code
      
      e.g. `motion`, `react`, `lucide-react`. `package.json` lists which packages your project depends on and at what versions;
      
      `node_modules/` is where the downloaded code actually sits (never committed to git because it's regenerated from `package.json`).

- [x] **What a build step does**
      The process that turns your source (`.tsx`, `.ts`, Tailwind classes) into plain HTML/CSS/JS a browser can run — type-checking, bundling many files into few, minifying, and stripping unused code (tree-shaking). 
      
      Dev mode skips most of this for speed; the production build (`npm run build`) does the full pass so what ships is small and fast.

- [x] **What Motion (Framer Motion) adds over plain CSS**
      With CSS you hand-write keyframes and toggle classes to animate things. 
      
      Motion lets you *declare* the start and end state 
      
      e.g. `initial={{opacity:0}} animate={{opacity:1}}` and it handles the interpolation timing. 
      
      It also covers things CSS alone struggles with: animating an element smoothly out *before*  it's removed from the page (exit animations), gesture-based animation (hover/drag), and
      layout animation (elements smoothly repositioning when the layout changes).
