import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  parent_id: string | null;
}

export function useCategories() {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as ProductCategory[];
    },
  });
}

export function useCategoryBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["product-category", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data as ProductCategory | null;
    },
    enabled: !!slug,
  });
}

export function useSubcategories(parentId: string | null | undefined) {
  return useQuery({
    queryKey: ["subcategories", parentId],
    queryFn: async () => {
      if (!parentId) return [];
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .eq("parent_id", parentId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as ProductCategory[];
    },
    enabled: !!parentId,
  });
}
