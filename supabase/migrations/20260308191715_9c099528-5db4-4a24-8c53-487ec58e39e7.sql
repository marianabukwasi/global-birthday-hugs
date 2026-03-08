
CREATE TABLE public.admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  action text NOT NULL DEFAULT '',
  details jsonb,
  admin_user text NOT NULL DEFAULT 'founder'
);

ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- No public access at all - only edge functions with service role can read/write
