import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "../ImageUpload";
import { PageSection } from "@/hooks/useCms";
import { Plus, Trash2 } from "lucide-react";

interface TestimonialItem {
  name: string;
  logo: string;
}

interface TestimonialsSectionEditorProps {
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
}

export function TestimonialsSectionEditor({ form, setForm }: TestimonialsSectionEditorProps) {
  const testimonials = (form.items || []) as TestimonialItem[];

  const updateTestimonial = (index: number, field: keyof TestimonialItem, value: string) => {
    const updated = [...testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, items: updated });
  };

  const addTestimonial = () => {
    setForm({
      ...form,
      items: [...testimonials, { name: "", logo: "" }],
    });
  };

  const removeTestimonial = (index: number) => {
    setForm({
      ...form,
      items: testimonials.filter((_, i) => i !== index),
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
            placeholder="p.sh. PARTNERËT TANË"
          />
        </div>
        <div className="space-y-2">
          <Label>Titulli kryesor</Label>
          <Input
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="p.sh. Bizneset që na besojnë"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Bizneset/Partnerët ({testimonials.length})</Label>
          <Button type="button" variant="outline" size="sm" onClick={addTestimonial}>
            <Plus className="w-4 h-4 mr-2" />
            Shto biznes
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="pt-4 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-muted-foreground">
                    Biznesi #{index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTestimonial(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Emri i biznesit</Label>
                  <Input
                    value={testimonial.name}
                    onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                    placeholder="p.sh. Hotel Melia"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Logo</Label>
                  <ImageUpload
                    value={testimonial.logo || null}
                    onChange={(v) => updateTestimonial(index, "logo", v || "")}
                    folder="partners"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
