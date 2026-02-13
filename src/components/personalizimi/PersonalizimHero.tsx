import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { PageSection } from "@/hooks/usePageSections";

interface PersonalizimHeroProps {
  data: PageSection;
}

const PersonalizimHero = ({ data }: PersonalizimHeroProps) => {
  const title = data?.title || "Tekstile të personalizuara për biznesin tuaj – cilësi, stil dhe identitet unik!";
  const subtitle = data?.subtitle || "Nga uniformat e stafit deri tek peshqirët dhe aksesorët e markës – çdo produkt bëhet unik për ju.";
  const buttonText = data?.button_text || "Kërko ofertë tani";
  const buttonUrl = data?.button_url || "/merr-nje-oferte";
  const backgroundImage = data?.image_url;

  return (
    <section 
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
      style={backgroundImage ? {
        backgroundImage: `linear-gradient(to bottom, hsl(var(--background) / 0.85), hsl(var(--background) / 0.9)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      {/* Decorative background pattern (fallback if no image) */}
      {!backgroundImage && (
         <div className="absolute inset-0 bg-background">
           <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-foreground via-transparent to-transparent" />
        </div>
      )}
      
      <div className="relative z-10 container mx-auto px-4 text-center py-20">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block typo-label text-muted-foreground mb-6 animate-fade-up">
            Personalizim tekstilesh
          </span>
          
          <h1 className="typo-h1 text-foreground mb-8 animate-fade-up-delay-1">
            {title}
          </h1>
          
          <p className="typo-body text-muted-foreground mb-12 tracking-wide animate-fade-up-delay-2 max-w-3xl mx-auto md:text-lg">
            {subtitle}
          </p>
          
          <div className="animate-fade-up-delay-3">
            <Button 
              asChild
              variant="default" 
              size="xl" 
              className="group luxury-transition hover:shadow-2xl"
            >
              <Link to={buttonUrl}>
                {buttonText}
                <ArrowRight className="w-5 h-5 luxury-transition group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizimHero;
