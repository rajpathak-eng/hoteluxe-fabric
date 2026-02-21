import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ImageUpload } from "../ImageUpload";
import { PageSection } from "@/hooks/useCms";

interface HeroSectionEditorProps {
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
}

function getHeroOverlaySettings(items: PageSection["items"]) {
  const obj = items && typeof items === "object" && !Array.isArray(items) ? (items as Record<string, unknown>) : {};
  return {
    overlay_enabled: obj.overlay_enabled !== false,
    overlay_opacity: typeof obj.overlay_opacity === "number" ? obj.overlay_opacity : 50,
  };
}

export function HeroSectionEditor({ form, setForm }: HeroSectionEditorProps) {
  const { overlay_enabled, overlay_opacity } = getHeroOverlaySettings(form.items);

  const setOverlay = (key: "overlay_enabled" | "overlay_opacity", value: boolean | number) => {
    const obj = (form.items && typeof form.items === "object" && !Array.isArray(form.items)
      ? { ...(form.items as Record<string, unknown>) }
      : {}) as Record<string, unknown>;
    obj[key] = value;
    setForm({ ...form, items: obj });
  };

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

        <div className="space-y-4 rounded-lg border border-border p-4">
          <Label className="text-base">Overlay (faqja Rreth nesh)</Label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Aktivizo overlay mbi imazhin</span>
            <Switch
              checked={overlay_enabled}
              onCheckedChange={(v) => setOverlay("overlay_enabled", v)}
            />
          </div>
          {overlay_enabled && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Opaciteti</span>
                <span>{overlay_opacity}%</span>
              </div>
              <Slider
                value={[overlay_opacity]}
                onValueChange={([v]) => setOverlay("overlay_opacity", v ?? 50)}
                min={0}
                max={100}
                step={5}
              />
            </div>
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