import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "../ImageUpload";
import { RichTextEditor } from "../RichTextEditor";
import { PageSection } from "@/hooks/useCms";

interface HistorySectionEditorProps {
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
}

interface BadgeItem {
  number: string;
  label: string;
}

export function HistorySectionEditor({ form, setForm }: HistorySectionEditorProps) {
  const badge = (form.items as unknown as BadgeItem) || { number: "15+", label: "Vite përvojë" };

  const updateBadge = (field: keyof BadgeItem, value: string) => {
    const current = (form.items as unknown as BadgeItem) || { number: "15+", label: "Vite përvojë" };
    setForm({ ...form, items: { ...current, [field]: value } as any });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nëntitulli</Label>
          <Input
            value={form.subtitle || ""}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            placeholder="Historia jonë"
          />
        </div>
        <div className="space-y-2">
          <Label>Titulli</Label>
          <Input
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ekspertizë dhe përkushtim që nga 2010"
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
            <img src={form.image_url} alt="Preview" className="max-h-40 object-contain rounded" />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Badge (numri dekorativ)</Label>
        <p className="text-xs text-muted-foreground">Shfaqet si badge mbi imazhin (p.sh. "15+ Vite përvojë")</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Numri</Label>
            <Input
              value={badge.number || ""}
              onChange={(e) => updateBadge("number", e.target.value)}
              placeholder="15+"
            />
          </div>
          <div className="space-y-2">
            <Label>Etiketa</Label>
            <Input
              value={badge.label || ""}
              onChange={(e) => updateBadge("label", e.target.value)}
              placeholder="Vite përvojë"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
