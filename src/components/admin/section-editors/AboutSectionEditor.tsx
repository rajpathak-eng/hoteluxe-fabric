import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "../ImageUpload";
import { RichTextEditor } from "../RichTextEditor";
import { PageSection } from "@/hooks/useCms";

interface AboutSectionEditorProps {
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
}

export function AboutSectionEditor({ form, setForm }: AboutSectionEditorProps) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nëntitulli</Label>
          <Input
            value={form.subtitle || ""}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            placeholder="Rreth nesh"
          />
        </div>
        <div className="space-y-2">
          <Label>Titulli</Label>
          <Input
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Kush jemi ne?"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Përmbajtja (Rich Text)</Label>
        <RichTextEditor
          content={form.content || ""}
          onChange={(v) => setForm({ ...form, content: v })}
        />
      </div>

      <div className="space-y-2">
        <Label>Imazhi</Label>
        <ImageUpload
          value={form.image_url ?? null}
          onChange={(v) => setForm({ ...form, image_url: v })}
          folder="about"
        />
        {form.image_url && (
          <div className="mt-2 p-2 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Preview:</p>
            <img 
              src={form.image_url} 
              alt="Preview" 
              className="max-h-40 object-contain rounded"
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
            placeholder="Mëso më shumë"
          />
        </div>
        <div className="space-y-2">
          <Label>URL e butonit</Label>
          <Input
            value={form.button_url || ""}
            onChange={(e) => setForm({ ...form, button_url: e.target.value })}
            placeholder="/rreth-nesh"
          />
        </div>
      </div>
    </div>
  );
}
