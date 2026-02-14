import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageSection } from "@/hooks/useCms";
import { Plus, Trash2 } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionEditorProps {
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
}

export function FaqSectionEditor({ form, setForm }: FaqSectionEditorProps) {
  const faqs = (form.items || []) as FaqItem[];

  const updateFaq = (index: number, field: keyof FaqItem, value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, items: updated });
  };

  const addFaq = () => {
    setForm({
      ...form,
      items: [...faqs, { question: "", answer: "" }],
    });
  };

  const removeFaq = (index: number) => {
    setForm({
      ...form,
      items: faqs.filter((_, i) => i !== index),
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
            placeholder="p.sh. FAQ"
          />
        </div>
        <div className="space-y-2">
          <Label>Titulli kryesor</Label>
          <Input
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="p.sh. Pyetjet më të shpeshta"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Teksti nën titull (intro)</Label>
        <Textarea
          value={form.content || ""}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="p.sh. Gjeni përgjigjet për pyetjet më të zakonshme..."
          rows={2}
          className="resize-none"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Pyetje & Përgjigje ({faqs.length})</Label>
          <Button type="button" variant="outline" size="sm" onClick={addFaq}>
            <Plus className="w-4 h-4 mr-2" />
            Shto pyetje
          </Button>
        </div>

        {faqs.map((faq, index) => (
          <Card key={index}>
            <CardContent className="pt-4 space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-muted-foreground">
                  Pyetja #{index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFaq(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Pyetja</Label>
                <Input
                  value={faq.question}
                  onChange={(e) => updateFaq(index, "question", e.target.value)}
                  placeholder="p.sh. Çfarë lloj tekstilesh personalizoni?"
                />
              </div>

              <div className="space-y-2">
                <Label>Përgjigja</Label>
                <Textarea
                  value={faq.answer}
                  onChange={(e) => updateFaq(index, "answer", e.target.value)}
                  placeholder="Shkruani përgjigjen..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
