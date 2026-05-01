-- Storage bucket for lesson content (videos, SCORM zips, PDFs)
INSERT INTO storage.buckets (id, name, public) VALUES ('lesson-content', 'lesson-content', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read lesson files
CREATE POLICY "Public read lesson content"
ON storage.objects FOR SELECT
USING (bucket_id = 'lesson-content');

-- Only admins can upload
CREATE POLICY "Admins upload lesson content"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lesson-content' AND public.has_role(auth.uid(), 'admin'));

-- Only admins can update
CREATE POLICY "Admins update lesson content"
ON storage.objects FOR UPDATE
USING (bucket_id = 'lesson-content' AND public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins delete lesson content"
ON storage.objects FOR DELETE
USING (bucket_id = 'lesson-content' AND public.has_role(auth.uid(), 'admin'));

-- Helper RPC for the first admin: bootstrap by email when no admins exist yet
CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count int;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';
  IF admin_count = 0 AND auth.uid() IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (auth.uid(), 'admin')
    ON CONFLICT DO NOTHING;
    RETURN true;
  END IF;
  RETURN false;
END;
$$;