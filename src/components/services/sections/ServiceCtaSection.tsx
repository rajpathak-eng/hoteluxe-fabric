import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/hooks/usePageSections";
import { ServicePage } from "@/hooks/useServicePages";

interface ServiceCtaSectionProps {
  section: PageSection;
  service: ServicePage;
}

export function ServiceCtaSection({ section, service }: ServiceCtaSectionProps) {
  const title = section.title || "Gati për të filluar?";
  const content = section.content || "Na kontaktoni sot për një konsultim falas dhe ofertë të personalizuar për nevojat tuaja.";
  const buttonText = section.button_text || "Kërko ofertë tani";

  const openWhatsApp = () => {
    const message = `Përshëndetje! Jam i interesuar për ${service.title}. Dëshiroj të marr më shumë informacion dhe një ofertë.`;
    const phone = "355686000626";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-medium text-primary-foreground mb-4 tracking-tight">
          {title}
        </h2>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto font-light leading-relaxed mb-8">
          {content}
        </p>
        <Button
          size="lg"
          variant="secondary"
          onClick={openWhatsApp}
          className="group"
        >
          <Phone className="w-4 h-4 transition-transform group-hover:rotate-12" />
          {buttonText}
        </Button>
      </div>
    </section>
  );
}
