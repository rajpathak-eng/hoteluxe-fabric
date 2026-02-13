 import { useState } from "react";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent } from "@/components/ui/card";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Trash2, Plus, GripVertical } from "lucide-react";
 import { PageSection } from "@/hooks/useCms";
 
 interface DifferentiatorItem {
   icon: string;
   title: string;
   description: string;
 }
 
 const availableIcons = [
   { value: "Award", label: "Award (Çmim)" },
   { value: "Wallet", label: "Wallet (Portofol)" },
   { value: "Sparkles", label: "Sparkles (Yje)" },
   { value: "Clock", label: "Clock (Orë)" },
   { value: "Shield", label: "Shield (Mbrojtje)" },
   { value: "Heart", label: "Heart (Zemër)" },
   { value: "Star", label: "Star (Yll)" },
   { value: "Users", label: "Users (Përdorues)" },
   { value: "Truck", label: "Truck (Transport)" },
   { value: "CheckCircle", label: "CheckCircle (Tikuar)" },
 ];
 
 interface DifferentiatorsSectionEditorProps {
   form: Partial<PageSection>;
   setForm: (form: Partial<PageSection>) => void;
 }
 
 export function DifferentiatorsSectionEditor({ form, setForm }: DifferentiatorsSectionEditorProps) {
   const items: DifferentiatorItem[] = (form.items as DifferentiatorItem[]) || [];
 
   const updateItem = (index: number, field: keyof DifferentiatorItem, value: string) => {
     const newItems = [...items];
     newItems[index] = { ...newItems[index], [field]: value };
     setForm({ ...form, items: newItems });
   };
 
   const addItem = () => {
     setForm({
       ...form,
       items: [...items, { icon: "Award", title: "", description: "" }],
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
             placeholder="Pse ne"
           />
         </div>
         <div className="space-y-2">
           <Label>Titulli</Label>
           <Input
             value={form.title || ""}
             onChange={(e) => setForm({ ...form, title: e.target.value })}
             placeholder="Pse të zgjidhni ne?"
           />
         </div>
       </div>
 
       <div className="space-y-4">
         <div className="flex items-center justify-between">
           <Label className="text-base font-semibold">Kartat e diferencuesve</Label>
           <Button type="button" variant="outline" size="sm" onClick={addItem}>
             <Plus className="w-4 h-4 mr-1" /> Shto kartë
           </Button>
         </div>
 
         <div className="space-y-3">
           {items.map((item, index) => (
             <Card key={index} className="border-border/50">
               <CardContent className="p-4">
                 <div className="flex items-start gap-3">
                   <GripVertical className="w-5 h-5 text-muted-foreground mt-2 cursor-grab" />
                   <div className="flex-1 space-y-3">
                     <div className="grid grid-cols-2 gap-3">
                       <div className="space-y-1">
                         <Label className="text-xs">Ikona</Label>
                         <Select value={item.icon} onValueChange={(v) => updateItem(index, "icon", v)}>
                           <SelectTrigger className="h-9">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             {availableIcons.map((icon) => (
                               <SelectItem key={icon.value} value={icon.value}>
                                 {icon.label}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </div>
                       <div className="space-y-1">
                         <Label className="text-xs">Titulli</Label>
                         <Input
                           value={item.title}
                           onChange={(e) => updateItem(index, "title", e.target.value)}
                           className="h-9"
                         />
                       </div>
                     </div>
                     <div className="space-y-1">
                       <Label className="text-xs">Përshkrimi</Label>
                       <Input
                         value={item.description}
                         onChange={(e) => updateItem(index, "description", e.target.value)}
                       />
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