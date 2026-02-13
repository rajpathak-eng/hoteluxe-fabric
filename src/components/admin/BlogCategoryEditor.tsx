 import { useState, useEffect } from "react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { toast } from "@/hooks/use-toast";
 import { Loader2, Save, Trash2, Plus } from "lucide-react";
 import {
   useBlogCategories,
   useCreateBlogCategory,
   useUpdateBlogCategory,
   useDeleteBlogCategory,
   BlogCategory,
 } from "@/hooks/useCms";
 
 export function BlogCategoryEditor() {
   const { data: categories, isLoading } = useBlogCategories();
   const createCategory = useCreateBlogCategory();
   const updateCategory = useUpdateBlogCategory();
   const deleteCategory = useDeleteBlogCategory();
 
   const [selectedId, setSelectedId] = useState<string | null>(null);
   const [isNew, setIsNew] = useState(false);
   const [form, setForm] = useState<Partial<BlogCategory>>({
     name: "",
     slug: "",
     description: "",
     display_order: 0,
   });
 
   const selectedCategory = categories?.find((c) => c.id === selectedId);
 
   useEffect(() => {
     if (selectedCategory && !isNew) {
       setForm({
         name: selectedCategory.name || "",
         slug: selectedCategory.slug || "",
         description: selectedCategory.description || "",
         display_order: selectedCategory.display_order || 0,
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
       display_order: 0,
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
     if (!confirm("Jeni të sigurt që doni të fshini këtë kategori?")) return;
 
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
       <Card className="lg:col-span-1">
         <CardHeader className="flex flex-row items-center justify-between">
           <CardTitle className="text-lg">Kategoritë e Blogut</CardTitle>
           <Button size="sm" onClick={handleNew}>
             <Plus className="h-4 w-4 mr-1" />
             Shto
           </Button>
         </CardHeader>
         <CardContent>
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
                   <div className="font-medium text-sm">{cat.name}</div>
                 </button>
               ))}
             </div>
           )}
         </CardContent>
       </Card>
 
       <Card className="lg:col-span-2">
         <CardHeader>
           <CardTitle>{isNew ? "Kategori e re" : selectedCategory?.name || "Zgjidh kategori"}</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
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
 
               <div className="space-y-2">
                 <Label>Përshkrimi</Label>
                 <Textarea
                   value={form.description || ""}
                   onChange={(e) => setForm({ ...form, description: e.target.value })}
                   rows={2}
                 />
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