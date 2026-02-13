import { PageSection } from "@/hooks/usePageSections";
import { ServicePage } from "@/hooks/useServicePages";

interface ServiceHeroSectionProps {
  section: PageSection;
  service: ServicePage;
}

export function ServiceHeroSection({ section, service }: ServiceHeroSectionProps) {
  // Use section data if available, otherwise fallback to service data
  const heroImage = section.image_url || service.hero_image || "/placeholder.svg";
  const title = section.title || service.title;
  const subtitle = section.subtitle || service.subtitle;

  return (
    <section className="relative h-[70vh] min-h-[500px]">
      <img
        src={heroImage}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
      
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-16">
          <span className="inline-block text-primary-foreground/70 text-xs font-medium tracking-widest uppercase mb-4 animate-fade-up">
            Shërbimet tona
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-medium text-primary-foreground mb-4 tracking-tight animate-fade-up-delay-1">
            {title}
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl font-light max-w-2xl animate-fade-up-delay-2">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
