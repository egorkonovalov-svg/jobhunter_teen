-- Migration 002: Add CHECK constraints for city, category, and field lengths
-- This is purely additive — no existing data is dropped

-- Validate city against allowed list
ALTER TABLE jobs
  ADD CONSTRAINT jobs_city_check
  CHECK (city IN (
    'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург',
    'Казань', 'Нижний Новгород', 'Челябинск', 'Самара',
    'Уфа', 'Ростов-на-Дону', 'Красноярск', 'Воронеж',
    'Пермь', 'Краснодар', 'Волгоград'
  ));

-- Validate category against allowed list
ALTER TABLE jobs
  ADD CONSTRAINT jobs_category_check
  CHECK (category IN (
    'IT и технологии', 'Курьер и доставка', 'Промоутер',
    'Репетиторство', 'Творчество и дизайн', 'Общепит',
    'Торговля', 'Спорт и фитнес', 'Уход за животными', 'Другое'
  ));

-- Length constraints
ALTER TABLE jobs
  ADD CONSTRAINT jobs_title_length CHECK (char_length(title) <= 200),
  ADD CONSTRAINT jobs_company_length CHECK (char_length(company) <= 100),
  ADD CONSTRAINT jobs_description_length CHECK (char_length(description) <= 10000),
  ADD CONSTRAINT jobs_contact_info_length CHECK (char_length(contact_info) <= 500);

-- Cross-field salary constraint
ALTER TABLE jobs
  ADD CONSTRAINT jobs_salary_range_check
  CHECK (salary_max IS NULL OR salary_min IS NULL OR salary_max >= salary_min);

-- Profile name length
ALTER TABLE profiles
  ADD CONSTRAINT profiles_name_length CHECK (char_length(name) <= 100);
