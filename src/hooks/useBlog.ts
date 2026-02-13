 import { useQuery } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 
export interface PublicBlogPost {
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
  meta_description: string | null;
  category: {
    name: string;
    slug: string;
  } | null;
}
 
 export interface PublicBlogCategory {
   id: string;
   name: string;
   slug: string;
   description: string | null;
   display_order: number;
 }
 
 export function usePublicBlogPosts() {
   return useQuery({
     queryKey: ["public-blog-posts"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("blog_posts")
         .select("*, blog_categories(name, slug)")
         .eq("is_published", true)
         .order("published_at", { ascending: false });
       
       if (error) throw error;
       
       return data.map((post) => ({
         ...post,
         category: post.blog_categories,
       })) as PublicBlogPost[];
     },
   });
 }
 
 export function usePublicBlogPost(slug: string | undefined) {
   return useQuery({
     queryKey: ["public-blog-post", slug],
     queryFn: async () => {
       if (!slug) return null;
       
       const { data, error } = await supabase
         .from("blog_posts")
         .select("*, blog_categories(name, slug)")
         .eq("slug", slug)
         .eq("is_published", true)
         .single();
       
       if (error) throw error;
       
       return {
         ...data,
         category: data.blog_categories,
       } as PublicBlogPost;
     },
     enabled: !!slug,
   });
 }
 
 export function usePublicBlogCategories() {
   return useQuery({
     queryKey: ["public-blog-categories"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("blog_categories")
         .select("*")
         .order("display_order", { ascending: true });
       
       if (error) throw error;
       return data as PublicBlogCategory[];
     },
   });
 }
 
 export function useRelatedBlogPosts(categoryId: string | null, currentPostId: string) {
   return useQuery({
     queryKey: ["related-blog-posts", categoryId, currentPostId],
     queryFn: async () => {
       if (!categoryId) return [];
       
       const { data, error } = await supabase
         .from("blog_posts")
         .select("*, blog_categories(name, slug)")
         .eq("is_published", true)
         .eq("category_id", categoryId)
         .neq("id", currentPostId)
         .order("published_at", { ascending: false })
         .limit(3);
       
       if (error) throw error;
       
       return data.map((post) => ({
         ...post,
         category: post.blog_categories,
       })) as PublicBlogPost[];
     },
     enabled: !!categoryId,
   });
 }