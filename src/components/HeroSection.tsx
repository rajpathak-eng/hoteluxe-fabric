import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-hotel.jpg";
import { usePageSection } from "@/hooks/usePageSections";

const HeroSection = () => {
  const { data: section, isLoading } = usePageSection("home", "hero");
  const { data: sectionHomepage } = usePageSection("home", "hero-homepage");
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  const imageFromHero = section?.image_url;
  const imageFromHomepage = Array.isArray(sectionHomepage?.items) && sectionHomepage.items.length > 0
    ? (sectionHomepage.items[0] as { image_url?: string })?.image_url
    : null;
  const bgImage = imageFromHero || imageFromHomepage || heroImage;
  const showImage = !isLoading;

  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - only set after section loaded to avoid flash of wrong image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: showImage ? `url(${bgImage})` : undefined,
          backgroundColor: showImage ? undefined : "hsl(var(--primary))",
        }}
      />
      
      {/* Elegant Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/50 to-primary/70" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block text-primary-foreground/80 text-sm tracking-wider uppercase mb-6 animate-fade-up">
            ​
          </span>
          
          <h1 className="typo-h1 text-primary-foreground mb-8 animate-fade-up-delay-1">
             {section?.title || "Tekstile Premium për Hotele, Restorante & Airbnb"}
          </h1>
          
          <p className="typo-body text-primary-foreground/90 mb-12 tracking-wide animate-fade-up-delay-2 md:text-lg">
             {section?.content || "EMA Hotelling është furnitor i specializuar në tekstile për hotele, restorante dhe njësi Airbnb, duke kombinuar cilësinë premium, dizajnin modern dhe standardet më të larta të industrisë HoReCa."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-up-delay-3">
            <Button variant="default" size="xl" onClick={() => scrollToSection("contact")} className="group luxury-transition hover:shadow-2xl bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Kërko ofertë
              <ArrowRight className="w-5 h-5 luxury-transition group-hover:translate-x-1" />
            </Button>
            
            <Button variant="heroOutline" size="xl" onClick={() => scrollToSection("contact")} className="group luxury-transition border-primary-foreground/40 hover:border-primary-foreground">
              <Phone className="w-5 h-5 luxury-transition group-hover:scale-110" />
              Na kontakto
            </Button>
          </div>
        </div>
      </div>
      
      {/* Elegant Scroll Indicator */}
      
    </section>;
};
export default HeroSection;