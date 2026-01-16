-- 1. Remove email column from profiles table (security improvement)
-- Email should be accessed from auth.users, not duplicated in profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- 2. Create a public view for published stories that hides user_id
-- This prevents exposing raw user_ids to the public
CREATE OR REPLACE VIEW public.published_stories_public 
WITH (security_invoker=on) AS
SELECT 
  s.id,
  s.title,
  s.content,
  s.language,
  s.word_count,
  s.created_at,
  s.updated_at,
  COALESCE(p.display_name, 'Anonymous') as author_name
FROM public.stories s
LEFT JOIN public.profiles p ON s.user_id = p.user_id
WHERE s.is_published = true;

-- 3. Add admin role management policy for user_roles
-- This allows admins to manage other users' roles
CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Update the handle_new_user function to not insert email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  RETURN new;
END;
$$;