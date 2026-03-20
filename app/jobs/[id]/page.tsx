import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import { JOB_TYPES } from '@/lib/constants'
import JobCard from '@/components/JobCard'

const TYPE_BADGE: Record<string, { label: string; className: string }> = {
  internship: { label: JOB_TYPES.internship, className: 'bg-indigo-100 text-indigo-700' },
  'part-time': { label: JOB_TYPES['part-time'], className: 'bg-cyan-100 text-cyan-700' },
  gig: { label: JOB_TYPES.gig, className: 'bg-green-100 text-green-700' },
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

  const badge = TYPE_BADGE[job.type] ?? { label: job.type, className: 'bg-gray-100 text-gray-700' }

  const salaryText = job.salary_min
    ? `${job.salary_min.toLocaleString('ru')}${job.salary_max ? `–${job.salary_max.toLocaleString('ru')}` : '+'} ₽/мес`
    : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-indigo-600">Главная</Link>
        <span>→</span>
        <Link href="/jobs" className="hover:text-indigo-600">Вакансии</Link>
        <span>→</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{job.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl font-bold text-indigo-600 shrink-0">
                {job.company.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
                <p className="text-gray-600 font-medium">{job.company}</p>
              </div>
              <span className={`text-xs font-medium px-3 py-1.5 rounded-full shrink-0 ${badge.className}`}>
                {badge.label}
              </span>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <span>📍</span>
                <span>{job.city}</span>
              </div>
              {salaryText && (
                <div className="flex items-center gap-1.5">
                  <span>💰</span>
                  <span>{salaryText}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span>🏷️</span>
                <span>{job.category}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 text-gray-700 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-800 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1">
              <ReactMarkdown>{job.description}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-4">
          {/* Contact Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Контактная информация</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Компания</p>
                <p className="font-medium text-gray-900">{job.company}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Город</p>
                <p className="font-medium text-gray-900">{job.city}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Как связаться</p>
                <p className="text-gray-800 text-sm whitespace-pre-wrap">{job.contact_info}</p>
              </div>
            </div>

            {job.contact_info.includes('@') ? (
              <a
                href={`mailto:${job.contact_info.trim()}`}
                className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#4F46E5] text-white rounded-lg font-semibold hover:bg-[#4338CA] transition-colors"
              >
                Откликнуться по email
              </a>
            ) : (
              <div className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#4F46E5] text-white rounded-lg font-semibold opacity-90 select-all cursor-pointer text-sm text-center">
                {job.contact_info}
              </div>
            )}

            <p className="text-xs text-gray-400 mt-3 text-center">
              Свяжитесь с работодателем напрямую
            </p>
          </div>

          {/* Share */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 text-center">
              Поделитесь вакансией с другом!
            </p>
            <p className="text-xs text-gray-400 text-center mt-1">
              #{job.category.split(' ')[0].replace('/', '')}
            </p>
          </div>
        </div>
      </div>

      {/* Related Jobs */}
      {relatedJobs && relatedJobs.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Похожие вакансии — {job.category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedJobs.map(related => (
              <JobCard key={related.id} job={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
