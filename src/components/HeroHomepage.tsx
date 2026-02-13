import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { PageSection } from "@/hooks/usePageSections";
import heroFallback from "@/assets/hero-hotel.jpg";

interface HeroHomepageProps {
  section: PageSection;
}

const HeroHomepage = ({ section }: HeroHomepageProps) => {
  const bgImage = section.image_url || heroFallback;
  const title = section.title || "";
  const subtitle = section.subtitle || "";
  const content = section.content || "";
  const buttonText = section.button_text || "Kërko ofertë";
  const buttonUrl = section.button_url || "#contact";

  const isAnchor = buttonUrl.startsWith("#");

  const handleAnchorClick = () => {
    if (isAnchor) {
      const el = document.getElementById(buttonUrl.slice(1));
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/50 to-primary/70" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {subtitle && (
            <span className="inline-block text-primary-foreground/80 text-sm tracking-wider uppercase mb-6 animate-fade-up">
              {subtitle}
            </span>
          )}

          {title && (
            <h1 className="typo-h1 text-primary-foreground mb-8 animate-fade-up-delay-1">
              {title}
            </h1>
          )}

          {content && (
            <p className="typo-body text-primary-foreground/90 mb-12 tracking-wide animate-fade-up-delay-2 md:text-lg">
              {content}
            </p>
          )}

          {buttonText && (
            <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-up-delay-3">
              {isAnchor ? (
                <Button
                  variant="default"
                  size="xl"
                  onClick={handleAnchorClick}
                  className="group luxury-transition hover:shadow-2xl bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  {buttonText}
                  <ArrowRight className="w-5 h-5 luxury-transition group-hover:translate-x-1" />
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="xl"
                  asChild
                  className="group luxury-transition hover:shadow-2xl bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  <Link to={buttonUrl}>
                    {buttonText}
                    <ArrowRight className="w-5 h-5 luxury-transition group-hover:translate-x-1" />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroHomepage;
