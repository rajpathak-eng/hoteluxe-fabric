import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero-hotel.jpg";
import { usePageSection } from "@/hooks/usePageSections";

const HERO_SLIDE_INTERVAL_MS = 5000;

const HeroSection = () => {
  const { data: section, isLoading } = usePageSection("home", "hero");
  const { data: sectionHomepage } = usePageSection("home", "hero-homepage");

  const images = useMemo(() => {
    const fromHomepage = Array.isArray(sectionHomepage?.items)
      ? (sectionHomepage.items as { image_url?: string }[])
          .map((s) => s?.image_url)
          .filter((url): url is string => !!url)
      : [];
    if (fromHomepage.length > 0) return fromHomepage;
    if (section?.image_url) return [section.image_url];
    if (Array.isArray(section?.gallery) && section.gallery.length > 0) return section.gallery;
    return [heroImage];
  }, [section?.image_url, section?.gallery, sectionHomepage?.items]);

  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % images.length);
    }, HERO_SLIDE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [images.length]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const title = section?.title || sectionHomepage?.title || "Tekstile Premium për Hotele, Restorante & Airbnb";
  const content = section?.content || sectionHomepage?.content || "EMA Hotelling është furnitor i specializuar në tekstile për hotele, restorante dhe njësi Airbnb, duke kombinuar cilësinë premium, dizajnin modern dhe standardet më të larta të industrisë HoReCa.";
  const showImage = !isLoading;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background: single image or slider */}
      {showImage && images.length === 1 && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${images[0]})`,
            backgroundColor: "hsl(var(--primary))",
          }}
        />
      )}
      {showImage && images.length > 1 && (
        <>
          {images.map((url, i) => (
            <div
              key={i}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
              style={{
                backgroundImage: `url(${url})`,
                backgroundColor: "hsl(var(--primary))",
                opacity: i === currentIndex ? 1 : 0,
                zIndex: i === currentIndex ? 0 : -1,
              }}
              aria-hidden={i !== currentIndex}
            />
          ))}
        </>
      )}
      {!showImage && (
        <div className="absolute inset-0 bg-primary" />
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/50 to-primary/70 z-[1]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block text-primary-foreground/80 text-sm tracking-wider uppercase mb-6 animate-fade-up">
            ​
          </span>
          <h1 className="typo-h1 text-primary-foreground mb-8 animate-fade-up-delay-1">
            {title}
          </h1>
          <p className="typo-body text-primary-foreground/90 mb-12 tracking-wide animate-fade-up-delay-2 md:text-lg">
            {content}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-up-delay-3">
            <Button variant="default" size="xl" onClick={() => scrollToSection("contact")} className="group luxury-transition hover:shadow-2xl bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Kërko ofertë
              <ArrowRight className="w-5 h-5 luxury-transition group-hover:translate-x-1" />
            </Button>
            
            <Button variant="heroOutline" size="xl" onClick={() => scrollToSection("contact")} className="group luxury-transition border-primary-foreground/40 hover:border-primary-foreground">
              <Phone className="w-5 h-5 luxury-transition group-hover:scale-110" />
              Na kontakto
            </Button>
          </div>
        </div>
      </div>

      {showImage && images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-2 md:left-4 bottom-24 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/35 transition-colors touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
            aria-label="Slide paraardhës"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => (i + 1) % images.length)}
            className="absolute right-2 md:right-4 bottom-24 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/35 transition-colors touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
            aria-label="Slide tjetër"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className="h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/50"
                style={{
                  width: i === currentIndex ? 24 : 8,
                  backgroundColor: i === currentIndex ? "hsl(var(--primary-foreground))" : "hsl(var(--primary-foreground) / 0.4)",
                }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSection;