'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CITIES, CATEGORIES, JOB_TYPES } from '@/lib/constants'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Profile {
  id: string
  name: string
  company_name: string | null
  city: string | null
  role: string
}

export default function PostJobPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
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

    if (!title || !company || !city || !category || !contactInfo || !description) {
      setError('Пожалуйста, заполните все обязательные поля')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    const { error: insertError } = await supabase.from('jobs').insert({
      employer_id: user.id,
      title,
      company,
      city,
      category,
      type,
      salary_min: salaryMin ? parseInt(salaryMin) : null,
      salary_max: salaryMax ? parseInt(salaryMax) : null,
      description,
      contact_info: contactInfo,
      is_active: true,
    })

    if (insertError) {
      setError('Ошибка при публикации вакансии. Попробуйте позже.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Разместить вакансию</h1>
        <p className="text-gray-500 mt-1">Найдите сотрудников среди подростков 14–18 лет</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <Input
          label="Название вакансии *"
          type="text"
          placeholder="Например: Курьер на велосипеде"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <Input
          label="Компания *"
          type="text"
          placeholder="Название компании или ИП"
          value={company}
          onChange={e => setCompany(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Город *</label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
            >
              <option value="">Выберите город</option>
              {CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Категория *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
            >
              <option value="">Выберите категорию</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Job Type */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Тип работы *</p>
          <div className="flex gap-3">
            {(Object.entries(JOB_TYPES) as [string, string][]).map(([value, label]) => (
              <label
                key={value}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border-2 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
                  type === value
                    ? 'border-[#4F46E5] bg-indigo-50 text-[#4F46E5]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
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
          <p className="text-sm font-medium text-gray-700 mb-2">Зарплата (₽/мес, необязательно)</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="От"
              value={salaryMin}
              onChange={e => setSalaryMin(e.target.value)}
              min={0}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
            />
            <span className="text-gray-400">—</span>
            <input
              type="number"
              placeholder="До"
              value={salaryMax}
              onChange={e => setSalaryMax(e.target.value)}
              min={0}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Описание вакансии *
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            rows={6}
            placeholder="Опишите обязанности, требования, условия работы. Поддерживает markdown-форматирование."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] resize-y"
          />
          <p className="text-xs text-gray-400">Поддерживает Markdown: **жирный**, *курсив*, - списки</p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Контактная информация *
          </label>
          <textarea
            value={contactInfo}
            onChange={e => setContactInfo(e.target.value)}
            required
            rows={3}
            placeholder="Телефон, email, Telegram (@username) или другой способ связи"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] resize-none"
          />
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
          >
            Отмена
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Публикуем...' : 'Опубликовать вакансию'}
          </Button>
        </div>
      </form>
    </div>
  )
}
