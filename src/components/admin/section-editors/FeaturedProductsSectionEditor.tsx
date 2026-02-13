import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/hooks/useCms";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GripVertical, X, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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

interface FeaturedProductsSectionEditorProps {
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
}

interface SelectedProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  category_slug: string;
}

function SortableProductItem({
  product,
  onRemove,
}: {
  product: SelectedProduct;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg"
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="w-12 h-12 object-cover rounded"
        />
      )}

      <div className="flex-1 min-w-0">
        <span className="font-medium text-sm block truncate">{product.name}</span>
        <span className="text-xs text-muted-foreground">
          /produktet/{product.category_slug}/{product.slug}
        </span>
      </div>

      <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="h-8 w-8 p-0">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function FeaturedProductsSectionEditor({ form, setForm }: FeaturedProductsSectionEditorProps) {
  // Fetch all products with their primary category
  const { data: allProducts, isLoading } = useQuery({
    queryKey: ["all-products-with-category"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, images, category_id, product_categories(slug)")
        .order("name");

      if (error) throw error;
      return data?.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        image: p.images?.[0] || "",
        category_slug: p.product_categories?.slug || "",
      })) as SelectedProduct[];
    },
  });

  const selectedProducts: SelectedProduct[] = Array.isArray(form.items)
    ? (form.items as SelectedProduct[])
    : [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = selectedProducts.findIndex((p) => p.id === active.id);
      const newIndex = selectedProducts.findIndex((p) => p.id === over.id);
      setForm({ ...form, items: arrayMove(selectedProducts, oldIndex, newIndex) });
    }
  };

  const handleAddProduct = (productId: string) => {
    const product = allProducts?.find((p) => p.id === productId);
    if (!product) return;
    setForm({ ...form, items: [...selectedProducts, product] });
  };

  const handleRemoveProduct = (productId: string) => {
    setForm({ ...form, items: selectedProducts.filter((p) => p.id !== productId) });
  };

  const availableProducts =
    allProducts?.filter((p) => !selectedProducts.some((sp) => sp.id === p.id)) || [];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nëntitulli</Label>
          <Input
            value={form.subtitle || ""}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            placeholder="Produktet tona"
          />
        </div>
        <div className="space-y-2">
          <Label>Titulli</Label>
          <Input
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Produktet më të pëlqyera"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Përshkrimi</Label>
        <Textarea
          value={form.content || ""}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={3}
          placeholder="Teksti përshkrues i seksionit..."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Teksti i butonit (opsional)</Label>
          <Input
            value={form.button_text || ""}
            onChange={(e) => setForm({ ...form, button_text: e.target.value })}
            placeholder="Shiko të gjitha produktet"
          />
        </div>
        <div className="space-y-2">
          <Label>URL e butonit</Label>
          <Input
            value={form.button_url || ""}
            onChange={(e) => setForm({ ...form, button_url: e.target.value })}
            placeholder="/produktet"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Produktet e zgjedhura</Label>
          <span className="text-xs text-muted-foreground">
            {selectedProducts.length} produkte
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <>
            {selectedProducts.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={selectedProducts.map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {selectedProducts.map((product) => (
                      <SortableProductItem
                        key={product.id}
                        product={product}
                        onRemove={() => handleRemoveProduct(product.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {availableProducts.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Shto produkt:</Label>
                <div className="max-h-48 overflow-y-auto border border-border rounded-lg p-2 space-y-1">
                  {availableProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleAddProduct(product.id)}
                      className="w-full flex items-center gap-3 p-2 rounded hover:bg-muted text-left text-sm transition-colors"
                    >
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <span className="flex-1 truncate">{product.name}</span>
                      <Plus className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedProducts.length === 0 && (
              <div className="p-4 bg-muted/30 rounded-lg border border-dashed border-border text-center">
                <p className="text-sm text-muted-foreground">
                  Asnjë produkt i zgjedhur. Zgjidhni produkte nga lista më sipër.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
