import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, Type } from "lucide-react";
import { useTypographySettings, type TypographySettings, buildGoogleFontsUrl } from "@/hooks/useTypographySettings";
import { useUpdateSiteSetting } from "@/hooks/useSiteSettings";

const POPULAR_FONTS = [
  "Lexend Deca", "Playfair Display", "DM Sans", "Inter", "Roboto", "Open Sans", "Lato",
  "Montserrat", "Poppins", "Raleway", "Oswald", "Merriweather", "Lora",
  "Nunito", "Source Sans 3", "PT Sans", "Libre Baskerville", "Cormorant Garamond",
  "Crimson Text", "EB Garamond", "Josefin Sans", "Work Sans", "Rubik",
  "Bitter", "Archivo", "Manrope", "Plus Jakarta Sans", "Outfit", "Sora",
  "Space Grotesk", "IBM Plex Sans", "IBM Plex Serif", "Noto Sans", "Noto Serif",
];

const WEIGHT_OPTIONS = [
  { value: "400", label: "Regular (400)" },
  { value: "500", label: "Medium (500)" },
  { value: "600", label: "Semi-Bold (600)" },
  { value: "700", label: "Bold (700)" },
];

const SIZE_OPTIONS = [
  { value: "75", label: "75% – Shumë e vogël" },
  { value: "85", label: "85% – E vogël" },
  { value: "90", label: "90% – Pak më e vogël" },
  { value: "100", label: "100% – Normale" },
  { value: "110", label: "110% – Pak më e madhe" },
  { value: "120", label: "120% – E madhe" },
  { value: "130", label: "130% – Shumë e madhe" },
  { value: "150", label: "150% – Ekstra e madhe" },
];

const FALLBACK_OPTIONS = [
  { value: "serif", label: "Serif" },
  { value: "sans-serif", label: "Sans-serif" },
  { value: "monospace", label: "Monospace" },
  { value: "cursive", label: "Cursive" },
  { value: "system-ui", label: "System UI" },
];

export function TypographySettingsEditor() {
  const { data: settings, isLoading } = useTypographySettings();
  const updateSetting = useUpdateSiteSetting();
  const [form, setForm] = useState<TypographySettings>({
    primary_font: "Lexend Deca",
    primary_font_url: "",
    primary_weight: "600",
    secondary_font: "DM Sans",
    secondary_font_url: "",
    secondary_weight: "400",
    fallback_primary: "sans-serif",
    fallback_secondary: "sans-serif",
    heading_size: "100",
    body_size: "100",
  });

  // For live preview Google Fonts loading
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  useEffect(() => {
    const url = buildGoogleFontsUrl(form);
    setPreviewUrl(url);
  }, [form.primary_font, form.secondary_font, form.primary_font_url, form.secondary_font_url]);

  const handleSave = async () => {
    try {
      await updateSetting.mutateAsync({ key: "typography", value: form });
      toast({ title: "Sukses", description: "Tipografia u ruajt me sukses" });
    } catch (error: any) {
      toast({ title: "Gabim", description: error.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Load preview fonts */}
      {previewUrl && <link rel="stylesheet" href={previewUrl} />}
      {form.primary_font_url && <link rel="stylesheet" href={form.primary_font_url} />}
      {form.secondary_font_url && <link rel="stylesheet" href={form.secondary_font_url} />}

      {/* Primary Font */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Fonti Kryesor (Tituj & Butona)
          </CardTitle>
          <CardDescription>
            Përdoret për titujt, nën-titujt dhe butonat e faqes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Zgjidh fontin</Label>
              <Select value={form.primary_font} onValueChange={(v) => setForm({ ...form, primary_font: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {POPULAR_FONTS.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pesha e fontit</Label>
              <Select value={form.primary_weight} onValueChange={(v) => setForm({ ...form, primary_weight: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {WEIGHT_OPTIONS.map((w) => (
                    <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>URL e fontit personalizu (opsionale)</Label>
              <Input
                value={form.primary_font_url}
                onChange={(e) => setForm({ ...form, primary_font_url: e.target.value })}
                placeholder="https://fonts.googleapis.com/css2?family=..."
              />
            </div>
            <div className="space-y-2">
              <Label>Fonti fallback</Label>
              <Select value={form.fallback_primary} onValueChange={(v) => setForm({ ...form, fallback_primary: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FALLBACK_OPTIONS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Font */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Fonti Sekondar (Teksti i trupit)
          </CardTitle>
          <CardDescription>
            Përdoret për paragrafët, përshkrimet dhe tekstet e trupit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Zgjidh fontin</Label>
              <Select value={form.secondary_font} onValueChange={(v) => setForm({ ...form, secondary_font: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {POPULAR_FONTS.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pesha e fontit</Label>
              <Select value={form.secondary_weight} onValueChange={(v) => setForm({ ...form, secondary_weight: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {WEIGHT_OPTIONS.map((w) => (
                    <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>URL e fontit personalizu (opsionale)</Label>
              <Input
                value={form.secondary_font_url}
                onChange={(e) => setForm({ ...form, secondary_font_url: e.target.value })}
                placeholder="https://fonts.googleapis.com/css2?family=..."
              />
            </div>
            <div className="space-y-2">
              <Label>Fonti fallback</Label>
              <Select value={form.fallback_secondary} onValueChange={(v) => setForm({ ...form, fallback_secondary: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FALLBACK_OPTIONS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Font Sizes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Madhësia e shkrimit
          </CardTitle>
          <CardDescription>
            Kontrollo madhësinë e titujve dhe tekstit të trupit në të gjithë faqen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Madhësia e titujve</Label>
              <Select value={form.heading_size || "100"} onValueChange={(v) => setForm({ ...form, heading_size: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SIZE_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Madhësia e tekstit të trupit</Label>
              <Select value={form.body_size || "100"} onValueChange={(v) => setForm({ ...form, body_size: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SIZE_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Parashikim i drejtpërdrejtë</CardTitle>
          <CardDescription>Shiko se si duken fontet e zgjedhura</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 border border-border rounded-lg space-y-4 bg-background">
            <h1
              className="tracking-tight"
              style={{
                fontFamily: `'${form.primary_font}', ${form.fallback_primary}`,
                fontWeight: Number(form.primary_weight),
                fontSize: `${1.875 * Number(form.heading_size || "100") / 100}rem`,
              }}
            >
              Titull shembull me fontin kryesor
            </h1>
            <h2
              className="tracking-tight"
              style={{
                fontFamily: `'${form.primary_font}', ${form.fallback_primary}`,
                fontWeight: Number(form.primary_weight),
                fontSize: `${1.25 * Number(form.heading_size || "100") / 100}rem`,
              }}
            >
              Nën-titull me fontin kryesor
            </h2>
            <p
              className="leading-relaxed text-muted-foreground"
              style={{
                fontFamily: `'${form.secondary_font}', ${form.fallback_secondary}`,
                fontWeight: Number(form.secondary_weight),
                fontSize: `${1 * Number(form.body_size || "100") / 100}rem`,
              }}
            >
              Ky është një paragraf shembull me fontin sekondar. Tekstile premium për hotele dhe industrinë e mikpritjes.
              Cilësia dhe eleganca bashkohen për të krijuar një përvojë të jashtëzakonshme.
            </p>
            <button
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md"
              style={{
                fontFamily: `'${form.primary_font}', ${form.fallback_primary}`,
                fontWeight: Number(form.primary_weight),
              }}
            >
              Buton shembull
            </button>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={updateSetting.isPending} size="lg">
        {updateSetting.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        Ruaj Tipografinë
      </Button>
    </div>
  );
}
