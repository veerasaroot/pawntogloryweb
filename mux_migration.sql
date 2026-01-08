-- MUX Video Integration Migration
-- Add MUX fields to lessons table for video storage

-- Add MUX asset ID column
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS mux_asset_id text;

-- Add MUX playback ID column (used for video playback)
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS mux_playback_id text;

-- Make video_url nullable (since we can use MUX playback_id instead)
-- Note: This is typically already nullable, but ensures compatibility
COMMENT ON COLUMN public.lessons.video_url IS 'Legacy video URL or external video link (optional if using MUX)';
COMMENT ON COLUMN public.lessons.mux_asset_id IS 'MUX Asset ID for the uploaded video';
COMMENT ON COLUMN public.lessons.mux_playback_id IS 'MUX Playback ID for streaming the video';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_lessons_mux_playback_id ON public.lessons(mux_playback_id) WHERE mux_playback_id IS NOT NULL;

-- RLS Policy for lessons (ensure public read for enrolled students)
-- Already enabled via courses cascade, but adding explicit policy
CREATE POLICY IF NOT EXISTS "Lessons are viewable by authenticated users" 
ON public.lessons FOR SELECT 
USING (true);

-- Allow admins to manage lessons
CREATE POLICY IF NOT EXISTS "Admins can manage lessons"
ON public.lessons FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
