import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import type { PageSection } from "@/hooks/usePageSections";

interface PersonalizimCTAProps {
  data: PageSection;
}

const PersonalizimCTA = ({ data }: PersonalizimCTAProps) => {
  const title = data?.title || "Gati për të filluar?";
  const subtitle = data?.subtitle || "Filloni sot";
  const content = data?.content || "Na kontaktoni sot për një konsultim falas dhe ofertë të personalizuar për nevojat tuaja.";
  const buttonText = data?.button_text || "Kërko ofertë tani";
  const buttonUrl = data?.button_url || "/merr-nje-oferte";

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-primary-foreground/70 text-xs tracking-widest uppercase mb-6">
            {subtitle}
          </span>
          
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-primary-foreground mb-6 tracking-tight">
            {title}
          </h2>
          
          <p className="text-primary-foreground/80 text-lg font-light mb-10 max-w-xl mx-auto">
            {content}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              variant="default"
              size="xl"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 group"
            >
              <Link to={buttonUrl}>
                {buttonText}
                <ArrowRight className="w-5 h-5 luxury-transition group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button
              asChild
              variant="heroOutline"
              size="xl"
              className="border-primary-foreground/40 hover:border-primary-foreground group"
            >
              <a href="tel:+355686000626">
                <Phone className="w-5 h-5 luxury-transition group-hover:scale-110" />
                Na telefononi
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizimCTA;
