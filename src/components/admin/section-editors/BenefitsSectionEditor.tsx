import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageSection } from "@/hooks/useCms";
import { Plus, Trash2 } from "lucide-react";

interface BenefitItem {
  title: string;
  description: string;
  icon: string;
}

interface BenefitsSectionEditorProps {
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
}

export function BenefitsSectionEditor({ form, setForm }: BenefitsSectionEditorProps) {
  const benefits = (form.items || []) as BenefitItem[];

  const updateBenefit = (index: number, field: keyof BenefitItem, value: string) => {
    const updated = [...benefits];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, items: updated });
  };

  const addBenefit = () => {
    setForm({
      ...form,
      items: [...benefits, { title: "", description: "", icon: "CheckCircle" }],
    });
  };

  const removeBenefit = (index: number) => {
    setForm({
      ...form,
      items: benefits.filter((_, i) => i !== index),
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
            placeholder="p.sh. PSE NE?"
          />
        </div>
        <div className="space-y-2">
          <Label>Titulli kryesor</Label>
          <Input
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="p.sh. Pse të zgjidhni Ema Hotelling?"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Përfitimet ({benefits.length})</Label>
          <Button type="button" variant="outline" size="sm" onClick={addBenefit}>
            <Plus className="w-4 h-4 mr-2" />
            Shto përfitim
          </Button>
        </div>

        {benefits.map((benefit, index) => (
          <Card key={index}>
            <CardContent className="pt-4 space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-muted-foreground">
                  Përfitimi #{index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBenefit(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titulli</Label>
                  <Input
                    value={benefit.title}
                    onChange={(e) => updateBenefit(index, "title", e.target.value)}
                    placeholder="p.sh. Cilësi Premium"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ikona (Lucide)</Label>
                  <Input
                    value={benefit.icon}
                    onChange={(e) => updateBenefit(index, "icon", e.target.value)}
                    placeholder="p.sh. CheckCircle, Star, Shield"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Përshkrimi</Label>
                <Input
                  value={benefit.description}
                  onChange={(e) => updateBenefit(index, "description", e.target.value)}
                  placeholder="p.sh. Materiale premium dhe cilësi e garantuar"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
