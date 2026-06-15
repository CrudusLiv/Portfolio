import { education, certificates } from '@/lib/data'
import { SectionWrapper } from '@/components/section-wrapper'

export function Education() {
  return (
    <SectionWrapper id="education">
      <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
        <span className="font-mono text-accent text-xl">04.</span> Education & Certificates
      </h2>
      <div className="space-y-10">
        <div>
          <ol className="space-y-6">
            {education.map((entry, i) => (
              <li key={i} className="border border-border rounded-lg p-5 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h3 className="text-lg font-semibold">{entry.institution}</h3>
                  <span className="font-mono text-sm text-muted-foreground shrink-0">
                    {entry.dateRange}
                  </span>
                </div>
                <p className="text-accent font-medium text-sm">{entry.degree}</p>
                <p className="text-muted-foreground text-sm">{entry.location}</p>
                <p className="text-sm mt-2">
                  <span className="font-mono text-muted-foreground">GPA </span>
                  <span className="font-semibold">{entry.gpa}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>

        {certificates.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Certificates</h3>
            <ul className="space-y-2">
              {certificates.map((cert, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-accent shrink-0">▸</span>
                  <span>
                    <span className="font-medium text-foreground">{cert.title}</span>
                    {' — '}
                    {cert.issuer}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
