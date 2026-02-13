import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "../ImageUpload";
import { PageSection } from "@/hooks/useCms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

interface ContactSectionEditorProps {
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
}

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  working_hours?: string;
}

export function ContactSectionEditor({ form, setForm }: ContactSectionEditorProps) {
  // Parse contact info from items or use defaults
  const rawItems = form.items;
  const defaultContactInfo: ContactInfo = {
    phone: "+355 69 XXX XXXX",
    email: "info@emahotelling.al",
    address: "Tiranë, Shqipëri",
    working_hours: "",
  };
  
  const contactInfo: ContactInfo = (rawItems && !Array.isArray(rawItems)) 
    ? (rawItems as unknown as ContactInfo) 
    : defaultContactInfo;

  const updateContactInfo = (field: keyof ContactInfo, value: string) => {
    const updatedInfo = {
      ...contactInfo,
      [field]: value,
    };
    setForm({
      ...form,
      items: updatedInfo as unknown as any[],
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
            placeholder="Na kontaktoni"
          />
        </div>
        <div className="space-y-2">
          <Label>Titulli</Label>
          <Input
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Kërko Ofertë Personalizuar"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Përshkrimi</Label>
        <Textarea
          value={form.content || ""}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={3}
          placeholder="Përshkrimi i seksionit të kontaktit..."
        />
      </div>

      {/* Contact Information Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Të Dhënat e Kontaktit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Numri i Telefonit
              </Label>
              <Input
                value={contactInfo.phone}
                onChange={(e) => updateContactInfo("phone", e.target.value)}
                placeholder="+355 69 XXX XXXX"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <Input
                type="email"
                value={contactInfo.email}
                onChange={(e) => updateContactInfo("email", e.target.value)}
                placeholder="info@emahotelling.al"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Adresa Fizike
            </Label>
            <Input
              value={contactInfo.address}
              onChange={(e) => updateContactInfo("address", e.target.value)}
              placeholder="Tiranë, Shqipëri"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Orari i Punës (opsional)
            </Label>
            <Input
              value={contactInfo.working_hours || ""}
              onChange={(e) => updateContactInfo("working_hours", e.target.value)}
              placeholder="E Hënë - E Premte: 08:00 - 17:00"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label>Imazhi i Sfondit (opsional)</Label>
        <ImageUpload
          value={form.image_url ?? null}
          onChange={(v) => setForm({ ...form, image_url: v })}
          folder="contact"
        />
        {form.image_url && (
          <div className="mt-2 p-2 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Preview:</p>
            <img 
              src={form.image_url} 
              alt="Preview" 
              className="max-h-32 object-contain rounded"
            />
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Teksti i butonit</Label>
          <Input
            value={form.button_text || ""}
            onChange={(e) => setForm({ ...form, button_text: e.target.value })}
            placeholder="Dërgo Mesazh"
          />
        </div>
        <div className="space-y-2">
          <Label>URL e butonit</Label>
          <Input
            value={form.button_url || ""}
            onChange={(e) => setForm({ ...form, button_url: e.target.value })}
            placeholder="/kontakt"
          />
        </div>
      </div>
    </div>
  );
}
