
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT NOT NULL DEFAULT '',
  preferred_name TEXT DEFAULT '',
  age INTEGER,
  country TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  hobbies TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  favorite_color TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  is_name_public BOOLEAN DEFAULT true,
  is_age_public BOOLEAN DEFAULT true,
  is_country_public BOOLEAN DEFAULT true,
  is_hobbies_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Birthday pages table (paid $10/year)
CREATE TABLE public.birthday_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.birthday_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active birthday pages" ON public.birthday_pages
  FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Users can manage own birthday page" ON public.birthday_pages
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Wishes table
CREATE TABLE public.wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  video_url TEXT DEFAULT '',
  birthday_year INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view wishes they sent or received" ON public.wishes
  FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send wishes" ON public.wishes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

-- Contributions (monetary gifts)
CREATE TABLE public.contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount_cents INTEGER NOT NULL DEFAULT 100,
  message TEXT DEFAULT '',
  birthday_year INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their contributions" ON public.contributions
  FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create contributions" ON public.contributions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

-- Spins table
CREATE TABLE public.spins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  spin_type TEXT NOT NULL DEFAULT 'free',
  prize_name TEXT DEFAULT '',
  prize_description TEXT DEFAULT '',
  partner_name TEXT DEFAULT '',
  is_claimed BOOLEAN DEFAULT false,
  birthday_year INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.spins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own spins" ON public.spins
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create own spins" ON public.spins
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own spins" ON public.spins
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Global stats table (single row, updated by triggers)
CREATE TABLE public.global_stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total_users INTEGER DEFAULT 0,
  total_wishes INTEGER DEFAULT 0,
  total_contributions_cents BIGINT DEFAULT 0,
  total_spins INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.global_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read global stats" ON public.global_stats
  FOR SELECT USING (true);

INSERT INTO public.global_stats (id) VALUES (1);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  UPDATE public.global_stats SET total_users = total_users + 1, updated_at = now() WHERE id = 1;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
