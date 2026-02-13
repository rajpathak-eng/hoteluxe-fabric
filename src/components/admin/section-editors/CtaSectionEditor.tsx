import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "../ImageUpload";
import { PageSection } from "@/hooks/useCms";

interface CtaSectionEditorProps {
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
}

export function CtaSectionEditor({ form, setForm }: CtaSectionEditorProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Titulli</Label>
        <Input
          value={form.title || ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Gati të filloni?"
        />
      </div>

      <div className="space-y-2">
        <Label>Përshkrimi</Label>
        <Textarea
          value={form.content || ""}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={2}
          placeholder="Teksti i thirrjes për veprim..."
        />
      </div>

      <div className="space-y-2">
        <Label>Imazhi i Sfondit</Label>
        <ImageUpload
          value={form.image_url ?? null}
          onChange={(v) => setForm({ ...form, image_url: v })}
          folder="cta"
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
          <Label>Teksti i butonit primar</Label>
          <Input
            value={form.button_text || ""}
            onChange={(e) => setForm({ ...form, button_text: e.target.value })}
            placeholder="Kërko Ofertë"
          />
        </div>
        <div className="space-y-2">
          <Label>URL e butonit</Label>
          <Input
            value={form.button_url || ""}
            onChange={(e) => setForm({ ...form, button_url: e.target.value })}
            placeholder="/kerko-oferte"
          />
        </div>
      </div>
    </div>
  );
}
