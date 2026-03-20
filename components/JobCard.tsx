import Link from 'next/link'
import { JOB_TYPES } from '@/lib/constants'

interface Job {
  id: string
  title: string
  company: string
  city: string
  category: string
  type: string
  salary_min?: number | null
  salary_max?: number | null
  created_at: string
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'сегодня'
  if (diffDays === 1) return 'вчера'
  if (diffDays < 7) return `${diffDays} дн. назад`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} нед. назад`
  return `${Math.floor(diffDays / 30)} мес. назад`
}

const TYPE_BADGE: Record<string, { label: string; className: string }> = {
  internship: { label: JOB_TYPES.internship, className: 'bg-teal-light text-teal border border-teal/20' },
  'part-time': { label: JOB_TYPES['part-time'], className: 'bg-amber-50 text-amber-800 border border-amber-200/50' },
  gig: { label: JOB_TYPES.gig, className: 'bg-stone-100 text-stone-700 border border-stone-200/50' },
}

export default function JobCard({ job }: { job: Job }) {
  const badge = TYPE_BADGE[job.type] ?? { label: job.type, className: 'bg-warm-gray text-text-secondary border border-border' }

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="bg-white border border-border rounded-lg p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 group flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-midnight text-white rounded-lg flex items-center justify-center text-sm font-bold shrink-0">
            {job.company.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider">{job.company}</p>
            <h3 className="font-semibold text-midnight leading-snug group-hover:underline decoration-gold/40 underline-offset-2">
              {job.title}
            </h3>
          </div>
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ml-2 ${badge.className}`}>
          {badge.label}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
        <span>{job.city}</span>
        {job.salary_min && (
          <span>
            от {job.salary_min.toLocaleString('ru')} ₽/мес
            {job.salary_max ? ` до ${job.salary_max.toLocaleString('ru')} ₽/мес` : ''}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-text-tertiary mt-auto pt-3 border-t border-border/50">
        <span className="bg-warm-gray text-text-secondary px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">{job.category}</span>
        <span>{timeAgo(job.created_at)}</span>
      </div>
    </Link>
  )
}
