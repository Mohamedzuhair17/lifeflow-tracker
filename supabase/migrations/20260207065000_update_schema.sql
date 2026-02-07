-- Migration: Add profiles table and update todos
-- Description: Adds the profiles table for user personalization and adds is_daily support to todos.

-- Add is_daily to todos
ALTER TABLE public.todos ADD COLUMN IF NOT EXISTS is_daily BOOLEAN NOT NULL DEFAULT false;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nickname TEXT,
  age INTEGER,
  fav_quote TEXT,
  goal TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own profile' AND tablename = 'profiles') THEN
        CREATE POLICY "Users can view their own profile"
          ON public.profiles FOR SELECT
          USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own profile' AND tablename = 'profiles') THEN
        CREATE POLICY "Users can create their own profile"
          ON public.profiles FOR INSERT
          WITH CHECK (auth.uid() = id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own profile' AND tablename = 'profiles') THEN
        CREATE POLICY "Users can update their own profile"
          ON public.profiles FOR UPDATE
          USING (auth.uid() = id);
    END IF;
END $$;
