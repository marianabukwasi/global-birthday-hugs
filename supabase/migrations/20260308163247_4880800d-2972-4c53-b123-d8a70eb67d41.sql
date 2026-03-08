
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS user_type text NOT NULL DEFAULT 'giver',
  ADD COLUMN IF NOT EXISTS birthday_day integer,
  ADD COLUMN IF NOT EXISTS birthday_month integer,
  ADD COLUMN IF NOT EXISTS birth_year integer,
  ADD COLUMN IF NOT EXISTS city text DEFAULT '',
  ADD COLUMN IF NOT EXISTS essence_photo_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS core_color text DEFAULT '#F5C842',
  ADD COLUMN IF NOT EXISTS wish_prompt text DEFAULT '',
  ADD COLUMN IF NOT EXISTS content_preference text DEFAULT 'both',
  ADD COLUMN IF NOT EXISTS pot_target_cents integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'UTC',
  ADD COLUMN IF NOT EXISTS is_receiver_active boolean DEFAULT false;
