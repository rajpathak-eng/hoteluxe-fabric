import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical } from "lucide-react";

export interface ProductVariant {
  type: string;
  value: string;
}

interface ProductVariantsEditorProps {
  value: ProductVariant[];
  onChange: (value: ProductVariant[]) => void;
}

export function ProductVariantsEditor({ value, onChange }: ProductVariantsEditorProps) {
  const addVariant = () => {
    onChange([...value, { type: "", value: "" }]);
  };

  const updateVariant = (index: number, updates: Partial<ProductVariant>) => {
    const newVariants = [...value];
    newVariants[index] = { ...newVariants[index], ...updates };
    onChange(newVariants);
  };

  const removeVariant = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Variantet e Produktit</Label>
        <Button type="button" variant="outline" size="sm" onClick={addVariant}>
          <Plus className="h-4 w-4 mr-2" />
          Shto variant
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Shtoni variante të produktit si ngjyra, përmasa, etj.
      </p>

      {value.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
          Nuk ka variante. Klikoni "Shto variant" për të filluar.
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((variant, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30"
            >
              <div className="flex items-center text-muted-foreground">
                <GripVertical className="h-5 w-5" />
              </div>
              
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Tipi (p.sh. Ngjyra, Përmasa)</Label>
                  <Input
                    value={variant.type}
                    onChange={(e) => updateVariant(index, { type: e.target.value })}
                    placeholder="p.sh. Ngjyra"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Vlera</Label>
                  <Input
                    value={variant.value}
                    onChange={(e) => updateVariant(index, { value: e.target.value })}
                    placeholder="p.sh. E bardhë, E zezë, Gri"
                  />
                </div>
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => removeVariant(index)}
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
interface ProductVariantsDisplayProps {
  variants: ProductVariant[];
}

export function ProductVariantsDisplay({ variants }: ProductVariantsDisplayProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-2">
      {variants.map((variant, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{variant.type}:</span>
          <span className="text-sm text-muted-foreground">{variant.value}</span>
        </div>
      ))}
    </div>
  );
}
