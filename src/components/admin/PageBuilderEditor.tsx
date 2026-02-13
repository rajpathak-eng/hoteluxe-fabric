import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, Eye, GripVertical, Plus, ArrowRightLeft, Trash2 } from "lucide-react";
import { usePageSections, useUpdatePageSection, useCreatePageSection, PageSection } from "@/hooks/useCms";
import { useServicePagesAdmin, useCreateServicePage } from "@/hooks/useServicePages";
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
} from "@dnd-kit/sortable";
import { SortableSectionItem } from "./SortableSectionItem";
import { SectionEditorPanel } from "./SectionEditorPanel";

const staticPages = [
  { value: "home", label: "Kryefaqja", url: "/", isService: false },
  { value: "about", label: "Rreth Nesh", url: "/rreth-nesh", isService: false },
  { value: "contact", label: "Kontakt", url: "/kontakt", isService: false },
  { value: "faq", label: "FAQ", url: "/faq", isService: false },
  { value: "products", label: "Produktet", url: "/produktet", isService: false },
  { value: "projects", label: "Projektet", url: "/projekte", isService: false },
  { value: "blog", label: "Blog", url: "/blog", isService: false },
  { value: "quote", label: "Kërko Ofertë", url: "/merr-nje-oferte", isService: false },
];

const sectionLabels: Record<string, string> = {
  hero: "Hero Banner",
  "hero-homepage": "Hero - Homepage",
  about: "Rreth Nesh",
  differentiators: "Pse Ne? (4 Kartat)",
  products: "Produktet",
  industries: "Industritë (Karusel)",
  portfolio: "Projektet",
  contact: "Kontakt & Formulari",
  trust: "Statistikat (Numrat)",
  certifications: "Certifikime & Partnerë",
  cta: "Call to Action",
  "featured-products": "Produktet Tona",
  history: "Historia",
  commitment: "Përkushtimi",
  info: "Informacion",
  steps: "Si Funksionon",
  services: "Shërbimet",
  gallery: "Galeria",
  benefits: "Përfitimet",
  faq: "Pyetje të Shpeshta",
  testimonials: "Testimonialet",
  video: "Video",
};

const availableSectionTypes = [
  { key: "hero", label: "Hero Banner" },
  { key: "hero-homepage", label: "Hero - Homepage" },
  { key: "about", label: "Rreth Nesh" },
  { key: "differentiators", label: "Pse Ne? (Kartat)" },
  { key: "products", label: "Produktet" },
  { key: "industries", label: "Industritë" },
  { key: "portfolio", label: "Projektet" },
  { key: "contact", label: "Kontakt & Formulari" },
  { key: "trust", label: "Statistikat" },
  { key: "certifications", label: "Certifikime" },
  { key: "cta", label: "Call to Action" },
  { key: "featured-products", label: "Produktet Tona" },
  { key: "services", label: "Shërbimet" },
  { key: "gallery", label: "Galeria" },
  { key: "benefits", label: "Përfitimet" },
  { key: "faq", label: "Pyetje të Shpeshta" },
  { key: "testimonials", label: "Testimonialet" },
  { key: "video", label: "Video" },
];

export function PageBuilderEditor() {
  const [selectedPage, setSelectedPage] = useState("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [sectionToMove, setSectionToMove] = useState<PageSection | null>(null);
  const [targetPage, setTargetPage] = useState("");
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [newSectionType, setNewSectionType] = useState("");
  const [createPageOpen, setCreatePageOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [selectedSectionsForNewPage, setSelectedSectionsForNewPage] = useState<string[]>([]);
  
  const { data: sections, isLoading } = usePageSections(selectedPage);
  const { data: servicePages } = useServicePagesAdmin();
  const updateSection = useUpdatePageSection();
  const createSection = useCreatePageSection();
  const queryClient = useQueryClient();

  // Import service page mutations
  const createServicePage = useCreateServicePage();

  // Combine static pages with dynamic service pages (including Personalizim)
  const pages = useMemo(() => {
    const dynamicServicePages = servicePages?.map(sp => ({
      value: `service-${sp.slug}`,
      label: `📦 ${sp.title}`,
      url: `/sherbimet/${sp.slug}`,
      isService: true,
      serviceId: sp.id,
    })) || [];
    
    // Add Personalizimi as a special service page
    const personalizimPage = {
      value: "personalizimi",
      label: "📦 Personalizim",
      url: "/personalizimi",
      isService: true,
      serviceId: null,
    };
    
    return [...staticPages, personalizimPage, ...dynamicServicePages];
  }, [servicePages]);

  // Get the preview URL for the selected page
  const getPreviewUrl = () => {
    const page = pages.find(p => p.value === selectedPage);
    return page?.url || `/${selectedPage}`;
  };

  const [form, setForm] = useState<Partial<PageSection>>({
    title: "",
    subtitle: "",
    content: "",
    image_url: null,
    button_text: "",
    button_url: "",
    is_active: true,
    items: [],
  });

  const selectedSection = sections?.find((s) => s.id === selectedId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (selectedSection) {
      setForm({
        title: selectedSection.title || "",
        subtitle: selectedSection.subtitle || "",
        content: selectedSection.content || "",
        image_url: selectedSection.image_url || null,
        button_text: selectedSection.button_text || "",
        button_url: selectedSection.button_url || "",
        is_active: selectedSection.is_active ?? true,
        items: selectedSection.items || [],
      });
    }
  }, [selectedSection]);

  useEffect(() => {
    setSelectedId(null);
  }, [selectedPage]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id || !sections) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    
    const newOrder = arrayMove(sections, oldIndex, newIndex);
    
    // Update display_order for all affected sections
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

  const handleMoveSection = async () => {
    if (!sectionToMove || !targetPage) return;

    try {
      // Get max display_order in target page
      const { data: targetSections } = await supabase
        .from("page_sections")
        .select("display_order")
        .eq("page_slug", targetPage)
        .order("display_order", { ascending: false })
        .limit(1);

      const newOrder = (targetSections?.[0]?.display_order ?? -1) + 1;

      await supabase
        .from("page_sections")
        .update({ page_slug: targetPage, display_order: newOrder })
        .eq("id", sectionToMove.id);

      queryClient.invalidateQueries({ queryKey: ["page-sections"] });
      queryClient.invalidateQueries({ queryKey: ["public-page-sections"] });
      
      setMoveDialogOpen(false);
      setSectionToMove(null);
      setTargetPage("");
      setSelectedId(null);
      
      toast({ 
        title: "Sukses", 
        description: `Seksioni u zhvendos te "${pages.find(p => p.value === targetPage)?.label}"` 
      });
    } catch (error: any) {
      toast({ title: "Gabim", description: error.message, variant: "destructive" });
    }
  };

  const handleAddSection = async () => {
    if (!newSectionType) return;

    try {
      const { data: existingSections } = await supabase
        .from("page_sections")
        .select("display_order")
        .eq("page_slug", selectedPage)
        .order("display_order", { ascending: false })
        .limit(1);

      const newOrder = (existingSections?.[0]?.display_order ?? -1) + 1;

      await createSection.mutateAsync({
        page_slug: selectedPage,
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
      toast({ title: "Sukses", description: "Seksioni i ri u shtua" });
    } catch (error: any) {
      toast({ title: "Gabim", description: error.message, variant: "destructive" });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[ëë]/g, "e")
      .replace(/[çç]/g, "c")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const handleCreateNewPage = async () => {
    if (!newPageTitle.trim() || !newPageSlug.trim()) {
      toast({ title: "Gabim", description: "Titulli dhe slug janë të detyrueshme", variant: "destructive" });
      return;
    }

    try {
      // Create the service page first
      await createServicePage.mutateAsync({
        title: newPageTitle,
        slug: newPageSlug,
        subtitle: null,
        description: null,
        hero_image: null,
        features: [],
        recommended_categories: [],
        related_projects: [],
        meta_title: null,
        meta_description: null,
        is_active: true,
        display_order: (servicePages?.length || 0) + 1,
      });

      // Create the selected sections for the new page
      const pageSlug = `service-${newPageSlug}`;
      for (let i = 0; i < selectedSectionsForNewPage.length; i++) {
        await createSection.mutateAsync({
          page_slug: pageSlug,
          section_key: selectedSectionsForNewPage[i],
          title: "",
          subtitle: "",
          content: "",
          image_url: null,
          gallery: null,
          button_text: "",
          button_url: "",
          display_order: i,
          is_active: true,
          items: [],
        });
      }

      queryClient.invalidateQueries({ queryKey: ["service-pages-admin"] });
      setCreatePageOpen(false);
      setNewPageTitle("");
      setNewPageSlug("");
      setSelectedSectionsForNewPage([]);
      
      // Switch to the new page
      setSelectedPage(pageSlug);
      
      toast({ title: "Sukses", description: "Faqja e re u krijua me sukses" });
    } catch (error: any) {
      toast({ title: "Gabim", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Jeni të sigurt që dëshironi të fshini këtë seksion?")) return;

    try {
      await supabase.from("page_sections").delete().eq("id", sectionId);
      queryClient.invalidateQueries({ queryKey: ["page-sections"] });
      queryClient.invalidateQueries({ queryKey: ["public-page-sections"] });
      setSelectedId(null);
      toast({ title: "Sukses", description: "Seksioni u fshi" });
    } catch (error: any) {
      toast({ title: "Gabim", description: error.message, variant: "destructive" });
    }
  };

  const handleSave = async () => {
    if (!selectedId) return;

    try {
      await updateSection.mutateAsync({ id: selectedId, ...form });
      queryClient.invalidateQueries({ queryKey: ["public-page-sections"] });
      toast({ title: "Sukses", description: "Seksioni u përditësua" });
    } catch (error: any) {
      toast({ title: "Gabim", description: error.message, variant: "destructive" });
    }
  };

  const getSectionLabel = (key: string) => sectionLabels[key] || key;

  const sortedSections = sections?.slice().sort((a, b) => a.display_order - b.display_order) || [];

  return (
    <div className="space-y-6">
      {/* Page Selector */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Label>Zgjidh faqen:</Label>
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pages.map((page) => (
                <SelectItem key={page.value} value={page.value}>
                  {page.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Create New Page Button */}
          <Dialog open={createPageOpen} onOpenChange={setCreatePageOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Shto faqe të re
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Krijo faqe të re shërbimi</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Titulli i faqes *</Label>
                  <Input
                    value={newPageTitle}
                    onChange={(e) => {
                      setNewPageTitle(e.target.value);
                      setNewPageSlug(generateSlug(e.target.value));
                    }}
                    placeholder="p.sh. Tekstile për SPA"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug (URL) *</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">/sherbimet/</span>
                    <Input
                      value={newPageSlug}
                      onChange={(e) => setNewPageSlug(e.target.value)}
                      placeholder="tekstile-per-spa"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Zgjidh seksionet që do të përfshihen:</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Kliko për të zgjedhur seksionet. Mund t'i riorganizosh më vonë me drag & drop.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {availableSectionTypes.map((type) => (
                      <button
                        key={type.key}
                        type="button"
                        onClick={() => {
                          if (selectedSectionsForNewPage.includes(type.key)) {
                            setSelectedSectionsForNewPage(
                              selectedSectionsForNewPage.filter((k) => k !== type.key)
                            );
                          } else {
                            setSelectedSectionsForNewPage([...selectedSectionsForNewPage, type.key]);
                          }
                        }}
                        className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                          selectedSectionsForNewPage.includes(type.key)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border hover:border-primary"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                  {selectedSectionsForNewPage.length > 0 && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <p className="text-xs font-medium mb-2">Renditja e zgjedhur:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedSectionsForNewPage.map((key, index) => (
                          <span key={key} className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded text-xs">
                            {index + 1}. {availableSectionTypes.find(t => t.key === key)?.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={handleCreateNewPage} 
                  disabled={!newPageTitle.trim() || !newPageSlug.trim() || createServicePage.isPending}
                  className="w-full"
                >
                  {createServicePage.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Krijo faqen
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Section Button */}
          <Dialog open={addSectionOpen} onOpenChange={setAddSectionOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Shto seksion
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Shto seksion të ri</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Lloji i seksionit</Label>
                  <Select value={newSectionType} onValueChange={setNewSectionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Zgjidh llojin..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSectionTypes.map((type) => (
                        <SelectItem key={type.key} value={type.key}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddSection} disabled={!newSectionType}>
                  <Plus className="w-4 h-4 mr-2" />
                  Shto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" asChild>
            <a href={getPreviewUrl()} target="_blank" rel="noopener noreferrer">
              <Eye className="w-4 h-4 mr-2" />
              Shiko faqen
            </a>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Section List with Drag & Drop */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              Seksionet (Drag & Drop)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            ) : sortedSections.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                Nuk ka seksione për këtë faqe
              </p>
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
                  <div className="space-y-1">
                    {sortedSections.map((section) => (
                      <SortableSectionItem
                        key={section.id}
                        section={section}
                        isSelected={selectedId === section.id}
                        onClick={() => setSelectedId(section.id)}
                        onMove={() => {
                          setSectionToMove(section);
                          setMoveDialogOpen(true);
                        }}
                        onDelete={() => handleDeleteSection(section.id)}
                        getSectionLabel={getSectionLabel}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>

        {/* Editor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedSection ? getSectionLabel(selectedSection.section_key) : "Zgjidh seksion"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedId && selectedSection ? (
              <>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.is_active}
                    onCheckedChange={(v) => setForm({ ...form, is_active: v })}
                  />
                  <Label>Seksioni aktiv</Label>
                </div>

                <SectionEditorPanel 
                  sectionKey={selectedSection.section_key}
                  form={form}
                  setForm={setForm}
                  pageSlug={selectedPage}
                />

                <Button onClick={handleSave} disabled={updateSection.isPending}>
                  {updateSection.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Ruaj ndryshimet
                </Button>
              </>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Zgjidhni një seksion për ta edituar
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Move Section Dialog */}
      <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zhvendos seksionin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Zhvendos "{sectionToMove && getSectionLabel(sectionToMove.section_key)}" në faqen:
            </p>
            <Select value={targetPage} onValueChange={setTargetPage}>
              <SelectTrigger>
                <SelectValue placeholder="Zgjidh faqen..." />
              </SelectTrigger>
              <SelectContent>
                {pages
                  .filter((p) => p.value !== selectedPage)
                  .map((page) => (
                    <SelectItem key={page.value} value={page.value}>
                      {page.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button onClick={handleMoveSection} disabled={!targetPage}>
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Zhvendos
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
