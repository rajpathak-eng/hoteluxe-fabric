-- Create product categories table
CREATE TABLE public.product_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  parent_id UUID REFERENCES public.product_categories(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.product_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  features TEXT[],
  specifications JSONB DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(category_id, slug)
);

-- Create services/industries table for "Shërbimet" dropdown
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create public read policies (catalog is public)
CREATE POLICY "Product categories are publicly viewable"
ON public.product_categories
FOR SELECT
USING (true);

CREATE POLICY "Products are publicly viewable"
ON public.products
FOR SELECT
USING (true);

CREATE POLICY "Services are publicly viewable"
ON public.services
FOR SELECT
USING (true);

-- Create indexes for performance
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_product_categories_slug ON public.product_categories(slug);
CREATE INDEX idx_product_categories_parent ON public.product_categories(parent_id);

-- Insert initial services (Shërbimet)
INSERT INTO public.services (name, slug, description, display_order) VALUES
('Tekstile për Hotele', 'tekstile-hotele', 'Çarçafë, jorganë, peshqirë dhe aksesore premium për hotele luksoze', 1),
('Tekstile për Restorante', 'tekstile-restorante', 'Mbulesa tavoline, peceta dhe tekstile elegante për restorante', 2),
('Tekstile për Airbnb', 'tekstile-airbnb', 'Zgjidhje praktike dhe cilësore për pronësi Airbnb', 3);

-- Insert main product categories
INSERT INTO public.product_categories (name, slug, description, display_order) VALUES
('Çarçafë', 'carcafe', 'Çarçafë premium pambuku me thread count të lartë', 1),
('Jorgan', 'jorgan', 'Jorgane të lehta dhe të ngrohta për çdo sezon', 2),
('Dyshekë', 'dysheke', 'Dyshekë profesionale për komoditet maksimal', 3),
('Jastëk Gjumi', 'jastek-gjumi', 'Jastëkë ortopedike me cilësi hotelerie', 4),
('Batanije', 'batanije', 'Batanije të buta dhe elegante për çdo dhomë', 5),
('Mbrojtëse', 'mbrojtese', 'Mbrojtëse higjenike dhe të qëndrueshme', 6),
('Mbulesa Tavoline', 'mbulesa-tavoline', 'Mbulesa elegante për restorante dhe evente', 7),
('Perde', 'perde', 'Perde blackout dhe sheer për çdo ambiente', 8),
('Grila', 'grila', 'Grila moderne dhe funksionale', 9),
('Peshqirë', 'peshqire', 'Peshqirë të butë për banja dhe spa', 10),
('Peshqir Plazhi', 'peshqir-plazhi', 'Peshqirë të mëdhenj për plazh dhe pishinë', 11),
('Peshqirë Këmbësh', 'peshqire-kembesh', 'Peshqirë këmbësh absorbuese dhe të ngrohta', 12),
('Rrobdishanë', 'rrobdishane', 'Rrobdishanë luksoze për hotele dhe spa', 13),
('Shapka', 'shapka', 'Shapka dhe aksesore për banjë', 14),
('Shilte', 'shilte', 'Shilte komode për ulëse dhe dyshekë', 15),
('Skin Essentials', 'skin-essentials', 'Linja premium e kujdesit për lëkurën', 16),
('Le Jardin Med', 'le-jardin-med', 'Koleksion ekskluziv aromash mesdhetare', 17),
('Sarbacane', 'sarbacane', 'Produkte premium nga Sarbacane', 18),
('Good To Declare', 'good-to-declare', 'Produkte eko-miqësore dhe të qëndrueshme', 19),
('Për Fëmijët', 'per-femijet', 'Tekstile të sigurta dhe komode për fëmijë', 20),
('Accessories & Slippers', 'accessories-slippers', 'Aksesore dhe pantofla për hotele', 21);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_product_categories_updated_at
BEFORE UPDATE ON public.product_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();