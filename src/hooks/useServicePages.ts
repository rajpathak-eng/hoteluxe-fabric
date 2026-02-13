 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 
export interface ServicePage {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  hero_image: string | null;
  features: string[];
  recommended_categories: string[];
  related_projects: string[];
  meta_title: string | null;
  meta_description: string | null;
  is_active: boolean;
  display_order: number;
}
 
 // Public hooks
 export function usePublicServicePages() {
   return useQuery({
     queryKey: ["public-service-pages"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("service_pages")
         .select("*")
         .eq("is_active", true)
         .order("display_order", { ascending: true });
       if (error) throw error;
       return data as ServicePage[];
     },
   });
 }
 
 export function usePublicServicePage(slug: string | undefined) {
   return useQuery({
     queryKey: ["public-service-page", slug],
     queryFn: async () => {
       if (!slug) return null;
       const { data, error } = await supabase
         .from("service_pages")
         .select("*")
         .eq("slug", slug)
         .eq("is_active", true)
         .maybeSingle();
       if (error) throw error;
       return data as ServicePage | null;
     },
     enabled: !!slug,
   });
 }
 
 // Admin hooks
 export function useServicePagesAdmin() {
   return useQuery({
     queryKey: ["service-pages-admin"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("service_pages")
         .select("*")
         .order("display_order", { ascending: true });
       if (error) throw error;
       return data as ServicePage[];
     },
   });
 }
 
 export function useCreateServicePage() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async (page: Omit<ServicePage, "id">) => {
       const { data, error } = await supabase
         .from("service_pages")
         .insert(page)
         .select()
         .single();
       if (error) throw error;
       return data;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["service-pages-admin"] });
       queryClient.invalidateQueries({ queryKey: ["public-service-pages"] });
     },
   });
 }
 
 export function useUpdateServicePage() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async ({ id, ...data }: Partial<ServicePage> & { id: string }) => {
       const { data: result, error } = await supabase
         .from("service_pages")
         .update(data)
         .eq("id", id)
         .select()
         .single();
       if (error) throw error;
       return result;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["service-pages-admin"] });
       queryClient.invalidateQueries({ queryKey: ["public-service-pages"] });
     },
   });
 }
 
 export function useDeleteServicePage() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async (id: string) => {
       const { error } = await supabase.from("service_pages").delete().eq("id", id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["service-pages-admin"] });
       queryClient.invalidateQueries({ queryKey: ["public-service-pages"] });
     },
   });
 }