 import { useQuery } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 
 export interface PageSection {
   id: string;
   page_slug: string;
   section_key: string;
   title: string | null;
   subtitle: string | null;
   content: string | null;
   image_url: string | null;
   gallery: string[] | null;
   button_text: string | null;
   button_url: string | null;
   display_order: number;
   is_active: boolean;
   items: any[] | null;
 }
 
 export function usePageSections(pageSlug: string) {
   return useQuery({
     queryKey: ["public-page-sections", pageSlug],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("page_sections")
         .select("*")
         .eq("page_slug", pageSlug)
         .eq("is_active", true)
         .order("display_order", { ascending: true });
 
       if (error) throw error;
       return data as PageSection[];
     },
   });
 }
 
 export function usePageSection(pageSlug: string, sectionKey: string) {
   return useQuery({
     queryKey: ["public-page-section", pageSlug, sectionKey],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("page_sections")
         .select("*")
         .eq("page_slug", pageSlug)
         .eq("section_key", sectionKey)
         .eq("is_active", true)
         .maybeSingle();
 
       if (error) throw error;
       return data as PageSection | null;
     },
   });
 }