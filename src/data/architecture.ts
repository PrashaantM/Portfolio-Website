export interface ArchitectureNode {
  id: string
  label: string
  technology: string
  responsibility: string
  why: string
  detail: string
}

// Feeds ArchitectureMap (rendered inside Projects.tsx's "Architecture
// Deep Dive"): click a node, reveal its technology, responsibility, why
// it exists, and an implementation detail. Content is grounded entirely
// in the MCQ Exam Management Platform's own entry in
// `src/data/projects.ts` (its architecture and decision fields);
// nothing here goes beyond framing those same facts per node. The MCQ
// platform is the flagship project with the most detailed architecture
// on record, which is why it's the one this section walks through
// rather than adding a shallower map for every project.
export const ARCHITECTURE_NODES: ArchitectureNode[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    technology: 'React and Tailwind CSS',
    responsibility:
      'Question bank management, exam building, and the results/analytics dashboard instructors actually use day to day.',
    why:
      'Instructors need to manage hundreds of questions and review results without touching a database directly. A component-based UI keeps that workflow fast to build and change as requirements shifted through the capstone.',
    detail:
      'Talks to the backend over a REST API secured with JWTs, so the frontend never holds anything more sensitive than a short-lived token.',
  },
  {
    id: 'api',
    label: 'REST API / Auth',
    technology: 'FastAPI with JWT authentication and role-based access control',
    responsibility:
      'Every request from the frontend passes through here first: validating who the user is, what role they hold (instructor, admin), and whether that role permits the action being requested.',
    why:
      'A grading platform is exactly the kind of system where "who is allowed to see this" cannot be an afterthought. Putting role checks at the API layer means every route enforces the same rule instead of trusting the frontend to hide a button.',
    detail:
      'Handles the fast, synchronous work directly. Anything heavy, like generating exam variants, gets handed off to the background worker instead of blocking a request.',
  },
  {
    id: 'worker',
    label: 'Background Worker',
    technology: 'A Dockerized background worker for asynchronous processing',
    responsibility:
      'Generates multiple exam variants with matching answer keys, the one operation in the system heavy enough to make a request wait if it ran inline.',
    why:
      'Multi-variant generation is computationally heavy and does not need to happen in the few hundred milliseconds a normal API response takes. Moving it off the request path keeps the rest of the API responsive while that job runs.',
    detail:
      'Optimized and load tested for up to 10 concurrent task executions, then validated against the system as a whole holding up under 100+ concurrent users.',
  },
  {
    id: 'database',
    label: 'Database',
    technology: 'PostgreSQL',
    responsibility:
      'Stores question banks, generated exam variants, answer keys, and results, the durable record everything else in the system reads from and writes to.',
    why:
      'A relational database fits this data naturally: questions belong to banks, exams reference specific questions, and results reference specific exam variants. Those relationships are exactly what foreign keys and joins are for.',
    detail:
      'Sits behind both the API and the worker, so the two ways exam data gets written (an instructor editing a question bank, the worker generating variants) end up in the same consistent store instead of two.',
  },
]
