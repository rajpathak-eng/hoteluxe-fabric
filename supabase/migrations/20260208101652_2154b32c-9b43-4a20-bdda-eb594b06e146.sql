-- Create junction table for products with multiple categories
CREATE TABLE public.product_category_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.product_categories(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, category_id)
);

-- Create junction table for blog posts with multiple categories
CREATE TABLE public.blog_post_category_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.blog_categories(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, category_id)
);

-- Enable RLS on both tables
ALTER TABLE public.product_category_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_category_links ENABLE ROW LEVEL SECURITY;

-- RLS policies for product_category_links
CREATE POLICY "Product category links are publicly viewable" 
ON public.product_category_links 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage product category links" 
ON public.product_category_links 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for blog_post_category_links
CREATE POLICY "Blog post category links are publicly viewable" 
ON public.blog_post_category_links 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage blog post category links" 
ON public.blog_post_category_links 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Migrate existing product categories to the junction table
INSERT INTO public.product_category_links (product_id, category_id)
SELECT id, category_id FROM public.products WHERE category_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Migrate existing blog post categories to the junction table
INSERT INTO public.blog_post_category_links (post_id, category_id)
SELECT id, category_id FROM public.blog_posts WHERE category_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX idx_product_category_links_product ON public.product_category_links(product_id);
CREATE INDEX idx_product_category_links_category ON public.product_category_links(category_id);
CREATE INDEX idx_blog_post_category_links_post ON public.blog_post_category_links(post_id);
CREATE INDEX idx_blog_post_category_links_category ON public.blog_post_category_links(category_id);