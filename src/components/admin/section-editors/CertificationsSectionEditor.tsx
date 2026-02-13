import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "../ImageUpload";
import { PageSection } from "@/hooks/useCms";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface CertificationItem {
  name: string;
  image: string | null;
}

interface CertificationsSectionEditorProps {
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
}

export function CertificationsSectionEditor({ form, setForm }: CertificationsSectionEditorProps) {
  const items: CertificationItem[] = (form.items as CertificationItem[]) || [];

  const updateItem = (index: number, field: keyof CertificationItem, value: string | null) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setForm({ ...form, items: newItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...items, { name: "", image: null }],
    });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nëntitulli</Label>
          <Input
            value={form.subtitle || ""}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            placeholder="p.sh. Certifikime të besuara"
          />
        </div>
        <div className="space-y-2">
          <Label>Titulli</Label>
          <Input
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="p.sh. Certifikime & Partnerë"
          />
        </div>
      </div>

      {/* Certifications List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Logo Certifikimesh</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-2" />
            Shto Logo
          </Button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 items-start p-4 bg-muted/50 rounded-lg border"
            >
              <div className="flex-shrink-0 pt-2">
                <GripVertical className="w-5 h-5 text-muted-foreground" />
              </div>
              
              <div className="flex-1 grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Emri i Certifikimit</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    placeholder="p.sh. OEKO-TEX Standard 100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <ImageUpload
                    value={item.image}
                    onChange={(v) => updateItem(index, "image", v)}
                    folder="certifications"
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="flex-shrink-0 text-destructive hover:text-destructive"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              Nuk ka logo të shtuara. Kliko "Shto Logo" për të shtuar certifikimin e parë.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
