import Header from "@/components/Header";
import { SeoMetaHead } from "@/components/admin/SeoMetaHead";
import HeroSection from "@/components/HeroSection";
import DifferentiatorsSection from "@/components/DifferentiatorsSection";
import AboutSection from "@/components/AboutSection";
import ProductsSection from "@/components/ProductsSection";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import IndustriesCarousel from "@/components/IndustriesCarousel";
import PortfolioSection from "@/components/PortfolioSection";
import TrustSection from "@/components/TrustSection";
import ContactSection from "@/components/ContactSection";
import CertificationsSection from "@/components/CertificationsSection";
import VideoSection from "@/components/VideoSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { usePageSections } from "@/hooks/usePageSections";

const sectionComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroSection,
  differentiators: DifferentiatorsSection,
  about: AboutSection,
  products: ProductsSection,
  "featured-products": FeaturedProductsSection,
  industries: IndustriesCarousel,
  portfolio: PortfolioSection,
  trust: TrustSection,
  contact: ContactSection,
  certifications: CertificationsSection,
  video: VideoSection,
};

const Index = () => {
  const { data: sections, isLoading } = usePageSections("home");

  const renderSections = () => {
    if (isLoading) {
      return <HeroSection />;
    }

    if (!sections || sections.length === 0) {
      // Fallback: show default order if no DB sections
      return (
        <>
          <HeroSection />
          <DifferentiatorsSection />
          <AboutSection />
          <TrustSection />
          <ProductsSection />
          <FeaturedProductsSection />
          <IndustriesCarousel />
          <PortfolioSection />
          <ContactSection />
          <CertificationsSection />
        </>
      );
    }

    return sections.map((section) => {
      const Component = sectionComponents[section.section_key];
      if (!Component) return null;

      // Pass section data for components that accept it
      if (section.section_key === "video" || section.section_key === "featured-products") {
        return <Component key={section.id} section={section} />;
      }

      return <Component key={section.id} />;
    });
  };

  return (
    <div className="min-h-screen">
      <SeoMetaHead
        pageSlug="home"
        fallbackTitle="EMA Hotelling - Tekstile Premium për Hotele dhe Mikpritje"
        fallbackDescription="Furnizuesi kryesor i tekstileve premium për hotele, restorante dhe industrinë e mikpritjes në Shqipëri."
      />
      <Header />
      <main>
        {renderSections()}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
