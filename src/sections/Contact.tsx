import { Mail, IdCard, FolderGit2, FileText } from 'lucide-react'
import Section from '../components/Section'
import Button from '../components/Button'
import SwordSlash from '../components/motifs/SwordSlash'

const LINKS = [
  {
    href: 'mailto:mudgala.prashaant@gmail.com',
    label: 'mudgala.prashaant@gmail.com',
    icon: Mail,
    variant: 'primary' as const,
  },
  {
    href: 'https://linkedin.com/in/prashaantmudgala',
    label: 'LinkedIn',
    icon: IdCard,
    variant: 'secondary' as const,
  },
  {
    href: 'https://github.com/PrashaantM',
    label: 'GitHub',
    icon: FolderGit2,
    variant: 'secondary' as const,
  },
  {
    href: '/PrashaantMudgala_Resume.pdf',
    label: 'Resume',
    icon: FileText,
    variant: 'secondary' as const,
  },
]

/**
 * Replaces the "Contact" placeholder from Phase 5, and the site's last
 * section before the footer. Deliberately no form: there's no backend
 * anywhere in this project, so a form here would need its own abuse
 * protection (Phase 21's own rule) for a feature that direct links
 * already cover without one. Phone number left off on purpose too,
 * even though it's on the resume: email/LinkedIn/GitHub is the
 * standard set for a public page anyone on the internet can reach, the
 * resume PDF one click away still has the phone number for anyone who
 * gets that far.
 */
function Contact() {
  return (
    <Section id="contact">
      <SwordSlash />
      <h2>Contact</h2>
      <p className="text-text-secondary mt-3 max-w-2xl text-lg">
        I'm looking for a Fall 2026 Software Engineering co-op. If any of
        this looks like the kind of work you'd want on your team, here's
        how to reach me.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        {LINKS.map((link) => (
          <Button
            key={link.href}
            href={link.href}
            variant={link.variant}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            <link.icon size={16} aria-hidden="true" className="mr-2" />
            {link.label}
          </Button>
        ))}
      </div>
    </Section>
  )
}

export default Contact
