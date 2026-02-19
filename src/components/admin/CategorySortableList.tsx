import { useState, useEffect, useRef } from "react";
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
import { GripVertical, Save, Loader2, FolderOpen, Folder } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCategoriesAdmin } from "@/hooks/useCms";
import { useQueryClient } from "@tanstack/react-query";
import type { CategoryFull } from "@/hooks/useCms";

function SortableCategoryItem({
  category,
  index,
}: {
  category: CategoryFull;
  index: number;
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
      className="flex items-center gap-3 p-3 bg-background border rounded-md"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      <span className="text-xs text-muted-foreground w-6">{index + 1}</span>
      {category.parent_id ? (
        <FolderOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      ) : (
        <Folder className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <span className="font-medium text-sm truncate block">{category.name}</span>
        <span className="text-xs text-muted-foreground">/{category.slug}</span>
      </div>
    </div>
  );
}

export function CategorySortableList() {
  const { data: categories, isLoading } = useCategoriesAdmin();
  const queryClient = useQueryClient();
  const [filterParentId, setFilterParentId] = useState<string | null>("root");
  const [sortedCategories, setSortedCategories] = useState<CategoryFull[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const listCategories =
    filterParentId === "root"
      ? (categories ?? []).filter((c) => !c.parent_id)
      : (categories ?? []).filter((c) => c.parent_id === filterParentId);

  const prevFilterRef = useRef(filterParentId);
  useEffect(() => {
    const filterChanged = prevFilterRef.current !== filterParentId;
    if (filterChanged) {
      prevFilterRef.current = filterParentId;
      setHasChanges(false);
    }
    if (filterChanged || !hasChanges) {
      const list =
        filterParentId === "root"
          ? (categories ?? []).filter((c) => !c.parent_id)
          : (categories ?? []).filter((c) => c.parent_id === filterParentId);
      const sorted = [...list].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
      setSortedCategories(sorted);
    }
  }, [filterParentId, categories, hasChanges]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSortedCategories((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      setHasChanges(true);
    }
  };

  const handleSaveOrder = async () => {
    if (sortedCategories.length === 0) return;
    setIsSaving(true);
    try {
      for (let i = 0; i < sortedCategories.length; i++) {
        const { error } = await supabase
          .from("product_categories")
          .update({ display_order: i })
          .eq("id", sortedCategories[i].id);
        if (error) throw error;
      }
      await queryClient.invalidateQueries({ queryKey: ["categories-admin"] });
      await queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      toast({ title: "Sukses", description: "Renditja u ruajt" });
      setHasChanges(false);
    } catch (error: unknown) {
      toast({
        title: "Gabim",
        description: error instanceof Error ? error.message : "Nuk u ruajt renditja",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const parentCategories = (categories ?? []).filter((c) => !c.parent_id);
  const parentsWithChildren = parentCategories.filter(
    (p) => (categories ?? []).some((c) => c.parent_id === p.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Renditja e kategorive</CardTitle>
        <Select
          value={filterParentId ?? "root"}
          onValueChange={(v) => setFilterParentId(v === "root" ? "root" : v)}
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Zgjidhni grupin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="root">Kategoritë kryesore</SelectItem>
            {parentsWithChildren.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                Nënkategoritë e: {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasChanges && (
          <Button size="sm" onClick={handleSaveOrder} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Ruaj renditjen
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        ) : sortedCategories.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-6">
            {filterParentId === "root"
              ? "Nuk ka kategori kryesore"
              : "Nuk ka nënkategori për këtë kategori"}
          </p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={sortedCategories.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sortedCategories.map((category, index) => (
                  <SortableCategoryItem key={category.id} category={category} index={index} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
        {hasChanges && (
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Zvarrit për të ndryshuar renditjen, pastaj kliko &quot;Ruaj renditjen&quot;
          </p>
        )}
      </CardContent>
    </Card>
  );
}
