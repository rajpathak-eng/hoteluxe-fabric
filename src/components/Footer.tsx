import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logoEma from "@/assets/logo-ema.png";
import { useFooterSettings } from "@/hooks/useSiteSettings";
import { SocialLinks } from "./SocialLinks";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { data: settings } = useFooterSettings();
 
  // Default values
  const companyDescription = settings?.company_description || "Furnitor i besueshëm i tekstileve premium për industrinë e mikpritjes dhe hotelerisë që nga viti 2014.";
  const phone = settings?.phone || "+355 68 600 0626";
  const email = settings?.email || "info@emahotelling.com";
  const address = settings?.address || "Tiranë, Shqipëri";
  const navLinks = settings?.nav_links || [
    { label: "Rreth nesh", url: "/rreth-nesh" },
    { label: "Produktet", url: "/produktet" },
    { label: "Blog", url: "/blog" },
    { label: "Projekte", url: "/projekte" },
    { label: "Pyetje të shpeshta", url: "/faq" },
    { label: "Kontakt", url: "/kontakt" },
  ];
  const serviceLinks = settings?.service_links || [
    { label: "Tekstile për hotele", url: "/sherbimet/tekstile-per-hotele" },
    { label: "Tekstile për restorante", url: "/sherbimet/tekstile-per-restorante" },
    { label: "Tekstile për Airbnb", url: "/sherbimet/tekstile-per-airbnb" },
    { label: "Tekstile për resorte", url: "/sherbimet/tekstile-per-resorte" },
    { label: "Tekstile për bujtina", url: "/sherbimet/tekstile-per-bujtina" },
    { label: "Tekstile për SPA", url: "/sherbimet/tekstile-per-spa" },
  ];
  const copyright = settings?.copyright?.replace("{year}", String(currentYear)) || `© ${currentYear} EMA Hotelling. Të gjitha të drejtat e rezervuara.`;

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Brand */}
          <div>
            <Link to="/">
              <img 
                src={logoEma} 
                alt="EMA Hotelling" 
                className="h-14 md:h-16 lg:h-[4.5rem] w-auto brightness-0 invert mb-6"
              />
            </Link>
            <p className="text-primary-foreground/60 text-sm leading-relaxed font-light">
              {companyDescription}
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-primary-foreground">Navigim</h4>
            <nav className="space-y-4">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="block text-primary-foreground/60 hover:text-primary-foreground luxury-transition text-sm font-light"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-primary-foreground">Shërbimet</h4>
            <nav className="space-y-4">
              {serviceLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="block text-primary-foreground/60 hover:text-primary-foreground luxury-transition text-sm font-light"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-primary-foreground">Kontakt</h4>
            <div className="space-y-4">
              <a 
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-sm text-primary-foreground/60 hover:text-primary-foreground luxury-transition font-light"
              >
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                {phone}
              </a>
              <a 
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-sm text-primary-foreground/60 hover:text-primary-foreground luxury-transition font-light"
              >
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                {email}
              </a>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/60 font-light">
                <MapPin className="w-4 h-4" strokeWidth={1.5} />
                {address}
              </div>
              
              {/* Social Links */}
              <div className="pt-4">
                <h5 className="text-sm font-medium text-primary-foreground/80 mb-3">Na ndiqni</h5>
                <SocialLinks variant="light" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-16 pt-8 text-center text-xs text-primary-foreground/40 font-light tracking-wide space-y-2">
          <p>{copyright}</p>
          <p>
            Designed and Developed by:{" "}
            <a 
              href="https://www.involveus.al" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
            >
              Involve Us
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
