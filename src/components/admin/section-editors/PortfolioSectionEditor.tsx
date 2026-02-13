import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "../ImageUpload";
import { PageSection } from "@/hooks/useCms";

interface PortfolioSectionEditorProps {
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
}

export function PortfolioSectionEditor({ form, setForm }: PortfolioSectionEditorProps) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nëntitulli</Label>
          <Input
            value={form.subtitle || ""}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            placeholder="Projektet tona"
          />
        </div>
        <div className="space-y-2">
          <Label>Titulli</Label>
          <Input
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Projektet e Realizuara"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Përshkrimi</Label>
        <Textarea
          value={form.content || ""}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={3}
          placeholder="Përshkrimi i seksionit të projekteve..."
        />
      </div>

      <div className="space-y-2">
        <Label>Imazhi i Sfondit (opsional)</Label>
        <ImageUpload
          value={form.image_url ?? null}
          onChange={(v) => setForm({ ...form, image_url: v })}
          folder="portfolio"
        />
        {form.image_url && (
          <div className="mt-2 p-2 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Preview:</p>
            <img 
              src={form.image_url} 
              alt="Preview" 
              className="max-h-32 object-contain rounded"
            />
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Teksti i butonit</Label>
          <Input
            value={form.button_text || ""}
            onChange={(e) => setForm({ ...form, button_text: e.target.value })}
            placeholder="Shiko të gjitha projektet"
          />
        </div>
        <div className="space-y-2">
          <Label>URL e butonit</Label>
          <Input
            value={form.button_url || ""}
            onChange={(e) => setForm({ ...form, button_url: e.target.value })}
            placeholder="/projektet"
          />
        </div>
      </div>

      <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
        <p className="text-sm text-muted-foreground">
          <strong>Shënim:</strong> Projektet individuale menaxhohen nga tab-i "Projekte". 
          Ky seksion kontrollon vetëm titullin dhe përshkrimin e seksionit në faqen kryesore.
        </p>
      </div>
    </div>
  );
}
