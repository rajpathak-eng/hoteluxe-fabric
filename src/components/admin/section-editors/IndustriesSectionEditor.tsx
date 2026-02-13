import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { PageSection } from "@/hooks/useCms";
import { ImageUpload } from "../ImageUpload";

interface IndustryItem {
  title: string;
  description: string;
  href: string;
  image: string;
}

interface IndustriesSectionEditorProps {
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
}

export function IndustriesSectionEditor({ form, setForm }: IndustriesSectionEditorProps) {
  const items: IndustryItem[] = (form.items as IndustryItem[]) || [];

  const updateItem = (index: number, field: keyof IndustryItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setForm({ ...form, items: newItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...items, { title: "", description: "", href: "", image: "" }],
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
            placeholder="Industritë që shërbejmë"
          />
        </div>
        <div className="space-y-2">
          <Label>Titulli</Label>
          <Input
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Zgjidhje për çdo sektor"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Përshkrimi</Label>
        <Textarea
          value={form.content || ""}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={2}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Industritë</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" /> Shto industri
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
                        <Label className="text-xs">Titulli</Label>
                        <Input
                          value={item.title}
                          onChange={(e) => updateItem(index, "title", e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">URL</Label>
                        <Input
                          value={item.href}
                          onChange={(e) => updateItem(index, "href", e.target.value)}
                          className="h-9"
                          placeholder="/sherbimet/tekstile-per-..."
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
                    <div className="space-y-1">
                      <Label className="text-xs">Imazhi</Label>
                      <ImageUpload
                        value={item.image || null}
                        onChange={(v) => updateItem(index, "image", v || "")}
                        folder="industries"
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