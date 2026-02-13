import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

interface DropdownItem {
  label: string;
  href: string;
}

interface MobileMenuDropdownProps {
  label: string;
  items: DropdownItem[];
  mainHref?: string;
  onNavigate: () => void;
}

const MobileMenuDropdown = ({ label, items, mainHref, onNavigate }: MobileMenuDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

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
            <Link
              key={index}
              to={item.href}
              className="block px-8 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileMenuDropdown;
