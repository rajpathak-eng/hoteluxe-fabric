import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ArrowRightLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/hooks/useCms";

interface SortableSectionItemProps {
  section: PageSection;
  isSelected: boolean;
  onClick: () => void;
  onMove: () => void;
  onDelete: () => void;
  getSectionLabel: (key: string) => string;
}

export function SortableSectionItem({
  section,
  isSelected,
  onClick,
  onMove,
  onDelete,
  getSectionLabel,
}: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-3 rounded-md transition-colors border ${
        isSelected
          ? "bg-primary text-primary-foreground border-primary"
          : "hover:bg-muted border-transparent"
      } ${isDragging ? "shadow-lg" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-background/20 rounded"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      
      <button
        onClick={onClick}
        className="flex-1 text-left"
      >
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">
            {getSectionLabel(section.section_key)}
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              section.is_active ? "bg-green-500" : "bg-red-500/50"
            }`}
          />
        </div>
        <div className="text-xs opacity-70 mt-1 truncate">
          {section.title || "Pa titull"}
        </div>
      </button>

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={(e) => {
            e.stopPropagation();
            onMove();
          }}
          title="Zhvendos në faqe tjetër"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Fshi seksionin"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
