import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "../ImageUpload";
import { Plus, Trash2 } from "lucide-react";
import { PageSection } from "@/hooks/useCms";

interface AboutProductsSectionEditorProps {
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
}

interface ProductGridItem {
  image: string;
  label: string;
  alt: string;
  slug: string;
  href: string;
}

export function AboutProductsSectionEditor({ form, setForm }: AboutProductsSectionEditorProps) {
  const items: ProductGridItem[] = Array.isArray(form.items) ? form.items : [];

  const updateItem = (index: number, field: keyof ProductGridItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, items: updated });
  };

  const addItem = () => {
    setForm({ ...form, items: [...items, { image: "", label: "", alt: "", slug: "", href: "" }] });
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
            placeholder="Çfarë ofrojmë"
          />
        </div>
        <div className="space-y-2">
          <Label>Titulli</Label>
          <Input
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Produktet tona për hotele dhe Horeca"
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

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Teksti i butonit</Label>
          <Input
            value={form.button_text || ""}
            onChange={(e) => setForm({ ...form, button_text: e.target.value })}
            placeholder="Shiko të gjitha produktet"
          />
        </div>
        <div className="space-y-2">
          <Label>URL e butonit</Label>
          <Input
            value={form.button_url || ""}
            onChange={(e) => setForm({ ...form, button_url: e.target.value })}
            placeholder="/produktet"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Produktet (Grid imazhesh)</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" /> Shto produkt
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Produkti {index + 1}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Imazhi</Label>
                <ImageUpload
                  value={item.image || null}
                  onChange={(v) => updateItem(index, "image", v || "")}
                  folder="about-products"
                />
                {item.image && (
                  <img src={item.image} alt={item.alt || item.label} className="max-h-24 object-contain rounded mt-1" />
                )}
              </div>
              <div className="space-y-2">
                <Label>Emri</Label>
                <Input
                  value={item.label}
                  onChange={(e) => updateItem(index, "label", e.target.value)}
                  placeholder="p.sh. Çarçafë"
                />
              </div>
              <div className="space-y-2">
                <Label>Alt text</Label>
                <Input
                  value={item.alt}
                  onChange={(e) => updateItem(index, "alt", e.target.value)}
                  placeholder="p.sh. Çarçafë hotelerie"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug i kategorisë (për linkimin)</Label>
                <Input
                  value={item.slug || ""}
                  onChange={(e) => updateItem(index, "slug", e.target.value)}
                  placeholder="p.sh. carcafe"
                />
                <p className="text-xs text-muted-foreground">Slug-u i kategorisë ku do të çojë linku (p.sh. "carcafe" → /produktet/carcafe)</p>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">
            Asnjë produkt nuk është shtuar. Klikoni "Shto produkt" për të filluar.
          </p>
        )}
      </div>
    </div>
  );
}
