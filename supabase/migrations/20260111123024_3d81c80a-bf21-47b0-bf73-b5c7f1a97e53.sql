-- Add explicit deny policy for anonymous access to profiles table
-- This ensures unauthenticated users cannot access any profile data

-- First, create a policy that explicitly denies anonymous (public) access
CREATE POLICY "Deny public access to profiles" 
ON public.profiles 
FOR SELECT 
TO anon 
USING (false);

-- Add explicit deny for INSERT from anon
CREATE POLICY "Deny public insert to profiles" 
ON public.profiles 
FOR INSERT 
TO anon 
WITH CHECK (false);

-- Add explicit deny for UPDATE from anon
CREATE POLICY "Deny public update to profiles" 
ON public.profiles 
FOR UPDATE 
TO anon 
USING (false);

-- Add explicit deny for DELETE from anon
CREATE POLICY "Deny public delete to profiles" 
ON public.profiles 
FOR DELETE 
TO anon 
USING (false);

-- Create user_roles table for proper role-based access control
-- This follows the security best practice of NOT storing roles in profiles/users table
CREATE TYPE public.app_role AS ENUM ('admin', 'author', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can only see their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only admins can manage roles (using security definer function)
CREATE POLICY "Deny public access to user_roles"
ON public.user_roles
FOR ALL
TO anon
USING (false);

-- Create a security definer function to check roles without RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create a function to check if user is an author
CREATE OR REPLACE FUNCTION public.is_author(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'author'
  )
$$;