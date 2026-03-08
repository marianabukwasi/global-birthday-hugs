
CREATE TABLE public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT 'general',
  message text NOT NULL DEFAULT '',
  report_wish_id text,
  report_profile_link text,
  report_description text,
  status text NOT NULL DEFAULT 'open',
  user_id uuid
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can submit a ticket
CREATE POLICY "Anyone can create support tickets"
  ON public.support_tickets FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Authenticated users can view their own tickets
CREATE POLICY "Users can view own tickets"
  ON public.support_tickets FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
