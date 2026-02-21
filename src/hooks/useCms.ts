 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 
 // Blog Categories
 export interface BlogCategory {
   id: string;
   name: string;
   slug: string;
   description: string | null;
   display_order: number;
 }
 
 export function useBlogCategories() {
   return useQuery({
     queryKey: ["blog-categories"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("blog_categories")
         .select("*")
         .order("display_order", { ascending: true });
       if (error) throw error;
       return data as BlogCategory[];
     },
   });
 }
 
 export function useCreateBlogCategory() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async (category: Omit<BlogCategory, "id">) => {
       const { data, error } = await supabase
         .from("blog_categories")
         .insert(category)
         .select()
         .single();
       if (error) throw error;
       return data;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
     },
   });
 }
 
 export function useUpdateBlogCategory() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async ({ id, ...data }: Partial<BlogCategory> & { id: string }) => {
       const { data: result, error } = await supabase
         .from("blog_categories")
         .update(data)
         .eq("id", id)
         .select()
         .single();
       if (error) throw error;
       return result;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
     },
   });
 }
 
 export function useDeleteBlogCategory() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async (id: string) => {
       const { error } = await supabase.from("blog_categories").delete().eq("id", id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
     },
   });
 }
 
 // Blog Posts
 export interface BlogPost {
   id: string;
   title: string;
   slug: string;
   excerpt: string | null;
   content: string | null;
   featured_image: string | null;
   category_id: string | null;
   is_published: boolean;
   published_at: string | null;
   read_time: string;
   author: string;
   created_at: string;
   updated_at: string;
 }
 
 export function useBlogPosts() {
   return useQuery({
     queryKey: ["blog-posts-admin"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("blog_posts")
         .select("*, blog_categories(name)")
         .order("created_at", { ascending: false });
       if (error) throw error;
       return data;
     },
   });
 }
 
 export function useCreateBlogPost() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async (post: Omit<BlogPost, "id" | "created_at" | "updated_at">) => {
       const { data, error } = await supabase
         .from("blog_posts")
         .insert(post)
         .select()
         .single();
       if (error) throw error;
       return data;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["blog-posts-admin"] });
     },
   });
 }
 
 export function useUpdateBlogPost() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async ({ id, ...data }: Partial<BlogPost> & { id: string }) => {
       const { data: result, error } = await supabase
         .from("blog_posts")
         .update(data)
         .eq("id", id)
         .select()
         .single();
       if (error) throw error;
       return result;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["blog-posts-admin"] });
     },
   });
 }
 
 export function useDeleteBlogPost() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async (id: string) => {
       const { error } = await supabase.from("blog_posts").delete().eq("id", id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["blog-posts-admin"] });
     },
   });
 }
 
 // Page Sections
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
 
 export function usePageSections(pageSlug?: string) {
   return useQuery({
     queryKey: ["page-sections", pageSlug],
     queryFn: async () => {
       let query = supabase
         .from("page_sections")
         .select("*")
         .order("display_order", { ascending: true });
 
       if (pageSlug) {
         query = query.eq("page_slug", pageSlug);
       }
 
       const { data, error } = await query;
       if (error) throw error;
       return data as PageSection[];
     },
   });
 }
 
 export function useUpdatePageSection() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async ({ id, ...data }: Partial<PageSection> & { id: string }) => {
       const { data: result, error } = await supabase
         .from("page_sections")
         .update(data)
         .eq("id", id)
         .select()
         .single();
       if (error) throw error;
       return result;
     },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-sections"] });
      queryClient.invalidateQueries({ queryKey: ["public-page-sections"] });
      queryClient.invalidateQueries({ queryKey: ["public-page-section"] });
    },
  });
 }

 export function useCreatePageSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (section: Omit<PageSection, "id">) => {
      const { data, error } = await supabase
        .from("page_sections")
        .insert(section)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-sections"] });
      queryClient.invalidateQueries({ queryKey: ["public-page-sections"] });
      queryClient.invalidateQueries({ queryKey: ["public-page-section"] });
    },
  });
 }
 
// Products (extended)
export interface WashingIcon {
  icon_url: string;
  label?: string;
}

export interface ProductFeature {
  text: string;
  icon_url?: string;
}

export interface ProductFull {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  content: string | null;
  features: string[] | null;
  images: string[];
  display_order: number;
  is_featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  // Technical specifications
  composition: string | null;
  filling: string | null;
  washing_instructions: string[] | null;
  antiallergic: string | null;
  origin: string | null;
  // New structured fields
  washing_icons: WashingIcon[] | null;
  product_features: ProductFeature[] | null;
}
 
 export function useProductsAdmin() {
   return useQuery({
     queryKey: ["products-admin"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("products")
         .select("*, product_categories(name, slug)")
         .order("name", { ascending: true });
       if (error) throw error;
       return data;
     },
   });
 }
 
export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: {
      category_id: string;
      name: string;
      slug: string;
      description?: string | null;
      content?: string | null;
      features?: string[] | null;
      images?: string[];
      display_order?: number;
      is_featured?: boolean;
      meta_title?: string | null;
      meta_description?: string | null;
      composition?: string | null;
      filling?: string | null;
      washing_instructions?: string[] | null;
      antiallergic?: string | null;
      origin?: string | null;
      washing_icons?: WashingIcon[] | null;
      product_features?: ProductFeature[] | null;
    }) => {
      // Cast to any for JSONB fields compatibility
      const dbProduct = {
        ...product,
        washing_icons: product.washing_icons as any,
        product_features: product.product_features as any,
      };
      const { data, error } = await supabase
        .from("products")
        .insert(dbProduct)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-admin"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

 
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }: { 
      id: string;
      category_id?: string;
      name?: string;
      slug?: string;
      description?: string | null;
      content?: string | null;
      features?: string[] | null;
      images?: string[];
      display_order?: number;
      is_featured?: boolean;
      meta_title?: string | null;
      meta_description?: string | null;
      composition?: string | null;
      filling?: string | null;
      washing_instructions?: string[] | null;
      antiallergic?: string | null;
      origin?: string | null;
      washing_icons?: WashingIcon[] | null;
      product_features?: ProductFeature[] | null;
    }) => {
      // Cast to any for JSONB fields compatibility
      const dbUpdateData = {
        ...updateData,
        washing_icons: updateData.washing_icons as any,
        product_features: updateData.product_features as any,
      };
      const { data: result, error } = await supabase
        .from("products")
        .update(dbUpdateData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-admin"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["featured-products"] });
    },
  });
}
 
 export function useDeleteProduct() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async (id: string) => {
       const { error } = await supabase.from("products").delete().eq("id", id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["products-admin"] });
       queryClient.invalidateQueries({ queryKey: ["products"] });
     },
   });
 }
 
 // Categories (extended)
 export interface CategoryFull {
   id: string;
   name: string;
   slug: string;
   description: string | null;
   image_url: string | null;
   display_order: number;
   parent_id: string | null;
   meta_title: string | null;
   meta_description: string | null;
 }
 
 export function useCategoriesAdmin() {
   return useQuery({
     queryKey: ["categories-admin"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("product_categories")
         .select("*")
         .order("display_order", { ascending: true });
       if (error) throw error;
       return data as CategoryFull[];
     },
   });
 }
 
 export function useCreateCategory() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async (category: Omit<CategoryFull, "id">) => {
       const { data, error } = await supabase
         .from("product_categories")
         .insert(category)
         .select()
         .single();
       if (error) throw error;
       return data;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["categories-admin"] });
       queryClient.invalidateQueries({ queryKey: ["product-categories"] });
     },
   });
 }
 
 export function useUpdateCategory() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async ({ id, ...data }: Partial<CategoryFull> & { id: string }) => {
       const { data: result, error } = await supabase
         .from("product_categories")
         .update(data)
         .eq("id", id)
         .select()
         .single();
       if (error) throw error;
       return result;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["categories-admin"] });
       queryClient.invalidateQueries({ queryKey: ["product-categories"] });
     },
   });
 }
 
 export function useDeleteCategory() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async (id: string) => {
       const { error } = await supabase.from("product_categories").delete().eq("id", id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["categories-admin"] });
       queryClient.invalidateQueries({ queryKey: ["product-categories"] });
     },
   });
 }