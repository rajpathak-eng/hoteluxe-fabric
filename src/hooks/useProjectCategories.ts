import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  display_order: number;
}

export function useProjectCategories() {
  return useQuery({
    queryKey: ["project-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_categories")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as ProjectCategory[];
    },
  });
}

export function useProjectCategoryLinks(projectId: string | undefined) {
  return useQuery({
    queryKey: ["project-category-links", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("project_category_links")
        .select("category_id")
        .eq("project_id", projectId);
      if (error) throw error;
      return data.map((d) => d.category_id);
    },
    enabled: !!projectId,
  });
}

export function useSaveProjectCategories() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, categoryIds }: { projectId: string; categoryIds: string[] }) => {
      // Delete existing links
      const { error: delError } = await supabase
        .from("project_category_links")
        .delete()
        .eq("project_id", projectId);
      if (delError) throw delError;

      // Insert new links
      if (categoryIds.length > 0) {
        const { error: insError } = await supabase
          .from("project_category_links")
          .insert(categoryIds.map((cid) => ({ project_id: projectId, category_id: cid })));
        if (insError) throw insError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-category-links"] });
      queryClient.invalidateQueries({ queryKey: ["public-projects"] });
    },
  });
}
