import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRelatedProducts = (categoryId: string | undefined, currentProductId: string | undefined) => {
  return useQuery({
    queryKey: ["related-products", categoryId, currentProductId],
    queryFn: async () => {
      if (!categoryId || !currentProductId) return [];
      
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, category_id, images, description")
        .eq("category_id", categoryId)
        .neq("id", currentProductId)
        .limit(4);
        
      if (error) throw error;
      return data;
    },
    enabled: !!categoryId && !!currentProductId,
  });
};
