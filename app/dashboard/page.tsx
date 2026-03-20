import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import Badge from '@/components/ui/Badge'
import { JOB_TYPES } from '@/lib/constants'

async function toggleJobStatus(jobId: string, currentStatus: boolean) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  await supabase
    .from('jobs')
    .update({ is_active: !currentStatus })
    .eq('id', jobId)
    .eq('employer_id', user.id)
  revalidatePath('/dashboard')
}

async function deleteJob(jobId: string) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  await supabase.from('jobs').delete().eq('id', jobId).eq('employer_id', user.id)
  revalidatePath('/dashboard')
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('employer_id', user.id)
    .order('created_at', { ascending: false })

  const activeCount = jobs?.filter(j => j.is_active).length ?? 0
  const totalCount = jobs?.length ?? 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="heading-display text-2xl font-bold text-midnight">Личный кабинет</h1>
          <p className="text-text-secondary mt-1">
            {profile?.company_name ?? profile?.name ?? 'Работодатель'} ·{' '}
            <span className="text-gold font-medium">{activeCount} активных</span> из {totalCount} вакансий
          </p>
        </div>
        <Link
          href="/post-job"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-midnight rounded-lg font-semibold hover:bg-gold-hover hover:scale-[1.02] transition-all duration-300 whitespace-nowrap"
        >
          + Разместить ещё вакансию
        </Link>
      </div>

      {/* Jobs List */}
      {!jobs || jobs.length === 0 ? (
        <div className="bg-white border border-border rounded-lg p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="heading-display text-5xl font-bold text-border mb-4">0</p>
          <h3 className="text-lg font-semibold text-midnight mb-2">У вас пока нет вакансий</h3>
          <p className="text-text-secondary mb-6">Разместите первую вакансию и найдите сотрудников</p>
          <Link
            href="/post-job"
            className="inline-flex items-center gap-2 px-6 py-3 bg-midnight text-white rounded-lg font-semibold hover:bg-navy hover:scale-[1.02] transition-all duration-300"
          >
            Разместить вакансию
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <div
              key={job.id}
              className="bg-white border border-border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="font-semibold text-midnight hover:underline decoration-gold/40 underline-offset-2 transition-colors duration-300"
                  >
                    {job.title}
                  </Link>
                  <Badge variant={job.is_active ? 'active' : 'inactive'}>
                    {job.is_active ? 'Активна' : 'Скрыта'}
                  </Badge>
                  <Badge variant={job.type as 'internship' | 'part-time' | 'gig'}>
                    {JOB_TYPES[job.type] ?? job.type}
                  </Badge>
                </div>
                <p className="text-sm text-text-secondary">
                  {job.city} · {job.category} · Опубликовано: {formatDate(job.created_at)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <form action={toggleJobStatus.bind(null, job.id, job.is_active)}>
                  <button
                    type="submit"
                    className={`text-sm px-3 py-1.5 rounded-lg font-medium border transition-all duration-300 ${
                      job.is_active
                        ? 'border-border text-text-secondary hover:bg-warm-gray'
                        : 'border-gold/30 text-gold hover:bg-gold/5'
                    }`}
                  >
                    {job.is_active ? 'Скрыть' : 'Активировать'}
                  </button>
                </form>

                <form action={deleteJob.bind(null, job.id)}>
                  <button
                    type="submit"
                    className="text-sm px-3 py-1.5 rounded-lg font-medium border border-red-200 text-red-700 hover:bg-red-50 transition-all duration-300"
                  >
                    Удалить
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
