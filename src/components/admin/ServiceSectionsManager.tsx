import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Eye, GripVertical, Trash2, Layers, Settings2 } from "lucide-react";
import { usePageSections, useCreatePageSection, PageSection } from "@/hooks/useCms";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
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
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// All available section types with labels
const allSectionTypes: Record<string, string> = {
  hero: "Hero (Imazhi kryesor)",
  "why-us": "Përse të na zgjidhni?",
  categories: "Kategoritë e sugjeruara",
  projects: "Projektet e lidhura",
  cta: "Call to Action",
  services: "Shërbimet e personalizuara",
  gallery: "Galeria",
  benefits: "Përfitimet",
  faq: "Pyetje të Shpeshta",
  testimonials: "Testimonialet",
  "extra-cta": "CTA Shtesë",
};

// Default sections for new service pages
const defaultSections = [
  { key: "hero", order: 0 },
  { key: "why-us", order: 1 },
  { key: "categories", order: 2 },
  { key: "projects", order: 3 },
  { key: "cta", order: 4 },
];

interface SortableSectionProps {
  section: PageSection;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

function SortableSection({ section, onDelete, onToggleActive }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
        isDragging ? "shadow-lg border-primary bg-primary/5" : "bg-muted/50 border-border"
      } ${!section.is_active ? "opacity-60" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab hover:text-primary touch-none"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">
            {allSectionTypes[section.section_key] || section.section_key}
          </span>
          <span className="text-xs text-muted-foreground">
            #{section.display_order + 1}
          </span>
        </div>
        {section.title && (
          <span className="text-xs text-muted-foreground truncate block">
            {section.title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={section.is_active}
          onCheckedChange={(checked) => onToggleActive(section.id, checked)}
          className="scale-75"
        />
        <button
          onClick={() => onDelete(section.id)}
          className="text-muted-foreground hover:text-destructive transition-colors p-1"
          title="Fshi seksionin"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

interface ServiceSectionsManagerProps {
  serviceSlug: string;
  serviceTitle: string;
}

export function ServiceSectionsManager({ serviceSlug, serviceTitle }: ServiceSectionsManagerProps) {
  const pageSlug = `service-${serviceSlug}`;
  const { data: sections, isLoading, refetch } = usePageSections(pageSlug);
  const createSection = useCreatePageSection();
  const queryClient = useQueryClient();
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [newSectionType, setNewSectionType] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedSections = sections?.slice().sort((a, b) => a.display_order - b.display_order) || [];

  // Initialize default sections if none exist
  const initializeDefaultSections = async () => {
    if (isInitializing || isLoading || (sections && sections.length > 0)) return;
    
    setIsInitializing(true);
    try {
      for (const defaultSection of defaultSections) {
        await supabase.from("page_sections").insert({
          page_slug: pageSlug,
          section_key: defaultSection.key,
          title: "",
          subtitle: "",
          content: "",
          image_url: null,
          gallery: null,
          button_text: "",
          button_url: "",
          display_order: defaultSection.order,
          is_active: true,
          items: [],
        });
      }
      await refetch();
      toast({ title: "Sukses", description: "Seksionet bazë u krijuan automatikisht" });
    } catch (error: any) {
      console.error("Error initializing sections:", error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id || !sections) return;

    const oldIndex = sortedSections.findIndex((s) => s.id === active.id);
    const newIndex = sortedSections.findIndex((s) => s.id === over.id);
    
    const newOrder = arrayMove(sortedSections, oldIndex, newIndex);
    
    try {
      await Promise.all(
        newOrder.map((section, index) =>
          supabase
            .from("page_sections")
            .update({ display_order: index })
            .eq("id", section.id)
        )
      );
      
      queryClient.invalidateQueries({ queryKey: ["page-sections"] });
      queryClient.invalidateQueries({ queryKey: ["public-page-sections"] });
      toast({ title: "Sukses", description: "Renditja u përditësua" });
    } catch (error: any) {
      toast({ title: "Gabim", description: error.message, variant: "destructive" });
    }
  };

  const handleAddSection = async () => {
    if (!newSectionType) return;

    try {
      const newOrder = sortedSections.length;

      await createSection.mutateAsync({
        page_slug: pageSlug,
        section_key: newSectionType,
        title: "",
        subtitle: "",
        content: "",
        image_url: null,
        gallery: null,
        button_text: "",
        button_url: "",
        display_order: newOrder,
        is_active: true,
        items: [],
      });

      setAddSectionOpen(false);
      setNewSectionType("");
      toast({ title: "Sukses", description: "Seksioni u shtua në fund të faqes" });
    } catch (error: any) {
      toast({ title: "Gabim", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Jeni të sigurt që dëshironi të fshini këtë seksion?")) return;

    try {
      await supabase.from("page_sections").delete().eq("id", sectionId);
      
      // Re-order remaining sections
      const remaining = sortedSections.filter(s => s.id !== sectionId);
      await Promise.all(
        remaining.map((section, index) =>
          supabase
            .from("page_sections")
            .update({ display_order: index })
            .eq("id", section.id)
        )
      );
      
      queryClient.invalidateQueries({ queryKey: ["page-sections"] });
      queryClient.invalidateQueries({ queryKey: ["public-page-sections"] });
      toast({ title: "Sukses", description: "Seksioni u fshi" });
    } catch (error: any) {
      toast({ title: "Gabim", description: error.message, variant: "destructive" });
    }
  };

  const handleToggleActive = async (sectionId: string, isActive: boolean) => {
    try {
      await supabase
        .from("page_sections")
        .update({ is_active: isActive })
        .eq("id", sectionId);
      
      queryClient.invalidateQueries({ queryKey: ["page-sections"] });
      queryClient.invalidateQueries({ queryKey: ["public-page-sections"] });
      toast({ 
        title: isActive ? "Aktivizuar" : "Çaktivizuar", 
        description: `Seksioni u ${isActive ? "aktivizua" : "çaktivizua"}` 
      });
    } catch (error: any) {
      toast({ title: "Gabim", description: error.message, variant: "destructive" });
    }
  };

  // Already added section keys
  const addedSectionKeys = sortedSections.map(s => s.section_key);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Struktura e faqes
          </CardTitle>
          <div className="flex gap-2">
            {sortedSections.length === 0 && !isLoading && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={initializeDefaultSections}
                disabled={isInitializing}
              >
                {isInitializing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Settings2 className="h-4 w-4 mr-1" />
                )}
                Krijo seksionet bazë
              </Button>
            )}
            <Dialog open={addSectionOpen} onOpenChange={setAddSectionOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Shto seksion
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Shto seksion të ri për {serviceTitle}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Zgjidh llojin e seksionit:</Label>
                    <Select value={newSectionType} onValueChange={setNewSectionType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Zgjidh seksionin..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(allSectionTypes).map(([key, label]) => (
                          <SelectItem 
                            key={key} 
                            value={key}
                            disabled={addedSectionKeys.includes(key)}
                          >
                            {label}
                            {addedSectionKeys.includes(key) && " (ekziston)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Seksioni do të shtohet në fund. Përdor drag & drop për ta pozicionuar ku dëshiron.
                  </p>
                  <Button
                    onClick={handleAddSection}
                    disabled={!newSectionType || createSection.isPending}
                    className="w-full"
                  >
                    {createSection.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Shto seksionin
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(`/sherbimet/${serviceSlug}`, "_blank")}
            >
              <Eye className="h-4 w-4 mr-1" />
              Shiko
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading || isInitializing ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : sortedSections.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nuk ka seksione të konfigurura.</p>
            <p className="text-xs mt-1">Kliko "Krijo seksionet bazë" për të filluar.</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedSections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sortedSections.map((section) => (
                  <SortableSection
                    key={section.id}
                    section={section}
                    onDelete={handleDeleteSection}
                    onToggleActive={handleToggleActive}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Drag & drop</strong> për të ndryshuar pozicionin e seksioneve.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            👁️ Përdor <strong>switch</strong> për të aktivizuar/çaktivizuar pa fshirë.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            📝 Përmbajtja e çdo seksioni menaxhohet te formulari poshtë.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
