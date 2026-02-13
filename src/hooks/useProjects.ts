 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 
 export interface Project {
   id: string;
   title: string;
   slug: string;
   tag: string;
   description: string | null;
   environment: string | null;
   goal: string | null;
   hero_image: string | null;
   gallery: string[];
   display_order: number;
   is_featured: boolean;
   meta_title: string | null;
   meta_description: string | null;
 }
 
 export interface ProjectProduct {
   id: string;
   project_id: string;
   product_name: string;
   product_slug: string | null;
   category_slug: string | null;
   image: string | null;
   display_order: number;
 }
 
 // Public hooks
 export function usePublicProjects() {
   return useQuery({
     queryKey: ["public-projects"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("projects")
         .select("*")
         .order("display_order", { ascending: true });
       if (error) throw error;
       return data as Project[];
     },
   });
 }
 
 export function usePublicProject(slug: string | undefined) {
   return useQuery({
     queryKey: ["public-project", slug],
     queryFn: async () => {
       if (!slug) return null;
       const { data, error } = await supabase
         .from("projects")
         .select("*")
         .eq("slug", slug)
         .maybeSingle();
       if (error) throw error;
       return data as Project | null;
     },
     enabled: !!slug,
   });
 }
 
 export function useProjectProducts(projectId: string | undefined) {
   return useQuery({
     queryKey: ["project-products", projectId],
     queryFn: async () => {
       if (!projectId) return [];
       const { data, error } = await supabase
         .from("project_products")
         .select("*")
         .eq("project_id", projectId)
         .order("display_order", { ascending: true });
       if (error) throw error;
       return data as ProjectProduct[];
     },
     enabled: !!projectId,
   });
 }
 
 // Admin hooks
 export function useProjectsAdmin() {
   return useQuery({
     queryKey: ["projects-admin"],
     queryFn: async () => {
       const { data, error } = await supabase
         .from("projects")
         .select("*")
         .order("display_order", { ascending: true });
       if (error) throw error;
       return data as Project[];
     },
   });
 }
 
 export function useCreateProject() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async (project: Omit<Project, "id">) => {
       const { data, error } = await supabase
         .from("projects")
         .insert(project)
         .select()
         .single();
       if (error) throw error;
       return data;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["projects-admin"] });
       queryClient.invalidateQueries({ queryKey: ["public-projects"] });
     },
   });
 }
 
 export function useUpdateProject() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async ({ id, ...data }: Partial<Project> & { id: string }) => {
       const { data: result, error } = await supabase
         .from("projects")
         .update(data)
         .eq("id", id)
         .select()
         .single();
       if (error) throw error;
       return result;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["projects-admin"] });
       queryClient.invalidateQueries({ queryKey: ["public-projects"] });
     },
   });
 }
 
 export function useDeleteProject() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async (id: string) => {
       const { error } = await supabase.from("projects").delete().eq("id", id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["projects-admin"] });
       queryClient.invalidateQueries({ queryKey: ["public-projects"] });
     },
   });
 }
 
 // Project products management
 export function useCreateProjectProduct() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async (product: Omit<ProjectProduct, "id">) => {
       const { data, error } = await supabase
         .from("project_products")
         .insert(product)
         .select()
         .single();
       if (error) throw error;
       return data;
     },
     onSuccess: (_, variables) => {
       queryClient.invalidateQueries({ queryKey: ["project-products", variables.project_id] });
     },
   });
 }
 
 export function useDeleteProjectProduct() {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
       const { error } = await supabase.from("project_products").delete().eq("id", id);
       if (error) throw error;
       return projectId;
     },
     onSuccess: (projectId) => {
       queryClient.invalidateQueries({ queryKey: ["project-products", projectId] });
     },
   });
 }