import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Search } from "lucide-react";
import logoEma from "@/assets/logo-ema.png";
import HeaderDropdown from "./HeaderDropdown";
import MobileMenuDropdown from "./MobileMenuDropdown";
import SearchDialog from "./SearchDialog";
import { useCategories } from "@/hooks/useCategories";
import { usePublicServicePages } from "@/hooks/useServicePages";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { data: categories } = useCategories();
  const { data: servicePages } = usePublicServicePages();

  // Check if we're on the homepage
  const isHomepage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const scrollToSection = (id: string) => {
    if (isHomepage) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  // Build dropdown items for services from database (without Personalizim)
  const servicesItems = servicePages?.map(sp => ({
    label: sp.title,
    href: `/sherbimet/${sp.slug}`,
  })) || [];

  // Build dropdown items for products (categories)
  const productsItems = categories?.map(c => ({
    label: c.name,
    href: `/produktet/${c.slug}`,
  })) || [];


  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 luxury-transition bg-background backdrop-blur-xl shadow-sm border-b border-border"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logoEma} 
              alt="EMA Hotelling" 
              className="h-14 md:h-16 lg:h-[4.5rem] w-auto luxury-transition"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {/* Rreth Nesh - standalone page */}
            <Link
              to="/rreth-nesh"
              className="text-sm font-medium tracking-wide luxury-transition relative group text-foreground"
            >
              Rreth nesh
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-current luxury-transition group-hover:w-full" />
            </Link>

            {/* Shërbimet Dropdown */}
            <HeaderDropdown
              label="Shërbimet"
              items={servicesItems}
              isScrolled={true}
              onNavigate={() => setIsMobileMenuOpen(false)}
            />

            {/* Produktet Dropdown */}
            <HeaderDropdown
              label="Produktet"
              items={productsItems}
              isScrolled={true}
              mainHref="/produktet"
              onNavigate={() => setIsMobileMenuOpen(false)}
            />

            {/* Projekte */}
            <Link
              to="/projekte"
              className="text-sm font-medium tracking-wide luxury-transition relative group text-foreground"
            >
              Projekte
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-current luxury-transition group-hover:w-full" />
            </Link>

            {/* Blog */}
            <Link
              to="/blog"
              className="text-sm font-medium tracking-wide luxury-transition relative group text-foreground"
            >
              Blog
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-current luxury-transition group-hover:w-full" />
            </Link>

            {/* Kontakt - standalone page */}
            <Link
              to="/kontakt"
              className="text-sm font-medium tracking-wide luxury-transition relative group text-foreground"
            >
              Kontakt
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-current luxury-transition group-hover:w-full" />
            </Link>
          </nav>

          {/* Search & CTA Button */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Search Button - minimal icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground luxury-transition"
              aria-label="Kërko"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* CTA Button - prominent black/primary style */}
            <Button
              asChild
              variant="default"
              size="lg"
              className="group rounded-full px-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Link to="/merr-nje-oferte">
                <Phone className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                Kërko një ofertë
              </Link>
            </Button>
          </div>

          {/* Mobile Search & Menu Buttons */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 transition-all duration-300 hover:scale-110 text-foreground"
              aria-label="Kërko"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="p-2 transition-transform duration-300 hover:scale-110"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 transition-colors duration-300 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 transition-colors duration-300 text-foreground" />
              )}
            </button>
          </div>
        </div>

        <div className={`lg:hidden overflow-hidden transition-all duration-500 ${
          isMobileMenuOpen ? "max-h-[calc(100vh-6rem)] opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className="bg-background border-t border-border py-2 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <nav className="flex flex-col pb-4">
              {/* Rreth Nesh - standalone page */}
              <Link
                to="/rreth-nesh"
                className="text-foreground text-sm font-medium px-4 py-3 hover:bg-muted transition-all duration-300 text-left border-b border-border/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Rreth nesh
              </Link>

              {/* Shërbimet */}
              <MobileMenuDropdown
                label="Shërbimet"
                items={servicesItems}
                onNavigate={() => setIsMobileMenuOpen(false)}
              />

              {/* Produktet */}
              <MobileMenuDropdown
                label="Produktet"
                items={productsItems}
                mainHref="/produktet"
                onNavigate={() => setIsMobileMenuOpen(false)}
              />

              {/* Projekte */}
              <Link
                to="/projekte"
                className="text-foreground text-sm font-medium px-4 py-3 hover:bg-muted transition-all duration-300 text-left border-b border-border/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Projekte
              </Link>

              {/* Blog */}
              <Link
                to="/blog"
                className="text-foreground text-sm font-medium px-4 py-3 hover:bg-muted transition-all duration-300 text-left border-b border-border/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>

              {/* Kontakt - standalone page */}
              <Link
                to="/kontakt"
                className="text-foreground text-sm font-medium px-4 py-3 hover:bg-muted transition-all duration-300 text-left"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Kontakt
              </Link>

              {/* CTA Button - links to standalone quote page */}
              <div className="px-4 pt-4 pb-2">
                <Button
                  asChild
                  variant="default"
                  size="lg"
                  className="w-full transition-transform duration-300 hover:scale-[1.02]"
                >
                  <Link to="/merr-nje-oferte" onClick={() => setIsMobileMenuOpen(false)}>
                    <Phone className="w-4 h-4" />
                    Kërko ofertë
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Search Dialog */}
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  );
};

export default Header;
