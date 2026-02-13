import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "./ImageUpload";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Save, Briefcase, X, Eye } from "lucide-react";
import {
  useServicePagesAdmin,
  useCreateServicePage,
  useUpdateServicePage,
  useDeleteServicePage,
  ServicePage,
} from "@/hooks/useServicePages";
import { useCategories } from "@/hooks/useCategories";
import { usePublicProjects } from "@/hooks/useProjects";
import { ServiceSectionsManager } from "./ServiceSectionsManager";
 
 export function ServicePageEditor() {
   const [selectedId, setSelectedId] = useState<string | null>(null);
   const { data: services, isLoading } = useServicePagesAdmin();
   const { data: categories } = useCategories();
   const { data: projects } = usePublicProjects();
   const createService = useCreateServicePage();
   const updateService = useUpdateServicePage();
   const deleteService = useDeleteServicePage();
 
  const [form, setForm] = useState<Partial<ServicePage>>({
    slug: "",
    title: "",
    subtitle: "",
    description: "",
    hero_image: null,
    features: [],
    recommended_categories: [],
    related_projects: [],
    meta_title: "",
    meta_description: "",
    is_active: true,
    display_order: 0,
  });
 
   const [newFeature, setNewFeature] = useState("");
 
   const handleSelect = (service: ServicePage) => {
     setSelectedId(service.id);
     setForm({
       slug: service.slug,
       title: service.title,
       subtitle: service.subtitle || "",
       description: service.description || "",
       hero_image: service.hero_image,
       features: service.features || [],
       recommended_categories: service.recommended_categories || [],
       related_projects: service.related_projects || [],
       meta_title: service.meta_title || "",
       meta_description: service.meta_description || "",
       is_active: service.is_active,
       display_order: service.display_order,
     });
   };
 
   const handleNew = () => {
     setSelectedId(null);
     setForm({
       slug: "",
       title: "",
       subtitle: "",
       description: "",
       hero_image: null,
       features: [],
       recommended_categories: [],
       related_projects: [],
       meta_title: "",
       meta_description: "",
       is_active: true,
       display_order: (services?.length || 0) + 1,
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
 
   const handleAddFeature = () => {
     if (newFeature.trim()) {
       setForm({ ...form, features: [...(form.features || []), newFeature.trim()] });
       setNewFeature("");
     }
   };
 
   const handleRemoveFeature = (index: number) => {
     setForm({
       ...form,
       features: form.features?.filter((_, i) => i !== index) || [],
     });
   };
 
   const handleCategoryToggle = (slug: string) => {
     const current = form.recommended_categories || [];
     if (current.includes(slug)) {
       setForm({ ...form, recommended_categories: current.filter((s) => s !== slug) });
     } else {
       setForm({ ...form, recommended_categories: [...current, slug] });
     }
   };

   const handleProjectToggle = (slug: string) => {
     const current = form.related_projects || [];
     if (current.includes(slug)) {
       setForm({ ...form, related_projects: current.filter((s) => s !== slug) });
     } else {
       setForm({ ...form, related_projects: [...current, slug] });
     }
   };
 
   const handleSave = async () => {
     if (!form.title || !form.slug) {
       toast({ title: "Gabim", description: "Titulli dhe slug janë të detyrueshme", variant: "destructive" });
       return;
     }
 
     try {
       if (selectedId) {
         await updateService.mutateAsync({ id: selectedId, ...form } as ServicePage & { id: string });
         toast({ title: "Sukses", description: "Shërbimi u përditësua" });
       } else {
         await createService.mutateAsync(form as Omit<ServicePage, "id">);
         toast({ title: "Sukses", description: "Shërbimi u krijua" });
         handleNew();
       }
     } catch (error: unknown) {
       const message = error instanceof Error ? error.message : "Gabim i panjohur";
       toast({ title: "Gabim", description: message, variant: "destructive" });
     }
   };
 
   const handleDelete = async () => {
     if (!selectedId) return;
     if (!confirm("Jeni të sigurt që doni ta fshini këtë shërbim?")) return;
 
     try {
       await deleteService.mutateAsync(selectedId);
       toast({ title: "Sukses", description: "Shërbimi u fshi" });
       handleNew();
     } catch (error: unknown) {
       const message = error instanceof Error ? error.message : "Gabim i panjohur";
       toast({ title: "Gabim", description: message, variant: "destructive" });
     }
   };
 
  return (
    <div className="space-y-6">
      {/* Top Row: Service List + Sections Manager */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Service List */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Shërbimet</CardTitle>
            <Button size="sm" onClick={handleNew}>
              <Plus className="h-4 w-4 mr-1" /> Shto
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            ) : (
              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                {services?.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleSelect(service)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      selectedId === service.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">{service.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`w-2 h-2 rounded-full ${service.is_active ? "bg-green-500" : "bg-muted-foreground/30"}`} />
                          <span className="text-xs opacity-70">/{service.slug}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sections Manager - Only show when a service is selected */}
        {selectedId && form.slug && (
          <div className="lg:col-span-2">
            <ServiceSectionsManager 
              serviceSlug={form.slug} 
              serviceTitle={form.title || ""} 
            />
          </div>
        )}
      </div>
 
      {/* Editor Card - Full Width */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{selectedId ? "Edito shërbimin" : "Shërbim i ri"}</CardTitle>
          {selectedId && form.slug && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/sherbimet/${form.slug}`, "_blank")}
            >
              <Eye className="h-4 w-4 mr-1" />
              Shiko faqen
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
             <Switch
               checked={form.is_active}
               onCheckedChange={(v) => setForm({ ...form, is_active: v })}
             />
             <Label>Aktiv</Label>
           </div>
 
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
 
           <div className="space-y-2">
             <Label>Nëntitulli</Label>
             <Input
               value={form.subtitle || ""}
               onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
             />
           </div>
 
           <div className="space-y-2">
             <Label>Përshkrimi</Label>
             <Textarea
               rows={5}
               value={form.description || ""}
               onChange={(e) => setForm({ ...form, description: e.target.value })}
             />
           </div>
 
           <div className="space-y-2">
             <Label>Imazhi Hero</Label>
             <ImageUpload
               value={form.hero_image}
               onChange={(v) => setForm({ ...form, hero_image: v })}
               folder="services"
             />
           </div>
 
           {/* Features */}
           <div className="space-y-2">
             <Label>Veçoritë</Label>
             <div className="flex gap-2">
               <Input
                 value={newFeature}
                 onChange={(e) => setNewFeature(e.target.value)}
                 placeholder="Shto veçori të re..."
                 onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())}
               />
               <Button type="button" variant="outline" onClick={handleAddFeature}>
                 <Plus className="h-4 w-4" />
               </Button>
             </div>
             <div className="flex flex-wrap gap-2 mt-2">
               {form.features?.map((feature, index) => (
                 <span
                   key={index}
                   className="inline-flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-sm"
                 >
                   {feature}
                   <button onClick={() => handleRemoveFeature(index)} className="hover:text-destructive">
                     <X className="h-3 w-3" />
                   </button>
                 </span>
               ))}
             </div>
           </div>
 
           {/* Recommended Categories */}
           <div className="space-y-2">
             <Label>Kategoritë e rekomanduara</Label>
             <div className="flex flex-wrap gap-2">
               {categories?.map((cat) => (
                 <button
                   key={cat.id}
                   type="button"
                   onClick={() => handleCategoryToggle(cat.slug)}
                   className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                     form.recommended_categories?.includes(cat.slug)
                       ? "bg-primary text-primary-foreground border-primary"
                       : "bg-background border-border hover:border-primary"
                   }`}
                 >
                   {cat.name}
                 </button>
               ))}
             </div>
           </div>

           {/* Related Projects */}
           <div className="space-y-2">
             <Label>Projektet e lidhura</Label>
             <p className="text-xs text-muted-foreground mb-2">
               Zgjidhni projektet që do të shfaqen në fund të faqes së shërbimit
             </p>
             <div className="flex flex-wrap gap-2">
               {projects?.map((project) => (
                 <button
                   key={project.id}
                   type="button"
                   onClick={() => handleProjectToggle(project.slug)}
                   className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                     form.related_projects?.includes(project.slug)
                       ? "bg-primary text-primary-foreground border-primary"
                       : "bg-background border-border hover:border-primary"
                   }`}
                 >
                   {project.title}
                 </button>
               ))}
             </div>
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
 
           <div className="space-y-2">
             <Label>Renditja</Label>
             <Input
               type="number"
               value={form.display_order || 0}
               onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
               className="w-24"
             />
           </div>
 
           <div className="flex gap-2">
             <Button onClick={handleSave} disabled={createService.isPending || updateService.isPending}>
               {(createService.isPending || updateService.isPending) ? (
                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
               ) : (
                 <Save className="h-4 w-4 mr-2" />
               )}
               Ruaj
             </Button>
             {selectedId && (
               <Button variant="destructive" onClick={handleDelete} disabled={deleteService.isPending}>
                 <Trash2 className="h-4 w-4 mr-2" />
                 Fshi
               </Button>
             )}
           </div>
         </CardContent>
        </Card>
    </div>
  );
}