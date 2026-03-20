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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Личный кабинет</h1>
          <p className="text-gray-500 mt-1">
            {profile?.company_name ?? profile?.name ?? 'Работодатель'} ·{' '}
            <span className="text-indigo-600">{activeCount} активных</span> из {totalCount} вакансий
          </p>
        </div>
        <Link
          href="/post-job"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] text-white rounded-lg font-semibold hover:bg-[#4338CA] transition-colors whitespace-nowrap"
        >
          + Разместить ещё вакансию
        </Link>
      </div>

      {/* Jobs List */}
      {!jobs || jobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">У вас пока нет вакансий</h3>
          <p className="text-gray-500 mb-6">Разместите первую вакансию и найдите сотрудников</p>
          <Link
            href="/post-job"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4F46E5] text-white rounded-lg font-semibold hover:bg-[#4338CA] transition-colors"
          >
            Разместить вакансию
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <div
              key={job.id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="font-semibold text-gray-900 hover:text-indigo-700 transition-colors"
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
                <p className="text-sm text-gray-500">
                  {job.city} · {job.category} · Опубликовано: {formatDate(job.created_at)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <form action={toggleJobStatus.bind(null, job.id, job.is_active)}>
                  <button
                    type="submit"
                    className={`text-sm px-3 py-1.5 rounded-lg font-medium border transition-colors ${
                      job.is_active
                        ? 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        : 'border-indigo-300 text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    {job.is_active ? 'Скрыть' : 'Активировать'}
                  </button>
                </form>

                <form action={deleteJob.bind(null, job.id)}>
                  <button
                    type="submit"
                    className="text-sm px-3 py-1.5 rounded-lg font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
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
