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
  internship: { label: JOB_TYPES.internship, className: 'bg-indigo-100 text-indigo-700' },
  'part-time': { label: JOB_TYPES['part-time'], className: 'bg-cyan-100 text-cyan-700' },
  gig: { label: JOB_TYPES.gig, className: 'bg-green-100 text-green-700' },
}

export default function JobCard({ job }: { job: Job }) {
  const badge = TYPE_BADGE[job.type] ?? { label: job.type, className: 'bg-gray-100 text-gray-700' }

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-lg font-bold text-indigo-600 shrink-0">
            {job.company.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-gray-500">{job.company}</p>
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors leading-snug">
              {job.title}
            </h3>
          </div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ml-2 ${badge.className}`}>
          {badge.label}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
        <span>📍 {job.city}</span>
        {job.salary_min && (
          <span>
            💰 от {job.salary_min.toLocaleString('ru')} ₽/мес
            {job.salary_max ? ` до ${job.salary_max.toLocaleString('ru')} ₽/мес` : ''}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-1 border-t border-gray-100">
        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{job.category}</span>
        <span>{timeAgo(job.created_at)}</span>
      </div>
    </Link>
  )
}
