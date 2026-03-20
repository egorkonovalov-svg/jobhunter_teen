import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import { JOB_TYPES } from '@/lib/constants'
import JobCard from '@/components/JobCard'

const TYPE_BADGE: Record<string, { label: string; className: string }> = {
  internship: { label: JOB_TYPES.internship, className: 'bg-teal-light text-teal border border-teal/20' },
  'part-time': { label: JOB_TYPES['part-time'], className: 'bg-amber-50 text-amber-800 border border-amber-200/50' },
  gig: { label: JOB_TYPES.gig, className: 'bg-stone-100 text-stone-700 border border-stone-200/50' },
}

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: job } = await supabase
    .from('jobs')
    .select('title, company, city')
    .eq('id', id)
    .single()

  if (!job) return { title: 'Вакансия не найдена' }

  return {
    title: `${job.title} — ${job.company} | РаботаТинейджеров`,
    description: `Вакансия "${job.title}" в ${job.company}, ${job.city}. Работа для подростков.`,
  }
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!job) notFound()

  // Related jobs: same category, exclude current
  const { data: relatedJobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('category', job.category)
    .eq('is_active', true)
    .neq('id', id)
    .limit(3)

  const badge = TYPE_BADGE[job.type] ?? { label: job.type, className: 'bg-warm-gray text-text-secondary border border-border' }

  const salaryText = job.salary_min
    ? `${job.salary_min.toLocaleString('ru')}${job.salary_max ? `–${job.salary_max.toLocaleString('ru')}` : '+'} ₽/мес`
    : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs uppercase tracking-wider text-text-secondary mb-8">
        <Link href="/" className="hover:text-midnight link-underline transition-colors duration-300">Главная</Link>
        <span className="text-text-tertiary">/</span>
        <Link href="/jobs" className="hover:text-midnight link-underline transition-colors duration-300">Вакансии</Link>
        <span className="text-text-tertiary">/</span>
        <span className="text-midnight font-medium truncate max-w-xs normal-case">{job.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-border rounded-lg p-8 mb-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-midnight text-white rounded-lg flex items-center justify-center text-2xl font-bold shrink-0">
                {job.company.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="heading-display text-2xl md:text-3xl font-bold text-midnight mb-1">{job.title}</h1>
                <p className="text-text-secondary font-medium">{job.company}</p>
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded shrink-0 ${badge.className}`}>
                {badge.label}
              </span>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-8 pb-8 border-b border-border">
              <div className="flex items-center gap-1.5">
                <span>{job.city}</span>
              </div>
              {salaryText && (
                <div className="flex items-center gap-1.5">
                  <span>{salaryText}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span>{job.category}</span>
              </div>
            </div>

            {/* Description */}
            <div className="text-text-secondary leading-relaxed [&_h2]:heading-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-midnight [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-midnight [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_p]:mb-4">
              <ReactMarkdown>{job.description}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-4">
          {/* Contact Card */}
          <div className="bg-white border border-border rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-5">Контактная информация</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-text-tertiary mb-1">Компания</p>
                <p className="font-medium text-midnight">{job.company}</p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary mb-1">Город</p>
                <p className="font-medium text-midnight">{job.city}</p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary mb-1">Как связаться</p>
                <p className="text-midnight text-sm whitespace-pre-wrap">{job.contact_info}</p>
              </div>
            </div>

            {job.contact_info.includes('@') ? (
              <a
                href={`mailto:${job.contact_info.trim()}`}
                className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gold text-midnight rounded-lg font-semibold hover:bg-gold-hover hover:scale-[1.02] transition-all duration-300"
              >
                Откликнуться по email
              </a>
            ) : (
              <div className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gold text-midnight rounded-lg font-semibold select-all cursor-pointer text-sm text-center">
                {job.contact_info}
              </div>
            )}

            <p className="text-xs text-text-tertiary mt-3 text-center">
              Свяжитесь с работодателем напрямую
            </p>
          </div>

          {/* Share */}
          <div className="bg-white border border-border rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-sm text-text-secondary text-center">
              Поделитесь вакансией с другом
            </p>
            <p className="text-xs text-text-tertiary text-center mt-1">
              #{job.category.split(' ')[0].replace('/', '')}
            </p>
          </div>
        </div>
      </div>

      {/* Related Jobs */}
      {relatedJobs && relatedJobs.length > 0 && (
        <section className="mt-12">
          <h2 className="heading-display text-xl font-bold text-midnight mb-6">
            Похожие вакансии — {job.category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedJobs.map(related => (
              <JobCard key={related.id} job={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
