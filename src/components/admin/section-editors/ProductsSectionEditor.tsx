import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "../ImageUpload";
import { PageSection } from "@/hooks/useCms";
import { useCategories } from "@/hooks/useCategories";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { GripVertical, X } from "lucide-react";
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

interface ProductsSectionEditorProps {
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
}

interface SelectedCategory {
  id: string;
  slug: string;
  name: string;
  image_url?: string | null;
}

function SortableCategoryItem({ 
  category, 
  onRemove,
  onImageChange 
}: { 
  category: SelectedCategory; 
  onRemove: () => void;
  onImageChange: (url: string | null) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 p-3 bg-background border border-border rounded-lg"
    >
      <button
        type="button"
        className="mt-6 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">{category.name}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mb-2">
          Link: /produktet/{category.slug}
        </div>
        <ImageUpload
          value={category.image_url ?? null}
          onChange={onImageChange}
          folder="categories"
        />
      </div>
    </div>
  );
}

export function ProductsSectionEditor({ form, setForm }: ProductsSectionEditorProps) {
  const { data: allCategories, isLoading } = useCategories();
  
  // Parse items as selected categories
  const selectedCategories: SelectedCategory[] = Array.isArray(form.items) 
    ? form.items as SelectedCategory[]
    : [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = selectedCategories.findIndex((c) => c.id === active.id);
      const newIndex = selectedCategories.findIndex((c) => c.id === over.id);
      const newOrder = arrayMove(selectedCategories, oldIndex, newIndex);
      setForm({ ...form, items: newOrder });
    }
  };

  const handleAddCategory = (categoryId: string) => {
    const category = allCategories?.find(c => c.id === categoryId);
    if (!category) return;
    
    const newCategory: SelectedCategory = {
      id: category.id,
      slug: category.slug,
      name: category.name,
      image_url: category.image_url,
    };
    
    setForm({ ...form, items: [...selectedCategories, newCategory] });
  };

  const handleRemoveCategory = (categoryId: string) => {
    setForm({ 
      ...form, 
      items: selectedCategories.filter(c => c.id !== categoryId) 
    });
  };

  const handleCategoryImageChange = (categoryId: string, imageUrl: string | null) => {
    setForm({
      ...form,
      items: selectedCategories.map(c => 
        c.id === categoryId ? { ...c, image_url: imageUrl } : c
      ),
    });
  };

  // Categories not yet selected
  const availableCategories = allCategories?.filter(
    c => !selectedCategories.some(sc => sc.id === c.id)
  ) || [];

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
            placeholder="Tekstile Premium për Hotele"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Përshkrimi</Label>
        <Textarea
          value={form.content || ""}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={3}
          placeholder="Përshkrimi i seksionit të produkteve..."
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Kategoritë e Shfaqura</Label>
          <span className="text-xs text-muted-foreground">
            {selectedCategories.length} kategori të zgjedhura
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : (
          <>
            {selectedCategories.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={selectedCategories.map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {selectedCategories.map((category) => (
                      <SortableCategoryItem
                        key={category.id}
                        category={category}
                        onRemove={() => handleRemoveCategory(category.id)}
                        onImageChange={(url) => handleCategoryImageChange(category.id, url)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {availableCategories.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Shto kategori:</Label>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((category) => (
                    <Button
                      key={category.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddCategory(category.id)}
                      className="text-xs"
                    >
                      + {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {selectedCategories.length === 0 && (
              <div className="p-4 bg-muted/30 rounded-lg border border-dashed border-border text-center">
                <p className="text-sm text-muted-foreground">
                  Asnjë kategori e zgjedhur. Kliko mbi kategoritë më sipër për t'i shtuar në seksion.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
        <p className="text-sm text-muted-foreground">
          <strong>Shënim:</strong> Imazhet e kategorive mund të personalizohen për këtë seksion. 
          Nëse nuk vendoset imazh, do të përdoret imazhi i parazgjedhur i kategorisë.
        </p>
      </div>
    </div>
  );
}
