import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

interface DropdownItem {
  label: string;
  href: string;
  subcategories?: DropdownItem[];
}

interface HeaderDropdownProps {
  label: string;
  items: DropdownItem[];
  isScrolled: boolean;
  mainHref?: string;
  onNavigate?: () => void;
}

const HeaderDropdown = ({ label, items, isScrolled, mainHref, onNavigate }: HeaderDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleItemClick = () => {
    setIsOpen(false);
    onNavigate?.();
  };

  return (
    <div 
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {mainHref ? (
        <Link
          to={mainHref}
          className={`text-sm font-medium tracking-wide luxury-transition relative group flex items-center gap-1 ${
            isScrolled ? "text-foreground" : "text-primary-foreground"
          }`}
          onClick={handleItemClick}
        >
          {label}
          <ChevronDown className={`w-3.5 h-3.5 luxury-transition ${isOpen ? "rotate-180" : ""}`} />
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-current luxury-transition group-hover:w-full" />
        </Link>
      ) : (
        <button
          className={`text-sm font-medium tracking-wide luxury-transition relative group flex items-center gap-1 ${
            isScrolled ? "text-foreground" : "text-primary-foreground"
          }`}
        >
          {label}
          <ChevronDown className={`w-3.5 h-3.5 luxury-transition ${isOpen ? "rotate-180" : ""}`} />
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-current luxury-transition group-hover:w-full" />
        </button>
      )}

      {/* Dropdown Menu - positioned relative to header with higher z-index */}
      <div 
        className={`absolute top-full left-0 pt-2 z-[60] luxury-transition ${
          isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
        }`}
      >
        <div className="bg-popover border border-border rounded-md shadow-lg py-2 min-w-[220px] max-h-[70vh] overflow-y-auto flex">
          <div className="flex-1">
            {items.map((item, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => item.subcategories && item.subcategories.length > 0 ? setHoveredItemIndex(index) : null}
                onMouseLeave={() => setHoveredItemIndex(null)}
              >
                <Link
                  to={item.href}
                  className="flex items-center justify-between px-4 py-2.5 text-sm text-popover-foreground hover:bg-muted luxury-transition"
                  onClick={handleItemClick}
                >
                  <span>{item.label}</span>
                  {item.subcategories && item.subcategories.length > 0 && (
                    <ChevronRight className="w-3.5 h-3.5 ml-2" />
                  )}
                </Link>
                {item.subcategories && item.subcategories.length > 0 && hoveredItemIndex === index && (
                  <div className="absolute left-full top-0 ml-1 bg-popover border border-border rounded-md shadow-lg py-2 min-w-[200px] z-[70]">
                    {item.subcategories.map((subcat, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subcat.href}
                        className="block px-4 py-2.5 text-sm text-popover-foreground hover:bg-muted luxury-transition"
                        onClick={handleItemClick}
                      >
                        {subcat.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderDropdown;
