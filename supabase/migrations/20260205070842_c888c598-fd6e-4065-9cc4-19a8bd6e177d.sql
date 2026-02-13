-- Create storage bucket for CMS uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cms-uploads', 
  'cms-uploads', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for cms-uploads bucket
CREATE POLICY "CMS uploads are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'cms-uploads');

CREATE POLICY "Admins can upload to CMS bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cms-uploads' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update CMS uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'cms-uploads' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete CMS uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'cms-uploads' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Blog categories table
CREATE TABLE public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog categories are publicly viewable"
ON public.blog_categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage blog categories"
ON public.blog_categories FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT, -- Rich text HTML content
  featured_image TEXT,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  read_time TEXT DEFAULT '5 min',
  author TEXT DEFAULT 'EMA Hotelling',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published blog posts are publicly viewable"
ON public.blog_posts FOR SELECT
USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage blog posts"
ON public.blog_posts FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Page sections table for static pages
CREATE TABLE public.page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL, -- 'home', 'about', 'contact', etc.
  section_key TEXT NOT NULL, -- 'hero', 'about', 'cta', etc.
  title TEXT,
  subtitle TEXT,
  content TEXT, -- Rich text HTML
  image_url TEXT,
  gallery TEXT[], -- Array of image URLs
  button_text TEXT,
  button_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(page_slug, section_key)
);

ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Page sections are publicly viewable"
ON public.page_sections FOR SELECT USING (true);

CREATE POLICY "Admins can manage page sections"
ON public.page_sections FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add more fields to products table for full CMS
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS content TEXT, -- Rich text content for product page
ADD COLUMN IF NOT EXISTS short_description TEXT;

-- Add RLS policies for product management by admins
CREATE POLICY "Admins can insert products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
ON public.products FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
ON public.products FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for category management by admins
CREATE POLICY "Admins can insert categories"
ON public.product_categories FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update categories"
ON public.product_categories FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete categories"
ON public.product_categories FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_blog_categories_updated_at
BEFORE UPDATE ON public.blog_categories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_sections_updated_at
BEFORE UPDATE ON public.page_sections
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default blog categories
INSERT INTO public.blog_categories (name, slug, display_order) VALUES
('Dhoma Gjumi', 'dhoma-gjumi', 1),
('Hotele', 'hotele', 2),
('Banjo', 'banjo', 3),
('Amenities', 'amenities', 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert default page sections for Home
INSERT INTO public.page_sections (page_slug, section_key, title, subtitle, display_order) VALUES
('home', 'hero', 'Tekstile Premium për Industrinë e Mikpritjes', 'Furnizuesi juaj i besueshëm për hotele, restorante dhe Airbnb në Shqipëri', 1),
('home', 'about', 'Rreth EMA Hotelling', 'Mbi 15 vite eksperiencë në furnizimin e tekstileve premium për industrinë e mikpritjes', 2),
('home', 'differentiators', 'Pse të zgjidhni ne?', 'Cilësi, shërbim dhe besueshmëri', 3),
('home', 'products', 'Produktet Tona', 'Koleksion i plotë tekstilesh për çdo nevojë të biznesit tuaj', 4),
('home', 'industries', 'Industritë ku Operojmë', 'Zgjidhje të specializuara për çdo sektor', 5),
('home', 'portfolio', 'Projektet Tona', 'Disa nga projektet e suksesshme që kemi realizuar', 6),
('home', 'contact', 'Na Kontaktoni', 'Jemi këtu për t''ju ndihmuar', 7)
ON CONFLICT (page_slug, section_key) DO NOTHING;