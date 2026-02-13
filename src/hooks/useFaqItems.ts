 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 
 export interface FaqItem {
   id: string;
   question: string;
   answer: string;
   category: string;
   display_order: number;
   is_active: boolean;
 }
 
 // Public hook - gets only active FAQs
 export function usePublicFaqItems() {
   return useQuery({
     queryKey: ["public-faq-items"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("faq_items")
         .select("*")
         .eq("is_active", true)
         .order("display_order", { ascending: true });
       if (error) throw error;
       return data as FaqItem[];
     },
   });
 }
 
 // Admin hooks - gets all FAQs
 export function useFaqItemsAdmin() {
   return useQuery({
     queryKey: ["faq-items-admin"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("faq_items")
         .select("*")
         .order("display_order", { ascending: true });
       if (error) throw error;
       return data as FaqItem[];
     },
   });
 }
 
 export function useCreateFaqItem() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async (item: Omit<FaqItem, "id">) => {
       const { data, error } = await supabase
         .from("faq_items")
         .insert(item)
         .select()
         .single();
       if (error) throw error;
       return data;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["faq-items-admin"] });
       queryClient.invalidateQueries({ queryKey: ["public-faq-items"] });
     },
   });
 }
 
 export function useUpdateFaqItem() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async ({ id, ...data }: Partial<FaqItem> & { id: string }) => {
       const { data: result, error } = await supabase
         .from("faq_items")
         .update(data)
         .eq("id", id)
         .select()
         .single();
       if (error) throw error;
       return result;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["faq-items-admin"] });
       queryClient.invalidateQueries({ queryKey: ["public-faq-items"] });
     },
   });
 }
 
 export function useDeleteFaqItem() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async (id: string) => {
       const { error } = await supabase.from("faq_items").delete().eq("id", id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["faq-items-admin"] });
       queryClient.invalidateQueries({ queryKey: ["public-faq-items"] });
     },
   });
 }