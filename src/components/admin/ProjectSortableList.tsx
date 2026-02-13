import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical, Save, Loader2, FolderOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project, useProjectsAdmin } from "@/hooks/useProjects";
import { useQueryClient } from "@tanstack/react-query";

interface SortableProjectItemProps {
  project: Project;
  index: number;
}

function SortableProjectItem({ project, index }: SortableProjectItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

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
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      <span className="text-xs text-muted-foreground w-6">{index + 1}</span>
      <FolderOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="font-medium text-sm truncate block">{project.title}</span>
        <span className="text-xs text-muted-foreground">{project.tag}</span>
      </div>
      {index < 4 && (
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
          Homepage
        </span>
      )}
    </div>
  );
}

export function ProjectSortableList() {
  const { data: projects, isLoading } = useProjectsAdmin();
  const [sortedProjects, setSortedProjects] = useState<Project[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (projects) {
      setSortedProjects([...projects].sort((a, b) => a.display_order - b.display_order));
    }
  }, [projects]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSortedProjects((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      setHasChanges(true);
    }
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      const updates = sortedProjects.map((project, index) => ({
        id: project.id,
        display_order: index,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from("projects")
          .update({ display_order: update.display_order })
          .eq("id", update.id);

        if (error) throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ["projects-admin"] });
      await queryClient.invalidateQueries({ queryKey: ["public-projects"] });

      toast({
        title: "Sukses",
        description: "Renditja e projekteve u ruajt",
      });
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving order:", error);
      toast({
        title: "Gabim",
        description: "Nuk u ruajt renditja",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Renditja e Projekteve</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Tërhiq dhe lësho për të ndryshuar renditjen. 4 të parët shfaqen në homepage.
          </p>
        </div>
        {hasChanges && (
          <Button onClick={handleSaveOrder} disabled={isSaving} size="sm">
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Ruaj Renditjen
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedProjects.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {sortedProjects.map((project, index) => (
                <SortableProjectItem
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {sortedProjects.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Nuk ka projekte
          </p>
        )}
      </CardContent>
    </Card>
  );
}
