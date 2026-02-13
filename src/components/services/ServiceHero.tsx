import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import type { PageSection } from "@/hooks/usePageSections";

interface ServiceHeroProps {
  data?: PageSection | null;
  // Fallback props for when using service page data directly
  title?: string;
  subtitle?: string;
  heroImage?: string | null;
}

const ServiceHero = ({ data, title, subtitle, heroImage }: ServiceHeroProps) => {
  // Use data from PageSection if available, otherwise use direct props
  const displayTitle = data?.title || title || "Tekstile Premium për Biznesin Tuaj";
  const displaySubtitle = data?.subtitle || subtitle || "Cilësi e lartë, dizajn elegant dhe shërbim i personalizuar për nevojat tuaja.";
  const buttonText = data?.button_text || "Kërko ofertë";
  const buttonUrl = data?.button_url || "/merr-nje-oferte";
  const backgroundImage = data?.image_url || heroImage;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleButtonClick = () => {
    if (buttonUrl.startsWith("#")) {
      scrollToSection(buttonUrl.slice(1));
    } else {
      window.location.href = buttonUrl;
    }
  };

  return (
    <section className="relative h-[70vh] min-h-[500px]">
      {/* Background Image */}
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt={displayTitle}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-secondary" />
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-16">
          <span className="inline-block typo-label text-primary-foreground/70 mb-4 animate-fade-up">
            Shërbimet tona
          </span>
          <h1 className="typo-h1 text-primary-foreground mb-4 animate-fade-up-delay-1 max-w-4xl">
            {displayTitle}
          </h1>
          <p className="typo-body text-primary-foreground/80 max-w-2xl animate-fade-up-delay-2 mb-8 md:text-lg">
            {displaySubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up-delay-3">
            <Button 
              variant="default" 
              size="lg" 
              onClick={handleButtonClick}
              className="group bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              {buttonText}
              <ArrowRight className="w-4 h-4 luxury-transition group-hover:translate-x-1" />
            </Button>
            
            <Button 
              variant="heroOutline" 
              size="lg" 
              onClick={() => scrollToSection("contact")}
              className="group border-primary-foreground/40 hover:border-primary-foreground"
            >
              <Phone className="w-4 h-4 luxury-transition group-hover:scale-110" />
              Na kontakto
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
