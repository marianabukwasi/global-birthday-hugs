
CREATE TABLE public.wish_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wish_id uuid NOT NULL,
  reporter_id uuid NOT NULL,
  reason text NOT NULL DEFAULT '',
  details text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.wish_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports"
  ON public.wish_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports"
  ON public.wish_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);
