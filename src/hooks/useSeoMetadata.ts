 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 
 export interface SeoPage {
   id: string;
   page_slug: string;
   page_name: string;
   meta_title: string | null;
   meta_description: string | null;
   created_at: string;
   updated_at: string;
 }
 
 export function useSeoPages() {
   return useQuery({
     queryKey: ["seo-pages"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("seo_pages")
         .select("*")
         .order("page_name", { ascending: true });
 
       if (error) throw error;
       return data as SeoPage[];
     },
   });
 }
 
 export function useSeoPageBySlug(slug: string) {
   return useQuery({
     queryKey: ["seo-page", slug],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("seo_pages")
         .select("*")
         .eq("page_slug", slug)
         .maybeSingle();
 
       if (error) throw error;
       return data as SeoPage | null;
     },
     enabled: !!slug,
   });
 }
 
 export function useUpdateSeoPage() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async ({ id, meta_title, meta_description }: { id: string; meta_title: string; meta_description: string }) => {
       const { data, error } = await supabase
         .from("seo_pages")
         .update({ meta_title, meta_description })
         .eq("id", id)
         .select()
         .single();
 
       if (error) throw error;
       return data;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["seo-pages"] });
       queryClient.invalidateQueries({ queryKey: ["seo-page"] });
     },
   });
 }
 
 export function useUpdateCategorySeo() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async ({ id, meta_title, meta_description }: { id: string; meta_title: string; meta_description: string }) => {
       const { data, error } = await supabase
         .from("product_categories")
         .update({ meta_title, meta_description })
         .eq("id", id)
         .select()
         .single();
 
       if (error) throw error;
       return data;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["product-categories"] });
       queryClient.invalidateQueries({ queryKey: ["product-category"] });
     },
   });
 }
 
 export function useUpdateProductSeo() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async ({ id, meta_title, meta_description }: { id: string; meta_title: string; meta_description: string }) => {
       const { data, error } = await supabase
         .from("products")
         .update({ meta_title, meta_description })
         .eq("id", id)
         .select()
         .single();
 
       if (error) throw error;
       return data;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["products"] });
       queryClient.invalidateQueries({ queryKey: ["product"] });
     },
   });
 }
 
 export function useCategoriesWithSeo() {
   return useQuery({
     queryKey: ["categories-with-seo"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("product_categories")
         .select("id, name, slug, meta_title, meta_description")
         .order("name", { ascending: true });
 
       if (error) throw error;
       return data;
     },
   });
 }
 
 export function useProductsWithSeo() {
   return useQuery({
     queryKey: ["products-with-seo"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("products")
         .select("id, name, slug, meta_title, meta_description, product_categories(name)")
         .order("name", { ascending: true });
 
       if (error) throw error;
       return data;
     },
   });
 }