mport { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageSection } from "@/hooks/useCms";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  GripVertical,
  Plus,
  Trash2,
  X,
  Loader2,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface HeroSlide {
  id: string;
  image_url: string;
  title?: string;
  content?: string;
  button_text?: string;
  button_url?: string;
}

interface HeroHomepageSectionEditorProps {
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
}

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function SlideImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Gabim", description: "Zgjidhni një imazh", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Gabim", description: "Imazhi max 5MB", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const name = `hero/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("cms-uploads").upload(name, file);
      if (error) throw error;
      const { data } = supabase.storage.from("cms-uploads").getPublicUrl(name);
      onChange(data.publicUrl);
      toast({ title: "Sukses", description: "Imazhi u ngarkua" });
    } catch (err: any) {
      toast({ title: "Gabim", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="relative w-full h-28 rounded-md overflow-hidden border border-border">
          <img src={value} alt="slide" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center hover:opacity-90"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-border rounded-md p-3 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-1">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Duke ngarkuar...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Kliko për të ngarkuar imazhin</span>
            </div>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        disabled={uploading}
      />
    </div>
  );
}

function SlideEditor({
  slide,
  index,
  onUpdate,
  onRemove,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: {
  slide: HeroSlide;
  index: number;
  onUpdate: (field: keyof HeroSlide, value: string) => void;
  onRemove: () => void;
  isDragOver: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`rounded-md border transition-colors ${
        isDragOver ? "border-primary bg-primary/5" : "border-border bg-muted/30"
      }`}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 p-3">
        <div className="cursor-grab active:cursor-grabbing text-muted-foreground">
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="flex-none w-5 h-5 rounded-full bg-muted text-muted-foreground text-xs flex items-center justify-center font-medium">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <SlideImageUploader
            value={slide.image_url}
            onChange={(url) => onUpdate("image_url", url)}
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label={expanded ? "Mbyll" : "Edito tekstin"}
            title={expanded ? "Mbyll" : "Edito titullin dhe tekstin e slide-it"}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive transition-colors p-1"
            aria-label="Fshi slide"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded text fields */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-border/50 mt-0 pt-3 space-y-3">
          <p className="text-xs text-muted-foreground">
            Lini bosh për të përdorur vlerat globale të seksionit.
          </p>
          <div className="space-y-1.5">
            <Label className="text-xs">Titulli (opsional)</Label>
            <Input
              value={slide.title || ""}
              onChange={(e) => onUpdate("title", e.target.value)}
              placeholder="Titull specifik për këtë slide…"
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Përshkrimi (opsional)</Label>
            <Textarea
              value={slide.content || ""}
              onChange={(e) => onUpdate("content", e.target.value)}
              placeholder="Tekst përshkrues specifik për këtë slide…"
              rows={2}
              className="text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Teksti i butonit (opsional)</Label>
              <Input
                value={slide.button_text || ""}
                onChange={(e) => onUpdate("button_text", e.target.value)}
                placeholder="Kërko ofertë"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">URL e butonit (opsional)</Label>
              <Input
                value={slide.button_url || ""}
                onChange={(e) => onUpdate("button_url", e.target.value)}
                placeholder="#contact"
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function HeroHomepageSectionEditor({ form, setForm }: HeroHomepageSectionEditorProps) {
  const slides: HeroSlide[] =
    Array.isArray(form.items) && form.items.length > 0 ? (form.items as HeroSlide[]) : [];

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const updateSlides = (newSlides: HeroSlide[]) => {
    setForm({ ...form, items: newSlides as any });
  };

  const addSlide = () => {
    if (slides.length >= 5) {
      toast({ title: "Maksimumi", description: "Deri në 5 slides", variant: "destructive" });
      return;
    }
    updateSlides([...slides, { id: generateId(), image_url: "" }]);
  };

  const removeSlide = (idx: number) => updateSlides(slides.filter((_, i) => i !== idx));

  const updateSlideField = (idx: number, field: keyof HeroSlide, value: string) =>
    updateSlides(slides.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));

  const handleDragStart = (idx: number) => setDragIndex(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOver(idx);
  };
  const handleDrop = (idx: number) => {
    if (dragIndex === null || dragIndex === idx) {
      setDragIndex(null);
      setDragOver(null);
      return;
    }
    const next = [...slides];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(idx, 0, moved);
    updateSlides(next);
    setDragIndex(null);
    setDragOver(null);
  };

  return (
    <div className="space-y-6">
      {/* Global text fields */}
      <div className="space-y-2">
        <Label>Titulli kryesor (global)</Label>
        <Input
          value={form.title || ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Tekstile Premium për Hotele, Restorante & Airbnb"
        />
      </div>

      <div className="space-y-2">
        <Label>Teksti përshkrues (global)</Label>
        <Textarea
          value={form.content || ""}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="EMA Hotelling është furnitor i specializuar..."
          rows={3}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Teksti i butonit (global)</Label>
          <Input
            value={form.button_text || ""}
            onChange={(e) => setForm({ ...form, button_text: e.target.value })}
            placeholder="Kërko ofertë"
          />
        </div>
        <div className="space-y-2">
          <Label>URL e butonit (global)</Label>
          <Input
            value={form.button_url || ""}
            onChange={(e) => setForm({ ...form, button_url: e.target.value })}
            placeholder="#contact ose /kontakt"
          />
        </div>
      </div>

      {/* Slides */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <Label className="text-base font-medium">Slides (imazhet e carousel-it)</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Deri në 5 imazhe. Tërhiqni për të rirenditur. Klikoni shigjetën ↓ për të edituar tekstin e çdo slide-i.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addSlide}
            disabled={slides.length >= 5}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Shto Slide
          </Button>
        </div>

        {slides.length === 0 && (
          <div className="border-2 border-dashed border-border rounded-md p-8 text-center text-muted-foreground text-sm">
            Nuk ka slides. Klikoni "Shto Slide" për të filluar.
          </div>
        )}

        <div className="space-y-3">
          {slides.map((slide, idx) => (
            <SlideEditor
              key={slide.id}
              slide={slide}
              index={idx}
              onUpdate={(field, value) => updateSlideField(idx, field, value)}
              onRemove={() => removeSlide(idx)}
              isDragOver={dragOver === idx}
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
              onDragEnd={() => { setDragIndex(null); setDragOver(null); }}
            />
          ))}
        </div>

        {slides.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">{slides.length}/5 slides</p>
        )}
      </div>
    </div>
  );
}
