-- Create designs table to store user creations
CREATE TABLE public.designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('certificate', 'card', 'image')),
  design_data JSONB NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own designs"
  ON public.designs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own designs"
  ON public.designs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own designs"
  ON public.designs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own designs"
  ON public.designs FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for updated_at
CREATE TRIGGER set_designs_updated_at
  BEFORE UPDATE ON public.designs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create templates table
CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('certificate', 'card')),
  preview_url TEXT,
  template_data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for templates
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Public templates are viewable by everyone
CREATE POLICY "Public templates are viewable by all"
  ON public.templates FOR SELECT
  USING (is_public = true);

-- Insert default certificate templates
INSERT INTO public.templates (title, type, template_data, preview_url) VALUES
  ('Classic Certificate', 'certificate', '{"background":"#ffffff","border":"gold","layout":"classic"}', null),
  ('Modern Certificate', 'certificate', '{"background":"linear-gradient(135deg, #667eea 0%, #764ba2 100%)","border":"none","layout":"modern"}', null),
  ('Elegant Certificate', 'certificate', '{"background":"#f8f9fa","border":"silver","layout":"elegant"}', null);

-- Insert default card templates
INSERT INTO public.templates (title, type, template_data) VALUES
  ('Birthday Celebration', 'card', '{"background":"#fef3c7","theme":"birthday"}'),
  ('Work Anniversary', 'card', '{"background":"#dbeafe","theme":"work"}'),
  ('Congratulations', 'card', '{"background":"#dcfce7","theme":"celebration"}');