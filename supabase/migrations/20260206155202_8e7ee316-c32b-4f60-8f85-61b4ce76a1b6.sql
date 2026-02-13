-- Add new technical specification columns to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS composition TEXT,
ADD COLUMN IF NOT EXISTS filling TEXT,
ADD COLUMN IF NOT EXISTS washing_instructions TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS antiallergic TEXT,
ADD COLUMN IF NOT EXISTS origin TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.products.composition IS 'Material composition e.g. 100% Microfiber';
COMMENT ON COLUMN public.products.filling IS 'Filling material e.g. 100% Polyester';
COMMENT ON COLUMN public.products.washing_instructions IS 'Array of washing instruction codes e.g. {machine_wash_40, iron_medium, no_bleach}';
COMMENT ON COLUMN public.products.antiallergic IS 'Antiallergic certification info e.g. OEKO-TEX Standard 100';
COMMENT ON COLUMN public.products.origin IS 'Product origin e.g. Made in Greece';