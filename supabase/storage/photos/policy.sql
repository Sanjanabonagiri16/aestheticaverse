-- Enable storage
INSERT INTO storage.buckets (id, name)
VALUES ('photos', 'photos');

-- Set up storage policies
CREATE POLICY "Anyone can view photos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'photos' );

CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
WITH CHECK ( 
  bucket_id = 'photos' 
  AND auth.role() = 'authenticated'
);