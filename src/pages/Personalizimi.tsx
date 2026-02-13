import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SeoMetaHead } from "@/components/admin/SeoMetaHead";
import { usePageSections } from "@/hooks/usePageSections";
import { Loader2 } from "lucide-react";

// Dynamic section components - uses unified ServiceHero
import ServiceHero from "@/components/services/ServiceHero";
import PersonalizimServices from "@/components/personalizimi/PersonalizimServices";
import PersonalizimGallery from "@/components/personalizimi/PersonalizimGallery";
import PersonalizimBenefits from "@/components/personalizimi/PersonalizimBenefits";
import PersonalizimFAQ from "@/components/personalizimi/PersonalizimFAQ";
import PersonalizimTestimonials from "@/components/personalizimi/PersonalizimTestimonials";
import PersonalizimCTA from "@/components/personalizimi/PersonalizimCTA";

const sectionComponents: Record<string, React.FC<{ data: any }>> = {
  hero: ServiceHero,
  services: PersonalizimServices,
  gallery: PersonalizimGallery,
  benefits: PersonalizimBenefits,
  faq: PersonalizimFAQ,
  testimonials: PersonalizimTestimonials,
  cta: PersonalizimCTA,
};

const Personalizimi = () => {
  const { data: sections, isLoading } = usePageSections("personalizimi");

  const activeSections = sections
    ?.filter((s) => s.is_active)
    .sort((a, b) => a.display_order - b.display_order) || [];

  return (
    <div className="min-h-screen">
      <SeoMetaHead
        pageSlug="personalizimi"
        fallbackTitle="Tekstile të personalizuara për Hoteleri dhe Biznese | EMA Hotelling"
        fallbackDescription="Personalizojmë tekstile hoteliere dhe profesionale sipas identitetit të brand-it tuaj - çarçafë, peshqirë, uniforma dhe më shumë."
      />
      <Header />
      <main>
        {isLoading ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          activeSections.map((section) => {
            const Component = sectionComponents[section.section_key];
            if (!Component) return null;
            return <Component key={section.id} data={section} />;
          })
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Personalizimi;
