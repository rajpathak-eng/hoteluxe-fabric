import { Check, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/hooks/usePageSections";
import { ServicePage } from "@/hooks/useServicePages";

interface ServiceWhyUsSectionProps {
  section: PageSection;
  service: ServicePage;
}

export function ServiceWhyUsSection({ section, service }: ServiceWhyUsSectionProps) {
  // Use section data if available, otherwise fallback to service data
  const title = section.title || "Përse të na zgjidhni?";
  const description = section.content || service.description || "";
  
  // Priority: section.items > service.features
  // Handle both string[] and object[] formats
  const sectionItems = section.items as any[] | null;
  let features: string[] = [];
  
  if (sectionItems && sectionItems.length > 0) {
    // Handle both string array and object array formats
    features = sectionItems.map(item => 
      typeof item === 'string' ? item : (item?.text || item?.feature || '')
    ).filter(Boolean);
  }
  
  // Fallback to service.features if section.items is empty
  if (features.length === 0 && service.features && service.features.length > 0) {
    features = service.features;
  }

  const openWhatsApp = () => {
    const message = `Përshëndetje! Jam i interesuar për ${service.title}. Dëshiroj të marr më shumë informacion dhe një ofertë.`;
    const phone = "355686000626";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6 tracking-tight">
              {title}
            </h2>
            <div 
              className="prose prose-lg text-muted-foreground font-light leading-relaxed whitespace-pre-line" 
              dangerouslySetInnerHTML={{ __html: description }}
            />
            
            <Button
              size="lg"
              onClick={openWhatsApp}
              className="mt-8 group"
            >
              <Phone className="w-4 h-4 transition-transform group-hover:rotate-12" />
              Kërko ofertë
            </Button>
          </div>

          <div className="bg-background p-8 md:p-10 border border-border rounded-lg">
            <h3 className="font-serif text-2xl font-medium text-foreground mb-6">
              {section.subtitle || "Çfarë ofrojmë"}
            </h3>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-foreground font-light">{typeof feature === 'string' ? feature : (feature as any).text || ''}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
