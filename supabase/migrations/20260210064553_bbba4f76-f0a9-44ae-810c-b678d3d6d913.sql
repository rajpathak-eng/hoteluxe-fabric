
-- Create project categories table
CREATE TABLE public.project_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project categories are publicly viewable"
  ON public.project_categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage project categories"
  ON public.project_categories FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed with existing tags
INSERT INTO public.project_categories (name, slug, display_order) VALUES
  ('Hotel', 'hotel', 1),
  ('Restorante', 'restorante', 2),
  ('Bujtinë', 'bujtine', 3),
  ('Resort', 'resort', 4),
  ('Airbnb', 'airbnb', 5),
  ('SPA', 'spa', 6);

-- Create junction table for project-category links
CREATE TABLE public.project_category_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.project_categories(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(project_id, category_id)
);

ALTER TABLE public.project_category_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project category links are publicly viewable"
  ON public.project_category_links FOR SELECT USING (true);

CREATE POLICY "Admins can manage project category links"
  ON public.project_category_links FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Migrate existing tags to junction table
INSERT INTO public.project_category_links (project_id, category_id)
SELECT p.id, pc.id
FROM public.projects p
JOIN public.project_categories pc ON pc.name = p.tag;
