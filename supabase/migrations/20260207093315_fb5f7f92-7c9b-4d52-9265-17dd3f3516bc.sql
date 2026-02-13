-- Add new JSONB columns for washing icons and enhanced features
-- washing_icons: array of {icon_url, label?}
-- product_features: array of {text, icon_url?}

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS washing_icons JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS product_features JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.products.washing_icons IS 'Array of washing instruction icons: [{icon_url: string, label?: string}]';
COMMENT ON COLUMN public.products.product_features IS 'Array of product features with icons: [{text: string, icon_url?: string}]';