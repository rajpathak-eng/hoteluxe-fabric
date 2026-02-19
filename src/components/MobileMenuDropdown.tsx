import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

interface DropdownItem {
  label: string;
  href: string;
  subcategories?: DropdownItem[];
}

interface MobileMenuDropdownProps {
  label: string;
  items: DropdownItem[];
  mainHref?: string;
  onNavigate: () => void;
}

const MobileMenuDropdown = ({ label, items, mainHref, onNavigate }: MobileMenuDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="border-b border-border/50 last:border-b-0">
      <div className="flex items-center justify-between">
        {mainHref ? (
          <Link
            to={mainHref}
            className="flex-1 text-foreground text-sm font-medium px-4 py-3 text-left"
            onClick={onNavigate}
          >
            {label}
          </Link>
        ) : (
          <span className="flex-1 text-foreground text-sm font-medium px-4 py-3 text-left">
            {label}
          </span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 hover:bg-muted rounded-md transition-colors"
        >
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[2000px]" : "max-h-0"}`}>
        <div className="bg-muted/50 py-2">
          {items.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between">
                <Link
                  to={item.href}
                  className="flex-1 block px-8 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={onNavigate}
                >
                  {item.label}
                </Link>
                {item.subcategories && item.subcategories.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItem(index);
                    }}
                    className="p-2 hover:bg-muted rounded-md transition-colors"
                  >
                    <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expandedItems.has(index) ? "rotate-90" : ""}`} />
                  </button>
                )}
              </div>
              {item.subcategories && item.subcategories.length > 0 && (
                <div className={`overflow-hidden transition-all duration-300 ${expandedItems.has(index) ? "max-h-[1000px]" : "max-h-0"}`}>
                  <div className="bg-muted/70 pl-4">
                    {item.subcategories.map((subcat, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subcat.href}
                        className="block px-8 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        onClick={onNavigate}
                      >
                        {subcat.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileMenuDropdown;
