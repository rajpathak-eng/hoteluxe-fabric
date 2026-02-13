import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "./ImageUpload";
import { Plus, Trash2, GripVertical } from "lucide-react";

export interface WashingIcon {
  icon_url: string;
  label?: string;
}

interface WashingIconsEditorProps {
  value: WashingIcon[];
  onChange: (value: WashingIcon[]) => void;
}

export function WashingIconsEditor({ value, onChange }: WashingIconsEditorProps) {
  const addIcon = () => {
    onChange([...value, { icon_url: "", label: "" }]);
  };

  const updateIcon = (index: number, updates: Partial<WashingIcon>) => {
    const newIcons = [...value];
    newIcons[index] = { ...newIcons[index], ...updates };
    onChange(newIcons);
  };

  const removeIcon = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Ikonat e Larjes</Label>
        <Button type="button" variant="outline" size="sm" onClick={addIcon}>
          <Plus className="h-4 w-4 mr-2" />
          Shto ikonë
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Ngarkoni ikonat e udhëzimeve të larjes për këtë produkt (opsionale: shtoni etiketë për secilën)
      </p>

      {value.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
          Nuk ka ikona. Klikoni "Shto ikonë" për të filluar.
        </div>
      ) : (
        <div className="space-y-4">
          {value.map((icon, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <GripVertical className="h-5 w-5" />
                <span className="text-sm font-medium w-6">{index + 1}.</span>
              </div>
              
              <div className="flex-1 grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Ikona *</Label>
                  <div className="max-w-[120px]">
                    <ImageUpload
                      value={icon.icon_url || null}
                      onChange={(url) => updateIcon(index, { icon_url: url || "" })}
                      folder="washing-icons"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Etiketa (opsionale)</Label>
                  <Input
                    value={icon.label || ""}
                    onChange={(e) => updateIcon(index, { label: e.target.value })}
                    placeholder="p.sh. Larje 40°C"
                  />
                </div>
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => removeIcon(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Frontend display component
interface WashingIconsDisplayProps {
  icons: WashingIcon[];
}

export function WashingIconsDisplay({ icons }: WashingIconsDisplayProps) {
  if (!icons || icons.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4">
      {icons.map((icon, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <img
              src={icon.icon_url}
              alt={icon.label || `Udhëzim larjeje ${index + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          {icon.label && (
            <span className="text-xs text-muted-foreground text-center max-w-[80px]">
              {icon.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
