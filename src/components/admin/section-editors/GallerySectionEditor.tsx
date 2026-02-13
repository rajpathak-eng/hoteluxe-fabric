import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiImageUpload } from "../MultiImageUpload";
import { PageSection } from "@/hooks/useCms";

interface GallerySectionEditorProps {
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
}

export function GallerySectionEditor({ form, setForm }: GallerySectionEditorProps) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nëntitulli</Label>
          <Input
            value={form.subtitle || ""}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            placeholder="p.sh. GALERIA"
          />
        </div>
        <div className="space-y-2">
          <Label>Titulli kryesor</Label>
          <Input
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="p.sh. Shembuj të punës sonë"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Imazhet e galerisë</Label>
        <MultiImageUpload
          value={form.gallery || []}
          onChange={(v) => setForm({ ...form, gallery: v })}
          folder="gallery"
          maxImages={20}
        />
      </div>
    </div>
  );
}
