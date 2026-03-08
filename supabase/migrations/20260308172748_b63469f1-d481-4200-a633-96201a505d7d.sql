
-- Create storage bucket for wish media (photos and videos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('wish-media', 'wish-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload wish media
CREATE POLICY "Authenticated users can upload wish media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'wish-media');

-- Anyone can view wish media (public bucket)
CREATE POLICY "Anyone can view wish media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'wish-media');
