import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, GripVertical, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface MenuLink {
  id: string;
  label: string;
  url: string;
  isActive: boolean;
  children?: MenuLink[];
}

interface SortableMenuItemProps {
  link: MenuLink;
  onUpdate: (id: string, updates: Partial<MenuLink>) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}

function SortableMenuItem({ link, onUpdate, onRemove, onToggle }: SortableMenuItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="space-y-2">
      <div
        className={`flex items-center gap-2 p-3 border rounded-lg transition-colors ${
          link.isActive 
            ? "bg-muted/30 border-border" 
            : "bg-muted/10 border-border/50 opacity-60"
        }`}
      >
        <button
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="flex-1 flex items-center gap-2">
          <Input
            value={link.label}
            onChange={(e) => onUpdate(link.id, { label: e.target.value })}
            placeholder="Emri i faqes"
            className="flex-1 h-9"
            disabled={!link.isActive}
          />
          <Input
            value={link.url}
            onChange={(e) => onUpdate(link.id, { url: e.target.value })}
            placeholder="/url-e-faqes"
            className="flex-1 h-9"
            disabled={!link.isActive}
          />
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onToggle(link.id)}
            title={link.isActive ? "Çaktivizo" : "Aktivizo"}
          >
            {link.isActive ? (
              <Eye className="h-4 w-4 text-primary" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>

          {link.children && link.children.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onRemove(link.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Sub-links (children) */}
      {isExpanded && link.children && link.children.length > 0 && (
        <div className="ml-8 pl-4 border-l-2 border-muted space-y-2">
          {link.children.map((child, idx) => (
            <div
              key={child.id || idx}
              className={`flex items-center gap-2 p-2 border rounded-lg text-sm ${
                child.isActive 
                  ? "bg-muted/20 border-border" 
                  : "bg-muted/5 border-border/30 opacity-50"
              }`}
            >
              <Input
                value={child.label}
                onChange={(e) => {
                  const newChildren = [...(link.children || [])];
                  newChildren[idx] = { ...child, label: e.target.value };
                  onUpdate(link.id, { children: newChildren });
                }}
                placeholder="Emri"
                className="flex-1 h-8 text-sm"
                disabled={!child.isActive}
              />
              <Input
                value={child.url}
                onChange={(e) => {
                  const newChildren = [...(link.children || [])];
                  newChildren[idx] = { ...child, url: e.target.value };
                  onUpdate(link.id, { children: newChildren });
                }}
                placeholder="/url"
                className="flex-1 h-8 text-sm"
                disabled={!child.isActive}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  const newChildren = [...(link.children || [])];
                  newChildren[idx] = { ...child, isActive: !child.isActive };
                  onUpdate(link.id, { children: newChildren });
                }}
              >
                {child.isActive ? (
                  <Eye className="h-3 w-3 text-primary" />
                ) : (
                  <EyeOff className="h-3 w-3 text-muted-foreground" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface MenuLinkEditorProps {
  links: MenuLink[];
  onChange: (links: MenuLink[]) => void;
  title: string;
  description?: string;
}

export function MenuLinkEditor({ links, onChange, title, description }: MenuLinkEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const generateId = () => `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = links.findIndex((l) => l.id === active.id);
        const newIndex = links.findIndex((l) => l.id === over.id);
        onChange(arrayMove(links, oldIndex, newIndex));
      }
    },
    [links, onChange]
  );

  const addLink = () => {
    onChange([
      ...links,
      { id: generateId(), label: "", url: "", isActive: true },
    ]);
  };

  const updateLink = (id: string, updates: Partial<MenuLink>) => {
    onChange(
      links.map((link) =>
        link.id === id ? { ...link, ...updates } : link
      )
    );
  };

  const removeLink = (id: string) => {
    onChange(links.filter((link) => link.id !== id));
  };

  const toggleLink = (id: string) => {
    onChange(
      links.map((link) =>
        link.id === id ? { ...link, isActive: !link.isActive } : link
      )
    );
  };

  // Count active/inactive links
  const activeCount = links.filter((l) => l.isActive).length;
  const inactiveCount = links.length - activeCount;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-medium">{title}</Label>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-primary flex items-center gap-1">
              <Eye className="h-3 w-3" /> {activeCount} aktive
            </span>
            {inactiveCount > 0 && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <EyeOff className="h-3 w-3" /> {inactiveCount} të çaktivizuara
              </span>
            )}
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addLink}>
          <Plus className="h-4 w-4 mr-2" />
          Shto
        </Button>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
          <p>Nuk ka linqe në këtë menu.</p>
          <p className="text-xs mt-1">Klikoni "Shto" për të shtuar një faqe.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={links.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {links.map((link) => (
                <SortableMenuItem
                  key={link.id}
                  link={link}
                  onUpdate={updateLink}
                  onRemove={removeLink}
                  onToggle={toggleLink}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

// Helper to convert old NavLink format to new MenuLink format
export function convertToMenuLinks(navLinks: { label: string; url: string; children?: any[] }[]): MenuLink[] {
  return navLinks.map((link, idx) => ({
    id: `link-${idx}-${Date.now()}`,
    label: link.label,
    url: link.url,
    isActive: true,
    children: link.children?.map((child, cidx) => ({
      id: `child-${idx}-${cidx}-${Date.now()}`,
      label: child.label,
      url: child.url,
      isActive: true,
    })),
  }));
}

// Helper to convert MenuLink back to simple NavLink format (filtering inactive)
export function convertToNavLinks(menuLinks: MenuLink[]): { label: string; url: string; children?: any[] }[] {
  return menuLinks
    .filter((link) => link.isActive)
    .map((link) => ({
      label: link.label,
      url: link.url,
      children: link.children
        ?.filter((child) => child.isActive)
        .map((child) => ({
          label: child.label,
          url: child.url,
        })),
    }));
}
