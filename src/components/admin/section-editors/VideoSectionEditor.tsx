import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ImageUpload } from "../ImageUpload";
import { PageSection } from "@/hooks/useCms";

interface VideoSectionEditorProps {
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
}

interface VideoSettings {
  video_url: string;
  video_type: "upload" | "youtube" | "vimeo";
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  display_mode: "background" | "standalone";
  overlay_opacity: number;
}

export function VideoSectionEditor({ form, setForm }: VideoSectionEditorProps) {
  const items = Array.isArray(form.items) ? form.items : [];
  const settings: VideoSettings = {
    video_url: "",
    video_type: "upload",
    autoplay: true,
    loop: true,
    muted: true,
    display_mode: "background",
    overlay_opacity: 50,
    ...(items[0] as any),
  };

  const updateSettings = (updates: Partial<VideoSettings>) => {
    const newSettings = { ...settings, ...updates };
    setForm({ ...form, items: [newSettings] });
  };

  return (
    <div className="space-y-6">
      {/* Title/Subtitle/Content */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nëntitulli</Label>
          <Input
            value={form.subtitle || ""}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            placeholder="Nëntitull opsional"
          />
        </div>
        <div className="space-y-2">
          <Label>Titulli</Label>
          <Input
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Titulli i seksionit"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Përshkrimi (overlay tekst)</Label>
        <Input
          value={form.content || ""}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Teksti mbi video (opsionale)"
        />
      </div>

      {/* Video Type */}
      <div className="space-y-2">
        <Label>Lloji i videos</Label>
        <Select
          value={settings.video_type}
          onValueChange={(v) => updateSettings({ video_type: v as VideoSettings["video_type"], video_url: "" })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upload">Video e ngarkuar (MP4)</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="vimeo">Vimeo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Video URL/Upload */}
      <div className="space-y-2">
        <Label>
          {settings.video_type === "upload" ? "Video (MP4)" : settings.video_type === "youtube" ? "YouTube URL" : "Vimeo URL"}
        </Label>
        {settings.video_type === "upload" ? (
          <div className="space-y-3">
            <ImageUpload
              value={settings.video_url || null}
              onChange={(v) => updateSettings({ video_url: v || "" })}
              folder="videos"
            />
            {settings.video_url && (
              <video src={settings.video_url} className="max-h-40 rounded-lg" controls muted />
            )}
          </div>
        ) : (
          <Input
            value={settings.video_url}
            onChange={(e) => updateSettings({ video_url: e.target.value })}
            placeholder={
              settings.video_type === "youtube"
                ? "https://www.youtube.com/watch?v=..."
                : "https://vimeo.com/..."
            }
          />
        )}
      </div>

      {/* Display Mode */}
      <div className="space-y-2">
        <Label>Mënyra e shfaqjes</Label>
        <Select
          value={settings.display_mode}
          onValueChange={(v) => updateSettings({ display_mode: v as "background" | "standalone" })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="background">Background me overlay tekst</SelectItem>
            <SelectItem value="standalone">Seksion i veçantë</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overlay Opacity (only for background mode) */}
      {settings.display_mode === "background" && (
        <div className="space-y-2">
          <Label>Errësimi i overlay ({settings.overlay_opacity}%)</Label>
          <Slider
            value={[settings.overlay_opacity]}
            onValueChange={([v]) => updateSettings({ overlay_opacity: v })}
            min={0}
            max={90}
            step={5}
          />
        </div>
      )}

      {/* Playback Options */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <Switch
            checked={settings.autoplay}
            onCheckedChange={(v) => updateSettings({ autoplay: v })}
          />
          <Label>Autoplay</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={settings.loop}
            onCheckedChange={(v) => updateSettings({ loop: v })}
          />
          <Label>Loop</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={settings.muted}
            onCheckedChange={(v) => updateSettings({ muted: v })}
          />
          <Label>Mute</Label>
        </div>
      </div>
    </div>
  );
}
