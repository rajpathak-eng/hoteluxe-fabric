 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent } from "@/components/ui/card";
 import { Trash2, Plus } from "lucide-react";
 import { PageSection } from "@/hooks/useCms";
 
 interface StatItem {
   value: number;
   suffix: string;
   label: string;
 }
 
 interface TrustSectionEditorProps {
   form: Partial<PageSection>;
   setForm: (form: Partial<PageSection>) => void;
 }
 
 export function TrustSectionEditor({ form, setForm }: TrustSectionEditorProps) {
   const items: StatItem[] = (form.items as StatItem[]) || [];
 
   const updateItem = (index: number, field: keyof StatItem, value: string | number) => {
     const newItems = [...items];
     newItems[index] = { ...newItems[index], [field]: value };
     setForm({ ...form, items: newItems });
   };
 
   const addItem = () => {
     setForm({
       ...form,
       items: [...items, { value: 0, suffix: "+", label: "" }],
     });
   };
 
   const removeItem = (index: number) => {
     setForm({
       ...form,
       items: items.filter((_, i) => i !== index),
     });
   };
 
   return (
     <div className="space-y-6">
       <div className="grid md:grid-cols-2 gap-4">
         <div className="space-y-2">
           <Label>Nëntitulli</Label>
           <Input
             value={form.subtitle || ""}
             onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
             placeholder="Numrat flasin"
           />
         </div>
         <div className="space-y-2">
           <Label>Titulli</Label>
           <Input
             value={form.title || ""}
             onChange={(e) => setForm({ ...form, title: e.target.value })}
             placeholder="Besueshmëri e provuar"
           />
         </div>
       </div>
 
       <div className="space-y-2">
         <Label>Përshkrimi</Label>
         <Textarea
           value={form.content || ""}
           onChange={(e) => setForm({ ...form, content: e.target.value })}
           rows={2}
         />
       </div>
 
       <div className="space-y-4">
         <div className="flex items-center justify-between">
           <Label className="text-base font-semibold">Statistikat</Label>
           <Button type="button" variant="outline" size="sm" onClick={addItem}>
             <Plus className="w-4 h-4 mr-1" /> Shto statistikë
           </Button>
         </div>
 
         <div className="grid md:grid-cols-2 gap-3">
           {items.map((item, index) => (
             <Card key={index} className="border-border/50">
               <CardContent className="p-4">
                 <div className="flex items-start gap-3">
                   <div className="flex-1 space-y-3">
                     <div className="grid grid-cols-3 gap-2">
                       <div className="space-y-1">
                         <Label className="text-xs">Vlera</Label>
                         <Input
                           type="number"
                           value={item.value}
                           onChange={(e) => updateItem(index, "value", parseInt(e.target.value) || 0)}
                           className="h-9"
                         />
                       </div>
                       <div className="space-y-1">
                         <Label className="text-xs">Prapashtesa</Label>
                         <Input
                           value={item.suffix}
                           onChange={(e) => updateItem(index, "suffix", e.target.value)}
                           className="h-9"
                           placeholder="+, %, K"
                         />
                       </div>
                       <div className="space-y-1">
                         <Label className="text-xs">Etiketë</Label>
                         <Input
                           value={item.label}
                           onChange={(e) => updateItem(index, "label", e.target.value)}
                           className="h-9"
                         />
                       </div>
                     </div>
                   </div>
                   <Button
                     type="button"
                     variant="ghost"
                     size="icon"
                     className="text-destructive"
                     onClick={() => removeItem(index)}
                   >
                     <Trash2 className="w-4 h-4" />
                   </Button>
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
       </div>
     </div>
   );
 }