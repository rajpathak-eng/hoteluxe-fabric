import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Product category links
export interface ProductCategoryLink {
  id: string;
  product_id: string;
  category_id: string;
  display_order: number;
}

export function useProductCategoryLinks(productId: string | undefined) {
  return useQuery({
    queryKey: ["product-category-links", productId],
    queryFn: async () => {
      if (!productId) return [];
      const { data, error } = await supabase
        .from("product_category_links")
        .select("*, product_categories(id, name, slug)")
        .eq("product_id", productId)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });
}

export function useUpdateProductCategories() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, categoryIds }: { productId: string; categoryIds: string[] }) => {
      // Delete existing links
      const { error: deleteError } = await supabase
        .from("product_category_links")
        .delete()
        .eq("product_id", productId);
      if (deleteError) throw deleteError;

      // Insert new links
      if (categoryIds.length > 0) {
        const links = categoryIds.map((categoryId, index) => ({
          product_id: productId,
          category_id: categoryId,
          display_order: index,
        }));
        const { error: insertError } = await supabase
          .from("product_category_links")
          .insert(links);
        if (insertError) throw insertError;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-category-links", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-admin"] });
    },
  });
}

// Blog post category links
export interface BlogPostCategoryLink {
  id: string;
  post_id: string;
  category_id: string;
  display_order: number;
}

export function useBlogPostCategoryLinks(postId: string | undefined) {
  return useQuery({
    queryKey: ["blog-post-category-links", postId],
    queryFn: async () => {
      if (!postId) return [];
      const { data, error } = await supabase
        .from("blog_post_category_links")
        .select("*, blog_categories(id, name, slug)")
        .eq("post_id", postId)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });
}

export function useUpdateBlogPostCategories() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, categoryIds }: { postId: string; categoryIds: string[] }) => {
      // Delete existing links
      const { error: deleteError } = await supabase
        .from("blog_post_category_links")
        .delete()
        .eq("post_id", postId);
      if (deleteError) throw deleteError;

      // Insert new links
      if (categoryIds.length > 0) {
        const links = categoryIds.map((categoryId, index) => ({
          post_id: postId,
          category_id: categoryId,
          display_order: index,
        }));
        const { error: insertError } = await supabase
          .from("blog_post_category_links")
          .insert(links);
        if (insertError) throw insertError;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blog-post-category-links", variables.postId] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts-admin"] });
      queryClient.invalidateQueries({ queryKey: ["public-blog-posts"] });
    },
  });
}

// Helper to get products by any of their categories
export function useProductsByCategories(categoryIds: string[]) {
  return useQuery({
    queryKey: ["products-by-categories", categoryIds],
    queryFn: async () => {
      if (categoryIds.length === 0) return [];
      const { data, error } = await supabase
        .from("product_category_links")
        .select("product_id, products(*)")
        .in("category_id", categoryIds);
      if (error) throw error;
      // Deduplicate products
      const productMap = new Map();
      data.forEach((link: any) => {
        if (link.products && !productMap.has(link.products.id)) {
          productMap.set(link.products.id, link.products);
        }
      });
      return Array.from(productMap.values());
    },
    enabled: categoryIds.length > 0,
  });
}

// Helper to get blog posts by any of their categories
export function useBlogPostsByCategories(categoryIds: string[]) {
  return useQuery({
    queryKey: ["blog-posts-by-categories", categoryIds],
    queryFn: async () => {
      if (categoryIds.length === 0) return [];
      const { data, error } = await supabase
        .from("blog_post_category_links")
        .select("post_id, blog_posts(*)")
        .in("category_id", categoryIds);
      if (error) throw error;
      // Deduplicate posts
      const postMap = new Map();
      data.forEach((link: any) => {
        if (link.blog_posts && !postMap.has(link.blog_posts.id)) {
          postMap.set(link.blog_posts.id, link.blog_posts);
        }
      });
      return Array.from(postMap.values());
    },
    enabled: categoryIds.length > 0,
  });
}
