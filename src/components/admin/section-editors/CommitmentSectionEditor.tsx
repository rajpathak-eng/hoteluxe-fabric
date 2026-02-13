import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { PageSection } from "@/hooks/useCms";

interface CommitmentSectionEditorProps {
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
}

interface CommitmentItem {
  title: string;
  description: string;
}

export function CommitmentSectionEditor({ form, setForm }: CommitmentSectionEditorProps) {
  const items: CommitmentItem[] = Array.isArray(form.items) ? form.items : [
    { title: "Cilësi premium", description: "Produkte të klasit të parë për hotele me standarde të larta" },
    { title: "Shërbim i personalizuar", description: "Zgjidhje të përshtatura për nevojat unike të biznesit tuaj" },
    { title: "Partner i besueshëm", description: "Mbi 15 vite përvojë në industrinë e hotelierisë" },
  ];

  const updateItem = (index: number, field: keyof CommitmentItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, items: updated });
  };

  const addItem = () => {
    setForm({ ...form, items: [...items, { title: "", description: "" }] });
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
            placeholder="Përkushtimi ynë"
          />
        </div>
        <div className="space-y-2">
          <Label>Titulli</Label>
          <Input
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Përkushtimi ynë ndaj mysafirëve tuaj"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Përshkrimi</Label>
        <Textarea
          value={form.content || ""}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Teksti kryesor i seksionit..."
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Kartat (pikat kryesore)</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" /> Shto
          </Button>
        </div>

        {items.map((item, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Karta {String(index + 1).padStart(2, "0")}
              </span>
              {items.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Label>Titulli</Label>
              <Input
                value={item.title}
                onChange={(e) => updateItem(index, "title", e.target.value)}
                placeholder="p.sh. Cilësi premium"
              />
            </div>
            <div className="space-y-2">
              <Label>Përshkrimi</Label>
              <Textarea
                value={item.description}
                onChange={(e) => updateItem(index, "description", e.target.value)}
                placeholder="Përshkrimi i shkurtër..."
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
