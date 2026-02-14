 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 import type { Json } from "@/integrations/supabase/types";
 
export interface NavLink {
  id?: string;
  label: string;
  url: string;
  isActive?: boolean;
  children?: NavLink[];
}

export interface HeaderSettings {
  logo_url: string | null;
  phone: string;
  nav_links: NavLink[];
  service_links: NavLink[];
  cta_text: string;
  cta_url: string;
}
 
 export interface FooterSettings {
   company_description: string;
   phone: string;
   email: string;
   address: string;
   nav_links: NavLink[];
   service_links: NavLink[];
   copyright: string;
 }
 
 export interface SiteSetting {
   id: string;
   setting_key: string;
   setting_value: HeaderSettings | FooterSettings | Record<string, unknown>;
 }
 
 export function useSiteSettings() {
   return useQuery({
     queryKey: ["site-settings"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("site_settings")
         .select("*");
       if (error) throw error;
       
       const settings: Record<string, SiteSetting> = {};
       data?.forEach((item) => {
         settings[item.setting_key] = item as SiteSetting;
       });
       return settings;
     },
   });
 }
 
 export function useHeaderSettings() {
   return useQuery({
     queryKey: ["header-settings"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("site_settings")
         .select("*")
         .eq("setting_key", "header")
         .maybeSingle();
       if (error) throw error;
       return data?.setting_value as unknown as HeaderSettings | null;
     },
   });
 }
 
 export function useFooterSettings() {
   return useQuery({
     queryKey: ["footer-settings"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("site_settings")
         .select("*")
         .eq("setting_key", "footer")
         .maybeSingle();
       if (error) throw error;
       return data?.setting_value as unknown as FooterSettings | null;
     },
   });
 }
 
 export function useUpdateSiteSetting() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async ({ key, value }: { key: string; value: unknown }) => {
       const { data: result, error } = await supabase
         .from("site_settings")
        .update({ setting_value: value as Json })
         .eq("setting_key", key)
         .select()
         .single();
       if (error) throw error;
       return result;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["site-settings"] });
       queryClient.invalidateQueries({ queryKey: ["header-settings"] });
       queryClient.invalidateQueries({ queryKey: ["footer-settings"] });
     },
   });
 }