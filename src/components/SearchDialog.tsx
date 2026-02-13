import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categories } = useCategories();

  // Fetch all products for search
  const { data: products } = useQuery({
    queryKey: ["all-products-search"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, category_id")
        .order("name");
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  // Filter results based on search query
  const filteredCategories = useMemo(() => {
    if (!categories || !searchQuery.trim()) return categories || [];
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const filteredProducts = useMemo(() => {
    if (!products || !searchQuery.trim()) return products?.slice(0, 10) || [];
    return products
      .filter((prod) =>
        prod.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 10);
  }, [products, searchQuery]);

  // Get category slug by id
  const getCategorySlug = (categoryId: string) => {
    const category = categories?.find((c) => c.id === categoryId);
    return category?.slug || "";
  };

  const handleClose = useCallback(() => {
    onOpenChange(false);
    setSearchQuery("");
  }, [onOpenChange]);

  const handleSelectCategory = (slug: string) => {
    navigate(`/produktet/${slug}`);
    handleClose();
  };

  const handleSelectProduct = (categoryId: string, productSlug: string) => {
    const categorySlug = getCategorySlug(categoryId);
    navigate(`/produktet/${categorySlug}/${productSlug}`);
    handleClose();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, handleClose]);

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay backdrop with blur */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal container - centered at top of screen */}
      <div className="relative flex flex-col items-center pt-20 md:pt-28 px-4">
        <div className="w-full max-w-2xl bg-popover border border-border rounded-lg shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
          {/* Search Input */}
          <div className="flex items-center border-b border-border px-4">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              placeholder="Kërko produkte ose kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-14 px-4 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            <button
              onClick={handleClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Mbyll"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Empty state */}
            {searchQuery.trim() && 
              filteredCategories.length === 0 && 
              filteredProducts.length === 0 && (
              <div className="py-12 text-center">
                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-sm">Nuk u gjet asnjë rezultat.</p>
              </div>
            )}

            {/* Categories */}
            {filteredCategories && filteredCategories.length > 0 && (
              <div className="p-4">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-2">
                  Kategoritë
                </h3>
                <div className="space-y-1">
                  {filteredCategories.slice(0, 6).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleSelectCategory(category.slug)}
                      className="w-full text-left cursor-pointer py-3 px-3 hover:bg-muted rounded-md transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{category.name}</span>
                        {category.description && (
                          <span className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {category.description}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            {filteredProducts && filteredProducts.length > 0 && (
              <div className="p-4 pt-0">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-2">
                  Produktet
                </h3>
                <div className="space-y-1">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product.category_id, product.slug)}
                      className="w-full text-left cursor-pointer py-3 px-3 hover:bg-muted rounded-md transition-colors"
                    >
                      <span className="font-medium text-foreground">{product.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Initial state - show some categories */}
            {!searchQuery.trim() && filteredCategories.length > 0 && (
              <div className="p-4 pt-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-2">
                  Kategoritë e sugjeruara
                </h3>
                <div className="space-y-1">
                  {filteredCategories.slice(0, 6).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleSelectCategory(category.slug)}
                      className="w-full text-left cursor-pointer py-3 px-3 hover:bg-muted rounded-md transition-colors"
                    >
                      <span className="font-medium text-foreground">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDialog;
