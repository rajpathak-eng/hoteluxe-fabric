-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for admin access control
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
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

-- Policy: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create SEO metadata table for static pages
CREATE TABLE public.seo_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_slug TEXT NOT NULL UNIQUE,
    page_name TEXT NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on seo_pages
ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read SEO data (needed for frontend)
CREATE POLICY "SEO pages are publicly viewable"
ON public.seo_pages
FOR SELECT
USING (true);

-- Policy: Only admins can update SEO data
CREATE POLICY "Admins can update SEO pages"
ON public.seo_pages
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can insert SEO data
CREATE POLICY "Admins can insert SEO pages"
ON public.seo_pages
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can delete SEO data
CREATE POLICY "Admins can delete SEO pages"
ON public.seo_pages
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add SEO columns to product_categories
ALTER TABLE public.product_categories
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Add SEO columns to products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Create trigger for seo_pages updated_at
CREATE TRIGGER update_seo_pages_updated_at
BEFORE UPDATE ON public.seo_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default SEO entries for static pages
INSERT INTO public.seo_pages (page_slug, page_name, meta_title, meta_description) VALUES
('home', 'Kryefaqja', 'EMA Hotelling - Tekstile Premium për Hotele dhe Mikpritje', 'Furnizuesi kryesor i tekstileve premium për hotele, restorante dhe industrinë e mikpritjes në Shqipëri.'),
('about', 'Rreth Nesh', 'Rreth Nesh - EMA Hotelling', 'Mbi 10 vjet eksperiencë në industrinë e tekstileve për mikpritje. Zbuloni historinë tonë.'),
('contact', 'Kontakt', 'Na Kontaktoni - EMA Hotelling', 'Kontaktoni EMA Hotelling për tekstile premium. Jemi këtu për t''ju ndihmuar.'),
('faq', 'Pyetje të Shpeshta', 'FAQ - EMA Hotelling', 'Gjeni përgjigje për pyetjet tuaja më të shpeshta rreth produkteve dhe shërbimeve tona.'),
('products', 'Produktet', 'Produktet Tona - EMA Hotelling', 'Shfletoni koleksionin tonë të plotë të tekstileve premium për industrinë e mikpritjes.'),
('projects', 'Projektet', 'Projektet Tona - EMA Hotelling', 'Shikoni projektet tona të suksesshme me hotele dhe biznese të mikpritjes.'),
('blog', 'Blog', 'Blog - EMA Hotelling', 'Lexoni artikujt tanë më të fundit rreth tekstileve dhe industrisë së mikpritjes.'),
('quote', 'Merr një Ofertë', 'Merr një Ofertë - EMA Hotelling', 'Kërkoni një ofertë të personalizuar për nevojat tuaja të tekstileve.')
ON CONFLICT (page_slug) DO NOTHING;