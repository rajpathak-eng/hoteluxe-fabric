-- Add product_variants column to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS variants jsonb DEFAULT '[]'::jsonb;