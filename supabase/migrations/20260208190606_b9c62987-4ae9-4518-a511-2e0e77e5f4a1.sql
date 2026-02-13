-- Add related_projects column to service_pages table
ALTER TABLE public.service_pages 
ADD COLUMN related_projects text[] DEFAULT '{}'::text[];

-- Add comment for documentation
COMMENT ON COLUMN public.service_pages.related_projects IS 'Array of project slugs related to this service';