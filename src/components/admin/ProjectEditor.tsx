import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "./ImageUpload";
import { MultiImageUpload } from "./MultiImageUpload";
import { MultiCategorySelect } from "./MultiCategorySelect";
import { ProjectSortableList } from "./ProjectSortableList";
import { ProjectCategoryManager } from "./ProjectCategoryManager";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Save, FolderOpen, ArrowUpDown, Edit, Tags } from "lucide-react";
import {
  useProjectsAdmin,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  Project,
} from "@/hooks/useProjects";
import {
  useProjectCategories,
  useProjectCategoryLinks,
  useSaveProjectCategories,
} from "@/hooks/useProjectCategories";

 export function ProjectEditor() {
   const [selectedId, setSelectedId] = useState<string | null>(null);
   const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
   const { data: projects, isLoading } = useProjectsAdmin();
   const { data: projectCategories } = useProjectCategories();
   const { data: categoryLinks } = useProjectCategoryLinks(selectedId || undefined);
   const createProject = useCreateProject();
   const updateProject = useUpdateProject();
   const deleteProject = useDeleteProject();
   const saveCategories = useSaveProjectCategories();

   // Sync category links when selecting a project
   useEffect(() => {
     if (categoryLinks) {
       setSelectedCategoryIds(categoryLinks);
     }
   }, [categoryLinks]);
 
   const [form, setForm] = useState<Partial<Project>>({
     title: "",
     slug: "",
     tag: "Hotel",
     description: "",
     environment: "",
     goal: "",
     hero_image: null,
     gallery: [],
     display_order: 0,
     is_featured: false,
     meta_title: "",
     meta_description: "",
   });
 
   const selectedProject = projects?.find((p) => p.id === selectedId);
 
   const handleSelect = (project: Project) => {
     setSelectedId(project.id);
     setForm({
       title: project.title,
       slug: project.slug,
       tag: project.tag,
       description: project.description || "",
       environment: project.environment || "",
       goal: project.goal || "",
       hero_image: project.hero_image,
       gallery: project.gallery || [],
       display_order: project.display_order,
       is_featured: project.is_featured,
       meta_title: project.meta_title || "",
       meta_description: project.meta_description || "",
     });
   };
 
    const handleNew = () => {
      setSelectedId(null);
      setSelectedCategoryIds([]);
      setForm({
        title: "",
        slug: "",
        tag: "Hotel",
        description: "",
        environment: "",
        goal: "",
        hero_image: null,
        gallery: [],
        display_order: (projects?.length || 0) + 1,
        is_featured: false,
        meta_title: "",
        meta_description: "",
      });
    };
 
   const generateSlug = (title: string) => {
     return title
       .toLowerCase()
       .replace(/[ëë]/g, "e")
       .replace(/[çç]/g, "c")
       .replace(/\s+/g, "-")
       .replace(/[^a-z0-9-]/g, "");
   };
 
   const handleSave = async () => {
     if (!form.title || !form.slug) {
       toast({ title: "Gabim", description: "Titulli dhe slug janë të detyrueshme", variant: "destructive" });
       return;
     }
 
     try {
        if (selectedId) {
          await updateProject.mutateAsync({ id: selectedId, ...form } as Project & { id: string });
          await saveCategories.mutateAsync({ projectId: selectedId, categoryIds: selectedCategoryIds });
          toast({ title: "Sukses", description: "Projekti u përditësua" });
        } else {
          const result = await createProject.mutateAsync(form as Omit<Project, "id">);
          if (result && selectedCategoryIds.length > 0) {
            await saveCategories.mutateAsync({ projectId: result.id, categoryIds: selectedCategoryIds });
          }
          toast({ title: "Sukses", description: "Projekti u krijua" });
          handleNew();
        }
     } catch (error: unknown) {
       const message = error instanceof Error ? error.message : "Gabim i panjohur";
       toast({ title: "Gabim", description: message, variant: "destructive" });
     }
   };
 
   const handleDelete = async () => {
     if (!selectedId) return;
     if (!confirm("Jeni të sigurt që doni ta fshini këtë projekt?")) return;
 
     try {
       await deleteProject.mutateAsync(selectedId);
       toast({ title: "Sukses", description: "Projekti u fshi" });
       handleNew();
     } catch (error: unknown) {
       const message = error instanceof Error ? error.message : "Gabim i panjohur";
       toast({ title: "Gabim", description: message, variant: "destructive" });
     }
   };
 
  return (
    <Tabs defaultValue="edit" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="edit" className="gap-2">
          <Edit className="h-4 w-4" />
          Edito Projekte
        </TabsTrigger>
       <TabsTrigger value="order" className="gap-2">
           <ArrowUpDown className="h-4 w-4" />
           Renditja në Homepage
         </TabsTrigger>
         <TabsTrigger value="categories" className="gap-2">
           <Tags className="h-4 w-4" />
           Kategoritë
         </TabsTrigger>
       </TabsList>

      <TabsContent value="edit">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Project List */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Projektet</CardTitle>
              <Button size="sm" onClick={handleNew}>
                <Plus className="h-4 w-4 mr-1" /> Shto
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              ) : (
                <div className="space-y-1 max-h-[500px] overflow-y-auto">
                  {projects?.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleSelect(project)}
                      className={`w-full text-left p-3 rounded-md transition-colors ${
                        selectedId === project.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate">{project.title}</div>
                          <div className="text-xs opacity-70">{project.tag}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Editor */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{selectedId ? "Edito projektin" : "Projekt i ri"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titulli *</Label>
                  <Input
                    value={form.title || ""}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        title: e.target.value,
                        slug: form.slug || generateSlug(e.target.value),
                      });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input
                    value={form.slug || ""}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategoritë</Label>
                  <MultiCategorySelect
                    categories={(projectCategories || []).map(c => ({ id: c.id, name: c.name }))}
                    selectedIds={selectedCategoryIds}
                    onChange={(ids) => {
                      setSelectedCategoryIds(ids);
                      // Keep tag in sync with first selected category for backward compat
                      const firstCat = projectCategories?.find(c => c.id === ids[0]);
                      if (firstCat) setForm(f => ({ ...f, tag: firstCat.name }));
                    }}
                    placeholder="Zgjidh kategoritë"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Renditja</Label>
                  <Input
                    type="number"
                    value={form.display_order || 0}
                    onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={form.is_featured}
                  onCheckedChange={(v) => setForm({ ...form, is_featured: v })}
                />
                <Label>I preferuar</Label>
              </div>

              <div className="space-y-2">
                <Label>Përshkrimi</Label>
                <Textarea
                  rows={4}
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ambienti</Label>
                  <Input
                    value={form.environment || ""}
                    onChange={(e) => setForm({ ...form, environment: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Qëllimi</Label>
                  <Input
                    value={form.goal || ""}
                    onChange={(e) => setForm({ ...form, goal: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Imazhi kryesor</Label>
                <ImageUpload
                  value={form.hero_image}
                  onChange={(v) => setForm({ ...form, hero_image: v })}
                  folder="projects"
                />
              </div>

              <div className="space-y-2">
                <Label>Galeria</Label>
                <MultiImageUpload
                  value={form.gallery || []}
                  onChange={(v) => setForm({ ...form, gallery: v })}
                  folder="projects"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Meta Title (SEO)</Label>
                  <Input
                    value={form.meta_title || ""}
                    onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meta Description (SEO)</Label>
                  <Input
                    value={form.meta_description || ""}
                    onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={createProject.isPending || updateProject.isPending}>
                  {(createProject.isPending || updateProject.isPending) ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Ruaj
                </Button>
                {selectedId && (
                  <Button variant="destructive" onClick={handleDelete} disabled={deleteProject.isPending}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Fshi
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="order">
        <ProjectSortableList />
      </TabsContent>

      <TabsContent value="categories">
        <ProjectCategoryManager />
      </TabsContent>
    </Tabs>
  );
}