import { z } from 'zod'
import { CITIES, CATEGORIES, JOB_TYPES } from '@/lib/constants'

const jobTypeKeys = Object.keys(JOB_TYPES) as [string, ...string[]]

export const createJobSchema = z.object({
  title: z.string().min(1, 'Название обязательно').max(200, 'Максимум 200 символов'),
  company: z.string().min(1, 'Компания обязательна').max(100, 'Максимум 100 символов'),
  city: z.enum(CITIES as [string, ...string[]]).pipe(
    z.string().refine(v => CITIES.includes(v), 'Выберите город из списка')
  ),
  category: z.enum(CATEGORIES as [string, ...string[]]).pipe(
    z.string().refine(v => CATEGORIES.includes(v), 'Выберите категорию из списка')
  ),
  type: z.enum(jobTypeKeys).pipe(
    z.string().refine(v => jobTypeKeys.includes(v), 'Недопустимый тип работы')
  ),
  salary_min: z.coerce.number().int().min(0).nullable().optional(),
  salary_max: z.coerce.number().int().min(0).nullable().optional(),
  description: z.string().min(1, 'Описание обязательно').max(10000, 'Максимум 10 000 символов'),
  contact_info: z.string().min(1, 'Контакт обязателен').max(500, 'Максимум 500 символов'),
}).superRefine((data, ctx) => {
  if (data.salary_min != null && data.salary_max != null && data.salary_max < data.salary_min) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Максимальная зарплата должна быть не меньше минимальной',
      path: ['salary_max'],
    })
  }
})

export type CreateJobInput = z.infer<typeof createJobSchema>
