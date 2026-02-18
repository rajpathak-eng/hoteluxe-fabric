import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical, Eye, Save, Loader2, ArrowUpToLine, ArrowDownToLine, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProductsAdmin, useCategoriesAdmin } from "@/hooks/useCms";
import { useQueryClient, useQuery } from "@tanstack/react-query";

interface SortableProductItemProps {
  product: {
    id: string;
    name: string;
    slug: string;
    display_order: number | null;
    product_categories?: { name: string; slug: string } | null;
    categorySlugOverride?: string;
  };
  isSelected: boolean;
  isChecked: boolean;
  onCheck: (checked: boolean) => void;
  onSelect: () => void;
  onPreview: () => void;
  onMoveToTop: () => void;
  onMoveToBottom: () => void;
}

function SortableProductItem({ product, isSelected, isChecked, onCheck, onSelect, onPreview, onMoveToTop, onMoveToBottom }: SortableProductItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const categorySlug = product.categorySlugOverride || (product.product_categories as any)?.slug;
  const productUrl = categorySlug ? `/produktet/${categorySlug}/${product.slug}` : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-3 rounded-md transition-colors ${
        isDragging ? "bg-muted shadow-lg" : ""
      } ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
    >
      <Checkbox
        checked={isChecked}
        onCheckedChange={(checked) => onCheck(!!checked)}
        onClick={(e) => e.stopPropagation()}
        className="shrink-0"
      />
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing p-1 hover:bg-background/20 rounded"
        title="Zvarrit për të ndryshuar renditjen"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      
      <button onClick={onSelect} className="flex-1 text-left">
        <div className="font-medium text-sm truncate">{product.name}</div>
        <div className="text-xs opacity-70 truncate">
          {(product.product_categories as any)?.name}
        </div>
      </button>

      {productUrl && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onPreview();
          }}
          title="Shiko produktin live"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={(e) => e.stopPropagation()}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onMoveToTop}>
            <ArrowUpToLine className="h-4 w-4 mr-2" /> Lëviz në krye
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onMoveToBottom}>
            <ArrowDownToLine className="h-4 w-4 mr-2" /> Lëviz në fund
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface ProductSortableListProps {
  onSelectProduct: (id: string) => void;
  selectedId: string | null;
  onNewProduct: () => void;
}

// Hook to fetch products linked to a category via junction table
function useCategoryProductLinks(categoryId: string | null) {
  return useQuery({
    queryKey: ["category-product-links", categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const { data, error } = await supabase
        .from("product_category_links")
        .select("product_id, display_order, products(*, product_categories(name, slug))")
        .eq("category_id", categoryId)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!categoryId,
  });
}

export function ProductSortableList({ onSelectProduct, selectedId, onNewProduct }: ProductSortableListProps) {
  const { data: products, isLoading: loadingProducts } = useProductsAdmin();
  const { data: categories } = useCategoriesAdmin();
  const queryClient = useQueryClient();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [sortedProducts, setSortedProducts] = useState<any[]>([]);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch junction links when a specific category is selected
  const { data: categoryLinks } = useCategoryProductLinks(
    selectedCategoryId !== "all" ? selectedCategoryId : null
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Build product list based on selected category
  useEffect(() => {
    if (!products) return;

    if (selectedCategoryId === "all") {
      // Show all products sorted by display_order
      const sorted = [...products].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      setSortedProducts(sorted);
    } else if (categoryLinks) {
      // Show products linked via junction table, sorted by junction display_order
      const linkedProducts = categoryLinks
        .filter((link: any) => link.products)
        .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
        .map((link: any) => ({
          ...link.products,
          _linkDisplayOrder: link.display_order,
        }));
      setSortedProducts(linkedProducts);
    }
    setHasChanges(false);
  }, [products, selectedCategoryId, categoryLinks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSortedProducts((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      setHasChanges(true);
    }
  };

  const handleMoveToTop = (productId: string) => {
    setSortedProducts((items) => {
      const idx = items.findIndex((i) => i.id === productId);
      if (idx <= 0) return items;
      const newItems = [...items];
      const [item] = newItems.splice(idx, 1);
      newItems.unshift(item);
      return newItems;
    });
    setHasChanges(true);
  };

  const handleMoveToBottom = (productId: string) => {
    setSortedProducts((items) => {
      const idx = items.findIndex((i) => i.id === productId);
      if (idx < 0 || idx === items.length - 1) return items;
      const newItems = [...items];
      const [item] = newItems.splice(idx, 1);
      newItems.push(item);
      return newItems;
    });
    setHasChanges(true);
  };

  const handleBulkMoveToTop = () => {
    if (checkedIds.size === 0) return;
    setSortedProducts((items) => {
      const checked = items.filter((i) => checkedIds.has(i.id));
      const rest = items.filter((i) => !checkedIds.has(i.id));
      return [...checked, ...rest];
    });
    setHasChanges(true);
    setCheckedIds(new Set());
  };

  const handleBulkMoveToBottom = () => {
    if (checkedIds.size === 0) return;
    setSortedProducts((items) => {
      const checked = items.filter((i) => checkedIds.has(i.id));
      const rest = items.filter((i) => !checkedIds.has(i.id));
      return [...rest, ...checked];
    });
    setHasChanges(true);
    setCheckedIds(new Set());
  };

  const toggleCheck = (id: string, checked: boolean) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (checkedIds.size === sortedProducts.length) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(sortedProducts.map((p) => p.id)));
    }
  };

  const handleSaveOrder = async () => {
    if (!sortedProducts || sortedProducts.length === 0) return;

    setIsSaving(true);
    try {
      if (selectedCategoryId === "all") {
        // Save to products.display_order
        for (let i = 0; i < sortedProducts.length; i++) {
          const { error } = await supabase
            .from("products")
            .update({ display_order: i })
            .eq("id", sortedProducts[i].id);
          if (error) throw error;
        }
      } else {
        // Save to product_category_links.display_order
        for (let i = 0; i < sortedProducts.length; i++) {
          const { error } = await supabase
            .from("product_category_links")
            .update({ display_order: i })
            .eq("product_id", sortedProducts[i].id)
            .eq("category_id", selectedCategoryId);
          if (error) throw error;
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["products-admin"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["featured-products"] });
      await queryClient.invalidateQueries({ queryKey: ["category-product-links"] });

      toast({ title: "Sukses", description: "Renditja e produkteve u ruajt me sukses" });
      setHasChanges(false);
    } catch (error: any) {
      toast({ title: "Gabim", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCategory = categories?.find((c) => c.id === selectedCategoryId);

  return (
    <Card className="lg:col-span-1">
      <CardHeader className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Produktet</CardTitle>
          <Button size="sm" onClick={onNewProduct}>
            Shto
          </Button>
        </div>

        <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtro sipas kategorisë" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Të gjitha kategoritë</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasChanges && (
          <Button size="sm" onClick={handleSaveOrder} disabled={isSaving} className="w-full">
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Ruaj Renditjen
          </Button>
        )}

        {/* Bulk actions */}
        {checkedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{checkedIds.size} të zgjedhura</span>
            <Button size="sm" variant="outline" onClick={handleBulkMoveToTop}>
              <ArrowUpToLine className="h-3 w-3 mr-1" /> Top
            </Button>
            <Button size="sm" variant="outline" onClick={handleBulkMoveToBottom}>
              <ArrowDownToLine className="h-3 w-3 mr-1" /> Bottom
            </Button>
          </div>
        )}

        {sortedProducts.length > 0 && (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={checkedIds.size === sortedProducts.length && sortedProducts.length > 0}
              onCheckedChange={toggleSelectAll}
            />
            <span className="text-xs text-muted-foreground">Zgjidh të gjitha</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="max-h-[500px] overflow-y-auto">
        {loadingProducts ? (
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        ) : sortedProducts && sortedProducts.length > 0 ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sortedProducts.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1">
                {sortedProducts.map((product) => {
                  const categorySlug = selectedCategory?.slug || (product.product_categories as any)?.slug;
                  const productUrl = categorySlug ? `/produktet/${categorySlug}/${product.slug}` : null;

                  return (
                    <SortableProductItem
                      key={product.id}
                      product={{ ...product, categorySlugOverride: selectedCategory?.slug }}
                      isSelected={selectedId === product.id}
                      isChecked={checkedIds.has(product.id)}
                      onCheck={(checked) => toggleCheck(product.id, checked)}
                      onSelect={() => onSelectProduct(product.id)}
                      onPreview={() => {
                        if (productUrl) window.open(productUrl, "_blank");
                      }}
                      onMoveToTop={() => handleMoveToTop(product.id)}
                      onMoveToBottom={() => handleMoveToBottom(product.id)}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <p className="text-muted-foreground text-center py-4 text-sm">
            {selectedCategoryId === "all" ? "Nuk ka produkte" : "Nuk ka produkte në këtë kategori"}
          </p>
        )}

        {hasChanges && (
          <p className="text-xs text-muted-foreground mt-4 text-center">
            💡 Zvarrit produktet për të ndryshuar renditjen, pastaj kliko "Ruaj Renditjen"
          </p>
        )}
      </CardContent>
    </Card>
  );
}
