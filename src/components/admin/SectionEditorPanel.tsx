import { HeroSectionEditor } from "./section-editors/HeroSectionEditor";
import { HeroHomepageSectionEditor } from "./section-editors/HeroHomepageSectionEditor";
import { DifferentiatorsSectionEditor } from "./section-editors/DifferentiatorsSectionEditor";
import { TrustSectionEditor } from "./section-editors/TrustSectionEditor";
import { IndustriesSectionEditor } from "./section-editors/IndustriesSectionEditor";
import { CertificationsSectionEditor } from "./section-editors/CertificationsSectionEditor";
import { ProductsSectionEditor } from "./section-editors/ProductsSectionEditor";
import { PortfolioSectionEditor } from "./section-editors/PortfolioSectionEditor";
import { AboutSectionEditor } from "./section-editors/AboutSectionEditor";
import { ContactSectionEditor } from "./section-editors/ContactSectionEditor";
import { CtaSectionEditor } from "./section-editors/CtaSectionEditor";
import { GenericSectionEditor } from "./section-editors/GenericSectionEditor";
import { ServicesSectionEditor } from "./section-editors/ServicesSectionEditor";
import { GallerySectionEditor } from "./section-editors/GallerySectionEditor";
import { BenefitsSectionEditor } from "./section-editors/BenefitsSectionEditor";
import { FaqSectionEditor } from "./section-editors/FaqSectionEditor";
import { TestimonialsSectionEditor } from "./section-editors/TestimonialsSectionEditor";
import { HistorySectionEditor } from "./section-editors/HistorySectionEditor";
import { CommitmentSectionEditor } from "./section-editors/CommitmentSectionEditor";
import { AboutProductsSectionEditor } from "./section-editors/AboutProductsSectionEditor";
import { AboutIndustriesSectionEditor } from "./section-editors/AboutIndustriesSectionEditor";
import { FeaturedProductsSectionEditor } from "./section-editors/FeaturedProductsSectionEditor";
import { VideoSectionEditor } from "./section-editors/VideoSectionEditor";
import { PageSection } from "@/hooks/useCms";

interface SectionEditorPanelProps {
  sectionKey: string;
  form: Partial<PageSection>;
  setForm: (form: Partial<PageSection>) => void;
  pageSlug?: string;
}

export function SectionEditorPanel({ sectionKey, form, setForm, pageSlug }: SectionEditorPanelProps) {
  // About page uses specialized editors for products/industries
  if (pageSlug === "about") {
    switch (sectionKey) {
      case "products":
        return <AboutProductsSectionEditor form={form} setForm={setForm} />;
      case "industries":
        return <AboutIndustriesSectionEditor form={form} setForm={setForm} />;
    }
  }

  switch (sectionKey) {
    case "hero":
      return <HeroSectionEditor form={form} setForm={setForm} />;
    case "hero-homepage":
      return <HeroHomepageSectionEditor form={form} setForm={setForm} />;
    case "differentiators":
      return <DifferentiatorsSectionEditor form={form} setForm={setForm} />;
    case "trust":
      return <TrustSectionEditor form={form} setForm={setForm} />;
    case "industries":
      return <IndustriesSectionEditor form={form} setForm={setForm} />;
    case "certifications":
      return <CertificationsSectionEditor form={form} setForm={setForm} />;
    case "products":
      return <ProductsSectionEditor form={form} setForm={setForm} />;
    case "portfolio":
      return <PortfolioSectionEditor form={form} setForm={setForm} />;
    case "about":
      return <AboutSectionEditor form={form} setForm={setForm} />;
    case "contact":
      return <ContactSectionEditor form={form} setForm={setForm} />;
    case "cta":
      return <CtaSectionEditor form={form} setForm={setForm} />;
    case "services":
      return <ServicesSectionEditor form={form} setForm={setForm} />;
    case "gallery":
      return <GallerySectionEditor form={form} setForm={setForm} />;
    case "benefits":
      return <BenefitsSectionEditor form={form} setForm={setForm} />;
    case "faq":
      return <FaqSectionEditor form={form} setForm={setForm} />;
    case "testimonials":
      return <TestimonialsSectionEditor form={form} setForm={setForm} />;
    case "history":
      return <HistorySectionEditor form={form} setForm={setForm} />;
    case "commitment":
      return <CommitmentSectionEditor form={form} setForm={setForm} />;
    case "featured-products":
      return <FeaturedProductsSectionEditor form={form} setForm={setForm} />;
    case "video":
      return <VideoSectionEditor form={form} setForm={setForm} />;
    default:
      return <GenericSectionEditor form={form} setForm={setForm} />;
  }
}
