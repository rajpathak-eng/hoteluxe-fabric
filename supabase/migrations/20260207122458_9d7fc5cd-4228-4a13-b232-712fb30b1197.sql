-- Add meta_description column to blog_posts table for SEO
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS meta_description text;