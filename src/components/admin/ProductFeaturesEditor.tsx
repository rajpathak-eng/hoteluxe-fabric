import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical, Check } from "lucide-react";

export interface ProductFeature {
  text: string;
}

interface ProductFeaturesEditorProps {
  value: ProductFeature[];
  onChange: (value: ProductFeature[]) => void;
}

export function ProductFeaturesEditor({ value, onChange }: ProductFeaturesEditorProps) {
  const addFeature = () => {
    onChange([...value, { text: "" }]);
  };

  const updateFeature = (index: number, text: string) => {
    const newFeatures = [...value];
    newFeatures[index] = { text };
    onChange(newFeatures);
  };

  const removeFeature = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Karakteristikat e Produktit</Label>
        <Button type="button" variant="outline" size="sm" onClick={addFeature}>
          <Plus className="h-4 w-4 mr-2" />
          Shto karakteristikë
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Shtoni karakteristikat kryesore të produktit si tekst. Do të shfaqen si bullet points.
      </p>

      {value.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
          Nuk ka karakteristika. Klikoni "Shto karakteristikë" për të filluar.
        </div>
      ) : (
        <div className="space-y-2">
          {value.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                value={feature.text}
                onChange={(e) => updateFeature(index, e.target.value)}
                placeholder="p.sh. 100% Pambuk organik"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                onClick={() => removeFeature(index)}
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
interface ProductFeaturesDisplayProps {
  features: ProductFeature[];
}

export function ProductFeaturesDisplay({ features }: ProductFeaturesDisplayProps) {
  if (!features || features.length === 0) return null;

  return (
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3 text-muted-foreground">
          <Check className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
          <span>{feature.text}</span>
        </li>
      ))}
    </ul>
  );
}
