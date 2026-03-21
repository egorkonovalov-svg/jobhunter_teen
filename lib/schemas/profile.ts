import { z } from 'zod'
import { CITIES } from '@/lib/constants'

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Имя обязательно').max(100, 'Максимум 100 символов'),
  city: z.enum(CITIES as [string, ...string[]]).pipe(
    z.string().refine(v => CITIES.includes(v), 'Выберите город из списка')
  ).nullable().optional(),
  company_name: z.string().max(100, 'Максимум 100 символов').nullable().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
