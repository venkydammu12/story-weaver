-- Drop the existing foreign key constraint on stories.user_id
ALTER TABLE public.stories DROP CONSTRAINT IF EXISTS stories_user_id_fkey;

-- Make user_id nullable for system-published stories
ALTER TABLE public.stories ALTER COLUMN user_id DROP NOT NULL;

-- Add a check constraint to ensure published stories can have null user_id
-- but drafts must have a user_id (we'll handle this in application logic)
COMMENT ON COLUMN public.stories.user_id IS 'User ID of the author. NULL for system-published stories by the main author.';