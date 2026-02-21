import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import HeroHomepage from "@/components/HeroHomepage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { usePageSections, PageSection } from "@/hooks/usePageSections";
import { Skeleton } from "@/components/ui/skeleton";
import { SeoMetaHead } from "@/components/admin/SeoMetaHead";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState, useRef } from "react";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";

interface ProductGridItem {
  image: string;
  label: string;
  alt: string;
  slug?: string;
  href?: string;
}

interface IndustryItem {
  title: string;
  description: string;
  image: string;
  href: string;
}

interface CommitmentItem {
  title: string;
  description: string;
}

interface BadgeItem {
  number: string;
  label: string;
}

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const defaultStats: StatItem[] = [
  { value: 10, suffix: "+", label: "Vite eksperiencë" },
  { value: 500, suffix: "+", label: "Klientë të kënaqur" },
  { value: 50, suffix: "+", label: "Bashkëpunime ndërkombëtare" },
  { value: 100, suffix: "%", label: "Standarde profesionale" },
];

const CounterAnimation = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div ref={ref} className="font-serif text-5xl sm:text-6xl md:text-7xl font-medium text-foreground luxury-transition group-hover:text-muted-foreground">
      {count}{suffix}
    </div>
  );
};

// Section renderers keyed by section_key
function renderSection(section: PageSection) {
  switch (section.section_key) {
    case "hero":
      return <AboutHero key={section.id} section={section} />;
    case "hero-homepage":
      return <HeroHomepage key={section.id} section={section} />;
    case "trust":
      return <AboutTrust key={section.id} section={section} />;
    case "history":
      return <AboutHistory key={section.id} section={section} />;
    case "products":
      return <AboutProducts key={section.id} section={section} />;
    case "industries":
      return <AboutIndustries key={section.id} section={section} />;
    case "commitment":
      return <AboutCommitment key={section.id} section={section} />;
    case "featured-products":
      return <FeaturedProductsSection key={section.id} section={section} />;
    case "cta":
      return <AboutCta key={section.id} section={section} />;
    default:
      return null;
  }
}

function getAboutHeroOverlay(items: PageSection["items"]) {
  const obj = items && typeof items === "object" && !Array.isArray(items) ? (items as Record<string, unknown>) : {};
  return {
    enabled: obj.overlay_enabled !== false,
    opacity: typeof obj.overlay_opacity === "number" ? Math.min(100, Math.max(0, obj.overlay_opacity)) / 100 : 0.5,
  };
}

function AboutHero({ section }: { section: PageSection }) {
  const overlay = getAboutHeroOverlay(section.items);

  return (
    <section className="relative h-[70vh] min-h-[500px] bg-background overflow-hidden">
      {section.image_url && (
        <>
          <img src={section.image_url} alt={section.title || ""} className="absolute inset-0 w-full h-full object-cover" />
          {overlay.enabled && (
            <div
              className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-primary"
              style={{ opacity: overlay.opacity }}
            />
          )}
        </>
      )}
      <div className="absolute inset-0 flex items-center">
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className={`typo-label mb-4 ${section.image_url ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
              {section.subtitle || "Rreth nesh"}
            </span>
            <h1 className={`typo-h1 mb-6 ${section.image_url ? "text-primary-foreground" : "text-foreground"}`}>
              {section.title || "Zgjidhje tekstilesh profesionale për Biznesin tuaj"}
            </h1>
            <p className={`typo-body max-w-3xl mx-auto md:text-lg ${section.image_url ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
              {section.content || ""}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutTrust({ section }: { section: PageSection }) {
  const stats: StatItem[] = (section.items as StatItem[]) || defaultStats;
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="typo-label text-muted-foreground mb-6">
            {section.subtitle || "Numrat flasin"}
          </span>
          <h2 className="typo-h2 text-foreground mb-6">
            {section.title || "Besueshmëri e provuar"}
          </h2>
          <p className="typo-body text-muted-foreground max-w-2xl mx-auto">
            {section.content || ""}
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="group text-center p-8 md:p-12 cursor-default">
              <CounterAnimation value={stat.value} suffix={stat.suffix} />
              <div className="text-muted-foreground mt-3 font-medium text-sm tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutHistory({ section }: { section: PageSection }) {
  const historyBadge = (section.items as unknown as BadgeItem) || null;
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="typo-label text-muted-foreground mb-4">
              {section.subtitle || "Historia jonë"}
            </span>
            <h2 className="typo-h2 text-foreground mb-6">
              {section.title || ""}
            </h2>
            {section.content ? (
              <div
                className="text-muted-foreground leading-relaxed font-light prose prose-p:mb-6 prose-p:font-light"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed font-light">Plotëso përmbajtjen nga dashboard.</p>
            )}
          </div>
          <div className="relative">
            {section.image_url ? (
              <div className="aspect-square overflow-hidden rounded-[15px]">
                <img src={section.image_url} alt={section.title || ""} className="w-full h-full object-cover rounded-[15px]" />
              </div>
            ) : (
              <div className="aspect-square bg-background rounded-[15px] flex items-center justify-center border border-border">
                <span className="text-muted-foreground text-sm">Ngarko imazhin nga dashboard</span>
              </div>
            )}
            {historyBadge?.number && (
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 hidden md:block">
                <div className="text-4xl font-serif font-medium">{historyBadge.number}</div>
                <div className="text-sm font-light">{historyBadge.label}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutProducts({ section }: { section: PageSection }) {
  const productItems: ProductGridItem[] = Array.isArray(section.items) ? section.items as ProductGridItem[] : [];
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="typo-label text-muted-foreground mb-4">
            {section.subtitle || "Çfarë ofrojmë"}
          </span>
          <h2 className="typo-h2 text-foreground mb-6">
            {section.title || ""}
          </h2>
          <p className="typo-body text-muted-foreground">
            {section.content || ""}
          </p>
        </div>

        {productItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {productItems.map((product, index) => {
              const linkTo = product.href || (product.slug ? `/produktet/${product.slug}` : null);
              const content = (
                <>
                  <img src={product.image} alt={product.alt || product.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-[15px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="font-medium text-sm">{product.label}</span>
                  </div>
                </>
              );
              return linkTo ? (
                <Link key={index} to={linkTo} className="group relative aspect-square overflow-hidden rounded-[15px] block">
                  {content}
                </Link>
              ) : (
                <div key={index} className="group relative aspect-square overflow-hidden rounded-[15px]">
                  {content}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">Shtoni produktet nga dashboard.</p>
        )}

        {section.button_text && (
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link to={section.button_url || "/produktet"}>
                {section.button_text}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function AboutIndustries({ section }: { section: PageSection }) {
  const industryItems: IndustryItem[] = Array.isArray(section.items) ? section.items as IndustryItem[] : [];
  if (industryItems.length === 0) return null;
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="typo-label text-muted-foreground mb-4">
            {section.subtitle || "Sektorët"}
          </span>
          <h2 className="typo-h2 text-foreground mb-4">
            {section.title || ""}
          </h2>
          <p className="typo-body text-muted-foreground max-w-2xl mx-auto">
            {section.content || ""}
          </p>
        </div>
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {industryItems.map((industry, index) => (
              <CarouselItem key={index} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <Link to={industry.href || "#"} className="group relative block overflow-hidden luxury-transition hover-lift h-full rounded-[15px]">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[15px]">
                    <img src={industry.image} alt={industry.title} className="absolute inset-0 w-full h-full object-cover luxury-transition group-hover:scale-105 rounded-[15px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-80 group-hover:opacity-90 luxury-transition rounded-[15px]" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="typo-h3 text-primary-foreground mb-2 md:text-2xl">{industry.title}</h3>
                    <p className="typo-body-sm text-primary-foreground/70 mb-4 line-clamp-2">{industry.description}</p>
                    <span className="text-sm font-medium tracking-wide text-primary-foreground flex items-center gap-2">
                      Mëso më shumë <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-center gap-4 mt-8">
            <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0 h-12 w-12 border-border bg-background hover:bg-secondary" />
            <CarouselNext className="relative inset-0 translate-x-0 translate-y-0 h-12 w-12 border-border bg-background hover:bg-secondary" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}

function AboutCommitment({ section }: { section: PageSection }) {
  const commitmentItems: CommitmentItem[] = Array.isArray(section.items) ? section.items as CommitmentItem[] : [];
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="typo-label text-muted-foreground mb-4">
            {section.subtitle || "Përkushtimi ynë"}
          </span>
          <h2 className="typo-h2 text-foreground mb-6">
            {section.title || ""}
          </h2>
          <p className="typo-body text-muted-foreground md:text-lg mb-8">
            {section.content || ""}
          </p>
          {commitmentItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {commitmentItems.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-background rounded-full border border-border">
                    <span className="font-serif text-2xl font-medium text-foreground">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="typo-h3 text-foreground mb-2">{item.title}</h3>
                  <p className="typo-body-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function AboutCta({ section }: { section: PageSection }) {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="typo-h2 mb-6">
            {section.title || ""}
          </h2>
          <p className="typo-body text-primary-foreground/80 md:text-lg mb-8">
            {section.content || ""}
          </p>
          {section.button_text && (
            <Button asChild variant="secondary" size="xl">
              <Link to={section.button_url || "/merr-nje-oferte"}>
                {section.button_text}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

const About = () => {
  const { data: sections, isLoading } = usePageSections("about");

  return (
    <div className="min-h-screen">
      <SeoMetaHead
        pageSlug="about"
        fallbackTitle="Rreth Nesh – EMA Hotelling | Tekstile për Hotele, Produkte Hoteleri, Horeca"
        fallbackDescription="EMA Hotelling është furnitor profesional i tekstileve për hotele, restorante dhe Airbnb."
      />
      <Header />
      <main>
        {isLoading ? (
          <div className="pt-32 pb-20 container mx-auto px-4">
            <Skeleton className="h-12 w-2/3 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>
        ) : (
          sections?.map(section => renderSection(section))
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default About;
