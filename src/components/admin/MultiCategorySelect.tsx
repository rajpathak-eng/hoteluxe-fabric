import { useState, useEffect } from "react";
import { Check, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface MultiCategorySelectProps {
  categories: Category[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  primaryCategoryId?: string;
  onPrimaryCategoryChange?: (id: string | null) => void;
}

export function MultiCategorySelect({
  categories,
  selectedIds,
  onChange,
  placeholder = "Zgjidh kategoritë",
  primaryCategoryId,
  onPrimaryCategoryChange,
}: MultiCategorySelectProps) {
  const [open, setOpen] = useState(false);

  const selectedCategories = categories.filter((cat) => selectedIds.includes(cat.id));

  const toggleCategory = (categoryId: string) => {
    if (selectedIds.includes(categoryId)) {
      const newIds = selectedIds.filter((id) => id !== categoryId);
      onChange(newIds);
      // If we removed the primary category, set primary to first remaining or null
      if (primaryCategoryId === categoryId && onPrimaryCategoryChange) {
        onPrimaryCategoryChange(newIds[0] || null);
      }
    } else {
      const newIds = [...selectedIds, categoryId];
      onChange(newIds);
      // If this is the first category, set it as primary
      if (newIds.length === 1 && onPrimaryCategoryChange) {
        onPrimaryCategoryChange(categoryId);
      }
    }
  };

  const removeCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newIds = selectedIds.filter((id) => id !== categoryId);
    onChange(newIds);
    if (primaryCategoryId === categoryId && onPrimaryCategoryChange) {
      onPrimaryCategoryChange(newIds[0] || null);
    }
  };

  const setPrimary = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPrimaryCategoryChange) {
      onPrimaryCategoryChange(categoryId);
    }
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10"
          >
            {selectedCategories.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {selectedCategories.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant={cat.id === primaryCategoryId ? "default" : "secondary"}
                    className="mr-1"
                  >
                    {cat.name}
                    {cat.id === primaryCategoryId && (
                      <span className="ml-1 text-xs">(kryesore)</span>
                    )}
                    <button
                      className="ml-1 hover:bg-background/20 rounded-full"
                      onClick={(e) => removeCategory(cat.id, e)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="max-h-60 overflow-y-auto">
            {categories.map((category) => {
              const isSelected = selectedIds.includes(category.id);
              const isPrimary = category.id === primaryCategoryId;
              return (
                <div
                  key={category.id}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-muted",
                    isSelected && "bg-muted/50"
                  )}
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-4 w-4 border rounded flex items-center justify-center",
                        isSelected ? "bg-primary border-primary" : "border-input"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <span>{category.name}</span>
                    {isPrimary && (
                      <Badge variant="outline" className="text-xs">Kryesore</Badge>
                    )}
                  </div>
                  {isSelected && !isPrimary && onPrimaryCategoryChange && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={(e) => setPrimary(category.id, e)}
                    >
                      Bëj kryesore
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      {selectedCategories.length > 1 && (
        <p className="text-xs text-muted-foreground">
          Kategoria kryesore përcakton URL-në e produktit/artikullit
        </p>
      )}
    </div>
  );
}
