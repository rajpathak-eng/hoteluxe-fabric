import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "../ImageUpload";
import { PageSection } from "@/hooks/useCms";
import { Plus, Trash2 } from "lucide-react";

interface ServiceItem {
  title: string;
  description: string;
  image: string;
}

interface ServicesSectionEditorProps {
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
}

export function ServicesSectionEditor({ form, setForm }: ServicesSectionEditorProps) {
  const services = (form.items || []) as ServiceItem[];

  const updateService = (index: number, field: keyof ServiceItem, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, items: updated });
  };

  const addService = () => {
    setForm({
      ...form,
      items: [...services, { title: "", description: "", image: "" }],
    });
  };

  const removeService = (index: number) => {
    setForm({
      ...form,
      items: services.filter((_, i) => i !== index),
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
            placeholder="p.sh. SHËRBIMET TONA"
          />
        </div>
        <div className="space-y-2">
          <Label>Titulli kryesor</Label>
          <Input
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="p.sh. Çfarë ofrojmë për biznesin tuaj"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Shërbimet ({services.length})</Label>
          <Button type="button" variant="outline" size="sm" onClick={addService}>
            <Plus className="w-4 h-4 mr-2" />
            Shto shërbim
          </Button>
        </div>

        {services.map((service, index) => (
          <Card key={index}>
            <CardContent className="pt-4 space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-muted-foreground">
                  Shërbimi #{index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeService(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Titulli</Label>
                <Input
                  value={service.title}
                  onChange={(e) => updateService(index, "title", e.target.value)}
                  placeholder="p.sh. Çarçafë me logo"
                />
              </div>

              <div className="space-y-2">
                <Label>Përshkrimi</Label>
                <Input
                  value={service.description}
                  onChange={(e) => updateService(index, "description", e.target.value)}
                  placeholder="p.sh. Çarçafë dhe mbulesa krevati me logon tuaj"
                />
              </div>

              <div className="space-y-2">
                <Label>Imazhi</Label>
                <ImageUpload
                  value={service.image || null}
                  onChange={(v) => updateService(index, "image", v || "")}
                  folder="pages"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
