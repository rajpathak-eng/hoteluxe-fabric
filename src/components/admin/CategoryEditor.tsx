import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, Trash2, Plus } from "lucide-react";
import {
  useCategoriesAdmin,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  CategoryFull,
} from "@/hooks/useCms";
 
 export function CategoryEditor() {
   const { data: categories, isLoading } = useCategoriesAdmin();
   const createCategory = useCreateCategory();
   const updateCategory = useUpdateCategory();
   const deleteCategory = useDeleteCategory();
 
   const [selectedId, setSelectedId] = useState<string | null>(null);
   const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Partial<CategoryFull>>({
    name: "",
    slug: "",
    description: "",
    image_url: null,
    display_order: 0,
    parent_id: null,
    meta_title: "",
    meta_description: "",
  });
 
   const selectedCategory = categories?.find((c) => c.id === selectedId);
 
  useEffect(() => {
    if (selectedCategory && !isNew) {
      setForm({
        name: selectedCategory.name || "",
        slug: selectedCategory.slug || "",
        description: selectedCategory.description || "",
        image_url: selectedCategory.image_url || null,
        display_order: selectedCategory.display_order || 0,
        parent_id: selectedCategory.parent_id || null,
        meta_title: selectedCategory.meta_title || "",
        meta_description: selectedCategory.meta_description || "",
      });
    }
  }, [selectedCategory, isNew]);
 
   const handleNew = () => {
     setIsNew(true);
     setSelectedId(null);
    setForm({
      name: "",
      slug: "",
      description: "",
      image_url: null,
      display_order: 0,
      parent_id: null,
      meta_title: "",
      meta_description: "",
    });
   };
 
   const handleSave = async () => {
     if (!form.name || !form.slug) {
       toast({
         title: "Gabim",
         description: "Emri dhe slug janë të detyrueshme",
         variant: "destructive",
       });
       return;
     }
 
     try {
       if (isNew) {
         await createCategory.mutateAsync(form as any);
         toast({ title: "Sukses", description: "Kategoria u krijua" });
         setIsNew(false);
       } else if (selectedId) {
         await updateCategory.mutateAsync({ id: selectedId, ...form });
         toast({ title: "Sukses", description: "Kategoria u përditësua" });
       }
     } catch (error: any) {
       toast({
         title: "Gabim",
         description: error.message,
         variant: "destructive",
       });
     }
   };
 
   const handleDelete = async () => {
     if (!selectedId) return;
     if (!confirm("Jeni të sigurt? Kjo do të fshijë edhe të gjitha produktet e kategorisë!")) return;
 
     try {
       await deleteCategory.mutateAsync(selectedId);
       toast({ title: "Sukses", description: "Kategoria u fshi" });
       setSelectedId(null);
     } catch (error: any) {
       toast({
         title: "Gabim",
         description: error.message,
         variant: "destructive",
       });
     }
   };
 
   const generateSlug = (name: string) => {
     return name
       .toLowerCase()
       .replace(/ë/g, "e")
       .replace(/ç/g, "c")
       .replace(/[^a-z0-9]+/g, "-")
       .replace(/(^-|-$)/g, "");
   };
 
   return (
     <div className="grid lg:grid-cols-3 gap-6">
       {/* Category List */}
       <Card className="lg:col-span-1">
         <CardHeader className="flex flex-row items-center justify-between">
           <CardTitle className="text-lg">Kategoritë</CardTitle>
           <Button size="sm" onClick={handleNew}>
             <Plus className="h-4 w-4 mr-1" />
             Shto
           </Button>
         </CardHeader>
         <CardContent className="max-h-[600px] overflow-y-auto">
           {isLoading ? (
             <Loader2 className="h-6 w-6 animate-spin mx-auto" />
           ) : (
             <div className="space-y-1">
               {categories?.map((cat) => (
                 <button
                   key={cat.id}
                   onClick={() => {
                     setSelectedId(cat.id);
                     setIsNew(false);
                   }}
                   className={`w-full text-left p-3 rounded-md transition-colors ${
                     selectedId === cat.id
                       ? "bg-primary text-primary-foreground"
                       : "hover:bg-muted"
                   }`}
                 >
                   <div className="font-medium text-sm truncate">{cat.name}</div>
                   <div className="text-xs opacity-70">/{cat.slug}</div>
                 </button>
               ))}
             </div>
           )}
         </CardContent>
       </Card>
 
       {/* Editor */}
       <Card className="lg:col-span-2">
         <CardHeader>
           <CardTitle>{isNew ? "Kategori e re" : selectedCategory?.name || "Zgjidh kategori"}</CardTitle>
         </CardHeader>
         <CardContent className="space-y-6">
           {(selectedId || isNew) ? (
             <>
               <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Emri *</Label>
                   <Input
                     value={form.name}
                     onChange={(e) => {
                       setForm({
                         ...form,
                         name: e.target.value,
                         slug: isNew ? generateSlug(e.target.value) : form.slug,
                       });
                     }}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label>Slug *</Label>
                   <Input
                     value={form.slug}
                     onChange={(e) => setForm({ ...form, slug: e.target.value })}
                   />
                 </div>
               </div>
 
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Renditja</Label>
                  <Input
                    type="number"
                    value={form.display_order}
                    onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                    className="w-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kategoria Prind</Label>
                  <Select
                    value={form.parent_id || ""}
                    onValueChange={(value) => setForm({ ...form, parent_id: value || null })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Asnjë (kategori kryesore)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Asnjë (kategori kryesore)</SelectItem>
                      {categories
                        ?.filter((c) => c.id !== selectedId && !c.parent_id)
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
 
               <div className="space-y-2">
                 <Label>Përshkrimi</Label>
                 <Textarea
                   value={form.description || ""}
                   onChange={(e) => setForm({ ...form, description: e.target.value })}
                   rows={3}
                 />
               </div>
 
               <div className="space-y-2">
                 <Label>Imazhi i kategorisë</Label>
                 <ImageUpload
                   value={form.image_url}
                   onChange={(v) => setForm({ ...form, image_url: v })}
                   folder="categories"
                 />
               </div>
 
               <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Meta Title</Label>
                   <Input
                     value={form.meta_title || ""}
                     onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                     maxLength={60}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label>Meta Description</Label>
                   <Textarea
                     value={form.meta_description || ""}
                     onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                     maxLength={160}
                     rows={2}
                   />
                 </div>
               </div>
 
               <div className="flex gap-2">
                 <Button onClick={handleSave} disabled={createCategory.isPending || updateCategory.isPending}>
                   {(createCategory.isPending || updateCategory.isPending) ? (
                     <Loader2 className="h-4 w-4 animate-spin mr-2" />
                   ) : (
                     <Save className="h-4 w-4 mr-2" />
                   )}
                   Ruaj
                 </Button>
                 {!isNew && selectedId && (
                   <Button variant="destructive" onClick={handleDelete} disabled={deleteCategory.isPending}>
                     <Trash2 className="h-4 w-4 mr-2" />
                     Fshi
                   </Button>
                 )}
               </div>
             </>
           ) : (
             <p className="text-muted-foreground text-center py-8">
               Zgjidhni një kategori ose krijoni një të re
             </p>
           )}
         </CardContent>
       </Card>
     </div>
   );
 }