 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import { ImageUpload } from "../ImageUpload";
 import { PageSection } from "@/hooks/useCms";
 
 interface HeroSectionEditorProps {
   form: Partial<PageSection>;
   setForm: (form: Partial<PageSection>) => void;
 }
 
 export function HeroSectionEditor({ form, setForm }: HeroSectionEditorProps) {
   return (
     <div className="space-y-6">
       <div className="space-y-2">
         <Label>Titulli kryesor</Label>
         <Input
           value={form.title || ""}
           onChange={(e) => setForm({ ...form, title: e.target.value })}
           placeholder="Tekstile Premium për Industrinë e Mikpritjes"
         />
       </div>
 
       <div className="space-y-2">
         <Label>Përshkrimi (nëntitulli)</Label>
         <Textarea
           value={form.content || ""}
           onChange={(e) => setForm({ ...form, content: e.target.value })}
           placeholder="EMA Hotelling është furnitor i specializuar..."
           rows={3}
         />
       </div>
 
        <div className="space-y-2">
          <Label>Imazhi i sfondit</Label>
          <ImageUpload
            value={form.image_url ?? null}
            onChange={(v) => setForm({ ...form, image_url: v })}
            folder="hero"
          />
          {form.image_url && (
            <p className="text-xs text-muted-foreground">
              Imazhi aktual: Klikoni X për të fshirë, ose ngarkoni një imazh të ri për ta zëvendësuar.
            </p>
          )}
        </div>
 
       <div className="grid md:grid-cols-2 gap-4">
         <div className="space-y-2">
           <Label>Teksti i butonit primar</Label>
           <Input
             value={form.button_text || ""}
             onChange={(e) => setForm({ ...form, button_text: e.target.value })}
             placeholder="Kërko ofertë"
           />
         </div>
         <div className="space-y-2">
           <Label>URL e butonit</Label>
           <Input
             value={form.button_url || ""}
             onChange={(e) => setForm({ ...form, button_url: e.target.value })}
             placeholder="#contact"
           />
         </div>
       </div>
     </div>
   );
 }