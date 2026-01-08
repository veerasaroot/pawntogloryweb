-- User Dashboard Migration
-- Tables for tracking course progress and enrollments

-- Course Enrollments
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Lesson Progress (Watch History)
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  last_watched_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own enrollments" 
ON public.course_enrollments FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves" 
ON public.course_enrollments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own progress" 
ON public.lesson_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.lesson_progress FOR ALL 
USING (auth.uid() = user_id);

-- Add sample enrollment policy for admins if needed
CREATE POLICY "Admins can see all enrollments" 
ON public.course_enrollments FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
