import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  features: string[] | null;
  specifications: Record<string, unknown>;
  images: string[];
  display_order: number;
  is_featured: boolean;
}

export function useProductsByCategory(categoryId: string | undefined) {
  return useQuery({
    queryKey: ["products", categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      
      // Get all products linked to this category via product_category_links
      const { data: linkedProducts, error } = await supabase
        .from("product_category_links")
        .select(`
          product_id,
          display_order,
          products (*)
        `)
        .eq("category_id", categoryId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      
      // Extract and return products, sorted by display_order
      const products = linkedProducts
        ?.map((link: any) => link.products)
        .filter(Boolean)
        .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));

      return products as Product[];
    },
    enabled: !!categoryId,
  });
}

export function useProductBySlug(categorySlug: string | undefined, productSlug: string | undefined) {
  return useQuery({
    queryKey: ["product", categorySlug, productSlug],
    queryFn: async () => {
      if (!categorySlug || !productSlug) return null;
      
      // First get category
      const { data: category, error: catError } = await supabase
        .from("product_categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();

      if (catError) throw catError;
      if (!category) return null;

      // Get product by slug first
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("slug", productSlug)
        .maybeSingle();

      if (productError) throw productError;
      if (!product) return null;

      // Verify product is linked to this category via junction table
      const { data: link, error: linkError } = await supabase
        .from("product_category_links")
        .select("id")
        .eq("product_id", product.id)
        .eq("category_id", category.id)
        .maybeSingle();

      if (linkError) throw linkError;
      
      // Return product only if it's linked to this category
      if (!link) return null;
      
      return product as Product | null;
    },
    enabled: !!categorySlug && !!productSlug,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_categories(name, slug)")
        .eq("is_featured", true)
        .limit(10);

      if (error) throw error;
      return data;
    },
  });
}
