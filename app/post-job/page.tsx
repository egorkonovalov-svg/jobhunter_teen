'use client'

import { useState, useEffect, FormEvent, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CITIES, CATEGORIES, JOB_TYPES } from '@/lib/constants'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { createJob, type CreateJobResult } from './actions'

interface Profile {
  id: string
  name: string
  company_name: string | null
  city: string | null
  role: string
}

export default function PostJobPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState<'internship' | 'part-time' | 'gig'>('part-time')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [description, setDescription] = useState('')
  const [contactInfo, setContactInfo] = useState('')

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        if (data.role !== 'employer') {
          router.push('/?message=only_employers')
          return
        }
        setProfile(data)
        if (data.company_name) setCompany(data.company_name)
        if (data.city) setCity(data.city)
      }
    }
    loadProfile()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    const fd = new FormData()
    fd.append('title', title)
    fd.append('company', company)
    fd.append('city', city)
    fd.append('category', category)
    fd.append('type', type)
    if (salaryMin) fd.append('salary_min', salaryMin)
    if (salaryMax) fd.append('salary_max', salaryMax)
    fd.append('description', description)
    fd.append('contact_info', contactInfo)

    startTransition(async () => {
      const result = await createJob(fd)
      if (!result.success) {
        if ('fieldErrors' in result) {
          setFieldErrors(result.fieldErrors)
        } else {
          setError(result.error)
        }
      }
      // On success, redirect() in the server action handles navigation
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-midnight heading-display">Разместить вакансию</h1>
        <p className="text-text-secondary mt-1">Найдите сотрудников среди подростков 14–18 лет</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-border rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-5">
        <div className="flex flex-col gap-1">
          <Input
            label="Название вакансии *"
            type="text"
            placeholder="Например: Курьер на велосипеде"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          {fieldErrors.title && (
            <p className="text-xs text-red-600">{fieldErrors.title[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Input
            label="Компания *"
            type="text"
            placeholder="Название компании или ИП"
            value={company}
            onChange={e => setCompany(e.target.value)}
            required
          />
          {fieldErrors.company && (
            <p className="text-xs text-red-600">{fieldErrors.company[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Город *</label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              required
              className="w-full px-3 py-2 border border-border rounded-lg text-midnight focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
            >
              <option value="">Выберите город</option>
              {CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {fieldErrors.city && (
              <p className="text-xs text-red-600">{fieldErrors.city[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Категория *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
              className="w-full px-3 py-2 border border-border rounded-lg text-midnight focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
            >
              <option value="">Выберите категорию</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {fieldErrors.category && (
              <p className="text-xs text-red-600">{fieldErrors.category[0]}</p>
            )}
          </div>
        </div>

        {/* Job Type */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Тип работы *</p>
          <div className="flex gap-3">
            {(Object.entries(JOB_TYPES) as [string, string][]).map(([value, label]) => (
              <label
                key={value}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border-2 rounded-lg cursor-pointer text-sm font-medium transition-all duration-300 ${
                  type === value
                    ? 'border-gold bg-gold/5 text-gold'
                    : 'border-border text-text-secondary hover:border-border/80'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={value}
                  checked={type === value}
                  onChange={() => setType(value as typeof type)}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Salary */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Зарплата (₽/мес, необязательно)</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="От"
              value={salaryMin}
              onChange={e => setSalaryMin(e.target.value)}
              min={0}
              className="flex-1 px-3 py-2 border border-border rounded-lg text-midnight focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
            />
            <span className="text-text-tertiary">—</span>
            <input
              type="number"
              placeholder="До"
              value={salaryMax}
              onChange={e => setSalaryMax(e.target.value)}
              min={0}
              className="flex-1 px-3 py-2 border border-border rounded-lg text-midnight focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
            />
          </div>
          {(fieldErrors.salary_min || fieldErrors.salary_max) && (
            <p className="text-xs text-red-600 mt-1">
              {fieldErrors.salary_max?.[0] || fieldErrors.salary_min?.[0]}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Описание вакансии *
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            rows={6}
            placeholder="Опишите обязанности, требования, условия работы. Поддерживает markdown-форматирование."
            className="w-full px-3 py-2 border border-border rounded-lg text-midnight placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-gold resize-y transition-all duration-300"
          />
          {fieldErrors.description && (
            <p className="text-xs text-red-600">{fieldErrors.description[0]}</p>
          )}
          <p className="text-xs text-text-tertiary">Поддерживает Markdown: **жирный**, *курсив*, - списки</p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Контактная информация *
          </label>
          <textarea
            value={contactInfo}
            onChange={e => setContactInfo(e.target.value)}
            required
            rows={3}
            placeholder="Телефон, email, Telegram (@username) или другой способ связи"
            className="w-full px-3 py-2 border border-border rounded-lg text-midnight placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-gold resize-none transition-all duration-300"
          />
          {fieldErrors.contact_info && (
            <p className="text-xs text-red-600">{fieldErrors.contact_info[0]}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Отмена
          </Button>
          <Button type="submit" variant="accent" disabled={isPending} className="flex-1">
            {isPending ? 'Публикуем...' : 'Опубликовать вакансию'}
          </Button>
        </div>
      </form>
    </div>
  )
}
