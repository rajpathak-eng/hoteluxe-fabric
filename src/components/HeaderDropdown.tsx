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
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleItemClick = () => {
    setIsOpen(false);
    onNavigate?.();
  };

  const triggerClass = `text-sm font-medium tracking-wide luxury-transition relative group flex items-center gap-1 cursor-pointer border-0 bg-transparent p-0 ${
    isScrolled ? "text-foreground" : "text-foreground"
  }`;

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className={triggerClass}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen((prev) => !prev);
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 luxury-transition ${isOpen ? "rotate-180" : ""}`} />
        <span className="absolute -bottom-1 left-0 w-0 h-px bg-current luxury-transition group-hover:w-full" />
      </button>

      <div
        className={`absolute top-full left-0 pt-1 z-[100] transition-all duration-150 ${
          isOpen
            ? "opacity-100 visible translate-y-0 pointer-events-auto"
            : "opacity-0 invisible -translate-y-1 pointer-events-none"
        }`}
      >
        <div className="bg-popover border border-border rounded-md shadow-lg py-2 min-w-[220px] max-h-[70vh] overflow-y-auto flex">
          {mainHref && (
            <Link
              to={mainHref}
              className="block px-4 py-2.5 text-sm text-popover-foreground hover:bg-muted luxury-transition border-b border-border"
              onClick={handleItemClick}
            >
              Të gjitha
            </Link>
          )}
          <div className="flex-1">
            {items.map((item, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() =>
                  item.subcategories && item.subcategories.length > 0 ? setHoveredItemIndex(index) : setHoveredItemIndex(null)
                }
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
