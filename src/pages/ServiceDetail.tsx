import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicServicePage } from "@/hooks/useServicePages";
import { usePageSections, PageSection } from "@/hooks/usePageSections";

// Core section components
import { 
  ServiceHeroSection, 
  ServiceWhyUsSection, 
  ServiceCategoriesSection, 
  ServiceCtaSection,
  ServiceProjectsSection
} from "@/components/services/sections";

// Extra section components
import PersonalizimServices from "@/components/personalizimi/PersonalizimServices";
import PersonalizimGallery from "@/components/personalizimi/PersonalizimGallery";
import PersonalizimBenefits from "@/components/personalizimi/PersonalizimBenefits";
import PersonalizimFAQ from "@/components/personalizimi/PersonalizimFAQ";
import PersonalizimTestimonials from "@/components/personalizimi/PersonalizimTestimonials";
import PersonalizimCTA from "@/components/personalizimi/PersonalizimCTA";

// All section component mapping
const sectionComponents: Record<string, React.FC<any>> = {
  hero: ServiceHeroSection,
  "why-us": ServiceWhyUsSection,
  categories: ServiceCategoriesSection,
  cta: ServiceCtaSection,
  projects: ServiceProjectsSection,
  // Extra sections
  services: PersonalizimServices,
  gallery: PersonalizimGallery,
  benefits: PersonalizimBenefits,
  faq: PersonalizimFAQ,
  testimonials: PersonalizimTestimonials,
  "extra-cta": PersonalizimCTA,
};

// Core sections that need service data
const coreSections = ["hero", "why-us", "categories", "cta", "projects"];

const ServiceDetail = () => {
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
  const { data: service, isLoading: serviceLoading } = usePublicServicePage(serviceSlug);
  
  // Fetch ALL sections for this service page
  const pageSlug = `service-${serviceSlug}`;
  const { data: sections, isLoading: sectionsLoading } = usePageSections(pageSlug);

  // Update document meta tags for SEO
  useEffect(() => {
    if (service) {
      document.title = service.meta_title || service.title;
      
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', service.meta_description || service.subtitle || '');
    }
    
    return () => {
      document.title = 'EMA Hotelling';
    };
  }, [service]);

  if (serviceLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <Skeleton className="h-[70vh] w-full rounded-lg" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
 
  if (!service) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-4xl text-foreground mb-4">Shërbimi nuk u gjet</h1>
            <p className="text-muted-foreground mb-8">Shërbimi që po kërkoni nuk ekziston.</p>
            <Link to="/">
              <Button>Kthehu në faqen kryesore</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get active sections sorted by display_order
  const activeSections = sections
    ?.filter((s) => s.is_active)
    .sort((a, b) => a.display_order - b.display_order) || [];

  // If no sections exist yet, show default layout as fallback
  const hasCustomSections = activeSections.length > 0;
  
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {sectionsLoading ? (
          <div className="py-32 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : hasCustomSections ? (
          // Render sections based on their display_order - FULLY MODULAR
          activeSections.map((section) => {
            const Component = sectionComponents[section.section_key];
            if (!Component) return null;

            // Core sections receive both section and service data
            if (coreSections.includes(section.section_key)) {
              return (
                <Component 
                  key={section.id} 
                  section={section} 
                  service={service} 
                />
              );
            }

            // Extra sections only receive section data
            return <Component key={section.id} data={section} />;
          })
        ) : (
          // Fallback: Show default layout if no sections configured
          <DefaultServiceLayout service={service} />
        )}

        {/* Always show related projects if available - even with custom sections */}
        {hasCustomSections && 
         !activeSections.some(s => s.section_key === 'projects') && 
         service.related_projects && 
         service.related_projects.length > 0 && (
          <ServiceProjectsSection 
            section={{ 
              id: 'auto-projects',
              page_slug: pageSlug,
              section_key: 'projects',
              title: 'Projekte të realizuara',
              subtitle: 'Shikoni disa nga projektet tona ku kemi ofruar këtë shërbim',
              content: null,
              image_url: null,
              gallery: null,
              button_text: null,
              button_url: null,
              display_order: 999,
              is_active: true,
              items: null,
            }} 
            service={service} 
          />
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

// Fallback component for services without configured sections
function DefaultServiceLayout({ service }: { service: any }) {
  const openWhatsApp = () => {
    const message = `Përshëndetje! Jam i interesuar për ${service.title}. Dëshiroj të marr më shumë informacion dhe një ofertë.`;
    const phone = "355686000626";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px]">
        <img
          src={service.hero_image || "/placeholder.svg"}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-16">
            <span className="inline-block text-primary-foreground/70 text-xs font-medium tracking-widest uppercase mb-4">
              Shërbimet tona
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-medium text-primary-foreground mb-4 tracking-tight">
              {service.title}
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl font-light max-w-2xl">
              {service.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-medium text-foreground mb-6">
            Përse të na zgjidhni?
          </h2>
          <div 
            className="prose prose-lg text-muted-foreground" 
            dangerouslySetInnerHTML={{ __html: service.description || '' }}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-medium text-primary-foreground mb-4">
            Gati për të filluar?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Na kontaktoni sot për një konsultim falas.
          </p>
          <Button size="lg" variant="secondary" onClick={openWhatsApp}>
            Kërko ofertë tani
          </Button>
        </div>
      </section>
    </>
  );
}

export default ServiceDetail;
