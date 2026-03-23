'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createJobSchema } from '@/lib/schemas/job'
import type { ZodError } from 'zod'

export type CreateJobResult =
  | { success: true }
  | { success: false; fieldErrors: Record<string, string[]> }
  | { success: false; error: string }

export async function createJob(formData: FormData): Promise<CreateJobResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Verify employer role server-side — never trust client
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'employer') {
    return { success: false, error: 'Только работодатели могут размещать вакансии' }
  }

  // Parse and validate with Zod
  const raw = {
    title: formData.get('title'),
    company: formData.get('company'),
    city: formData.get('city'),
    category: formData.get('category'),
    type: formData.get('type'),
    salary_min: formData.get('salary_min') || null,
    salary_max: formData.get('salary_max') || null,
    description: formData.get('description'),
    contact_info: formData.get('contact_info'),
  }

  const parsed = createJobSchema.safeParse(raw)

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as Record<string, string[]>
    return { success: false, fieldErrors }
  }

  const { error: insertError } = await supabase.from('jobs').insert({
    employer_id: user.id,
    ...parsed.data,
    is_active: true,
  })

  if (insertError) {
    // Do not expose raw Postgres error to client
    console.error('[createJob] insert error:', insertError.message)
    return { success: false, error: 'Ошибка при публикации вакансии. Попробуйте позже.' }
  }

  redirect('/dashboard')
}
