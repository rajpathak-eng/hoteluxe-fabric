 import { useState } from "react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import { Switch } from "@/components/ui/switch";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { toast } from "@/hooks/use-toast";
 import { Loader2, Plus, Trash2, Save, HelpCircle } from "lucide-react";
 import {
   useFaqItemsAdmin,
   useCreateFaqItem,
   useUpdateFaqItem,
   useDeleteFaqItem,
   FaqItem,
 } from "@/hooks/useFaqItems";
 
 export function FaqEditor() {
   const [selectedId, setSelectedId] = useState<string | null>(null);
   const { data: faqs, isLoading } = useFaqItemsAdmin();
   const createFaq = useCreateFaqItem();
   const updateFaq = useUpdateFaqItem();
   const deleteFaq = useDeleteFaqItem();
 
   const [form, setForm] = useState<Partial<FaqItem>>({
     question: "",
     answer: "",
     category: "general",
     display_order: 0,
     is_active: true,
   });
 
   const handleSelect = (faq: FaqItem) => {
     setSelectedId(faq.id);
     setForm({
       question: faq.question,
       answer: faq.answer,
       category: faq.category,
       display_order: faq.display_order,
       is_active: faq.is_active,
     });
   };
 
   const handleNew = () => {
     setSelectedId(null);
     setForm({
       question: "",
       answer: "",
       category: "general",
       display_order: (faqs?.length || 0) + 1,
       is_active: true,
     });
   };
 
   const handleSave = async () => {
     if (!form.question || !form.answer) {
       toast({ title: "Gabim", description: "Pyetja dhe përgjigja janë të detyrueshme", variant: "destructive" });
       return;
     }
 
     try {
       if (selectedId) {
         await updateFaq.mutateAsync({ id: selectedId, ...form } as FaqItem & { id: string });
         toast({ title: "Sukses", description: "FAQ u përditësua" });
       } else {
         await createFaq.mutateAsync(form as Omit<FaqItem, "id">);
         toast({ title: "Sukses", description: "FAQ u krijua" });
         handleNew();
       }
     } catch (error: unknown) {
       const message = error instanceof Error ? error.message : "Gabim i panjohur";
       toast({ title: "Gabim", description: message, variant: "destructive" });
     }
   };
 
   const handleDelete = async () => {
     if (!selectedId) return;
     if (!confirm("Jeni të sigurt që doni ta fshini këtë FAQ?")) return;
 
     try {
       await deleteFaq.mutateAsync(selectedId);
       toast({ title: "Sukses", description: "FAQ u fshi" });
       handleNew();
     } catch (error: unknown) {
       const message = error instanceof Error ? error.message : "Gabim i panjohur";
       toast({ title: "Gabim", description: message, variant: "destructive" });
     }
   };
 
   return (
     <div className="grid lg:grid-cols-3 gap-6">
       {/* FAQ List */}
       <Card className="lg:col-span-1">
         <CardHeader className="flex flex-row items-center justify-between">
           <CardTitle className="text-lg">Pyetjet FAQ</CardTitle>
           <Button size="sm" onClick={handleNew}>
             <Plus className="h-4 w-4 mr-1" /> Shto
           </Button>
         </CardHeader>
         <CardContent>
           {isLoading ? (
             <Loader2 className="h-6 w-6 animate-spin mx-auto" />
           ) : (
             <div className="space-y-1 max-h-[500px] overflow-y-auto">
               {faqs?.map((faq) => (
                 <button
                   key={faq.id}
                   onClick={() => handleSelect(faq)}
                   className={`w-full text-left p-3 rounded-md transition-colors ${
                     selectedId === faq.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                   }`}
                 >
                   <div className="flex items-center gap-2">
                     <HelpCircle className="h-4 w-4 flex-shrink-0" />
                     <div className="min-w-0 flex-1">
                       <div className="font-medium text-sm truncate">{faq.question}</div>
                       <div className="flex items-center gap-2 mt-1">
                         <span className={`w-2 h-2 rounded-full ${faq.is_active ? "bg-green-500" : "bg-muted-foreground/30"}`} />
                         <span className="text-xs opacity-70">#{faq.display_order}</span>
                       </div>
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
           <CardTitle>{selectedId ? "Edito FAQ" : "FAQ e re"}</CardTitle>
         </CardHeader>
         <CardContent className="space-y-6">
           <div className="flex items-center gap-2">
             <Switch
               checked={form.is_active}
               onCheckedChange={(v) => setForm({ ...form, is_active: v })}
             />
             <Label>Aktive</Label>
           </div>
 
           <div className="space-y-2">
             <Label>Pyetja *</Label>
             <Input
               value={form.question || ""}
               onChange={(e) => setForm({ ...form, question: e.target.value })}
               placeholder="p.sh. Cilat janë kushtet e pagesës?"
             />
           </div>
 
           <div className="space-y-2">
             <Label>Përgjigja *</Label>
             <Textarea
               rows={6}
               value={form.answer || ""}
               onChange={(e) => setForm({ ...form, answer: e.target.value })}
               placeholder="Shkruani përgjigjen e plotë..."
             />
           </div>
 
           <div className="grid md:grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label>Kategoria</Label>
               <Input
                 value={form.category || ""}
                 onChange={(e) => setForm({ ...form, category: e.target.value })}
                 placeholder="general"
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
 
           <div className="flex gap-2">
             <Button onClick={handleSave} disabled={createFaq.isPending || updateFaq.isPending}>
               {(createFaq.isPending || updateFaq.isPending) ? (
                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
               ) : (
                 <Save className="h-4 w-4 mr-2" />
               )}
               Ruaj
             </Button>
             {selectedId && (
               <Button variant="destructive" onClick={handleDelete} disabled={deleteFaq.isPending}>
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