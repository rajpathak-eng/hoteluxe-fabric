import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "../ImageUpload";
import { Plus, Trash2 } from "lucide-react";
import { PageSection } from "@/hooks/useCms";

interface AboutIndustriesSectionEditorProps {
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
}

interface IndustryItem {
  title: string;
  description: string;
  image: string;
  href: string;
}

export function AboutIndustriesSectionEditor({ form, setForm }: AboutIndustriesSectionEditorProps) {
  const items: IndustryItem[] = Array.isArray(form.items) ? form.items : [];

  const updateItem = (index: number, field: keyof IndustryItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, items: updated });
  };

  const addItem = () => {
    setForm({ ...form, items: [...items, { title: "", description: "", image: "", href: "" }] });
  };

  const removeItem = (index: number) => {
    setForm({ ...form, items: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nëntitulli</Label>
          <Input
            value={form.subtitle || ""}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            placeholder="Sektorët"
          />
        </div>
        <div className="space-y-2">
          <Label>Titulli</Label>
          <Input
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Industritë ku operojmë"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Përshkrimi</Label>
        <Input
          value={form.content || ""}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Teksti përshkrues..."
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Industritë</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" /> Shto industri
          </Button>
        </div>

        {items.map((item, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Industria {index + 1}</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Titulli</Label>
                <Input
                  value={item.title}
                  onChange={(e) => updateItem(index, "title", e.target.value)}
                  placeholder="p.sh. Tekstile për hotele"
                />
              </div>
              <div className="space-y-2">
                <Label>Linku</Label>
                <Input
                  value={item.href}
                  onChange={(e) => updateItem(index, "href", e.target.value)}
                  placeholder="/sherbimet/tekstile-per-hotele"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Përshkrimi</Label>
              <Textarea
                value={item.description}
                onChange={(e) => updateItem(index, "description", e.target.value)}
                placeholder="Përshkrim i shkurtër..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Imazhi</Label>
              <ImageUpload
                value={item.image || null}
                onChange={(v) => updateItem(index, "image", v || "")}
                folder="industries"
              />
              {item.image && (
                <img src={item.image} alt={item.title} className="max-h-24 object-contain rounded mt-1" />
              )}
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">
            Asnjë industri nuk është shtuar. Klikoni "Shto industri" për të filluar.
          </p>
        )}
      </div>
    </div>
  );
}
