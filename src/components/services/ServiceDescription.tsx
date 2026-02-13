import { Button } from "@/components/ui/button";
import { Phone, Check } from "lucide-react";
import type { PageSection } from "@/hooks/usePageSections";

interface ServiceDescriptionProps {
  data: PageSection;
}

const ServiceDescription = ({ data }: ServiceDescriptionProps) => {
  const title = data?.title || "Përse të na zgjidhni?";
  const content = data?.content || "";
  const featuresTitle = data?.subtitle || "Çfarë ofrojmë";
  
  // Items contains the features list
  const features: string[] = Array.isArray(data?.items) 
    ? data.items.map(item => typeof item === 'string' ? item : (item as any).text || '')
    : [];

  const openWhatsApp = () => {
    const message = `Përshëndetje! Jam i interesuar për shërbimet tuaja. Dëshiroj të marr më shumë informacion.`;
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
              dangerouslySetInnerHTML={{ __html: content }}
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

          <div className="bg-secondary/50 p-8 md:p-10">
            <h3 className="font-serif text-2xl font-medium text-foreground mb-6">
              {featuresTitle}
            </h3>
            <ul className="space-y-4">
              {features.length > 0 ? (
                features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-foreground font-light">{feature}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-foreground font-light">Cilësi premium</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-foreground font-light">Personalizim i plotë</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-foreground font-light">Garanci cilësie</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDescription;
