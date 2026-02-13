import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import type { PageSection } from "@/hooks/usePageSections";

interface BusinessItem {
  name: string;
  logo?: string;
  industry: string;
}

interface PersonalizimTestimonialsProps {
  data: PageSection;
}

const defaultBusinesses: BusinessItem[] = [
  { name: "Hotel Melia Durrës", logo: "/placeholder.svg", industry: "Hoteleri 5-yjesh" },
  { name: "Restorant Artigiano", logo: "/placeholder.svg", industry: "Restorant" },
  { name: "Grand Hotel Tirana", logo: "/placeholder.svg", industry: "Hoteleri" },
  { name: "Spa & Wellness Oasis", logo: "/placeholder.svg", industry: "SPA & Wellness" },
  { name: "Boutique Hotel Adriatik", logo: "/placeholder.svg", industry: "Boutique Hotel" },
  { name: "Resort Divjaka", logo: "/placeholder.svg", industry: "Resort" }
];

const PersonalizimTestimonials = ({ data }: PersonalizimTestimonialsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const title = data?.title || "Bizneset që na besojnë";
  const subtitle = data?.subtitle || "Klientët tanë";
  const content = data?.content || "Bashkëpunojmë me hotele, restorante dhe biznese të ndryshme në të gjithë Shqipërinë.";
  const businesses = (data?.items as BusinessItem[]) || defaultBusinesses;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % businesses.length);
  }, [businesses.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + businesses.length) % businesses.length);
  }, [businesses.length]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(goToNext, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext]);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-muted-foreground font-medium text-xs tracking-widest uppercase mb-6 block">
            {subtitle}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-6 tracking-tight">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            {content}
          </p>
        </div>

        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div
              className="flex luxury-transition"
              style={{
                transform: `translateX(-${currentIndex * 25}%)`,
              }}
            >
              {businesses.map((business, index) => (
                <div
                  key={index}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 px-3"
                >
                  <div className="bg-secondary/30 rounded-2xl p-8 text-center hover:bg-secondary/50 luxury-transition group">
                    <div className="w-20 h-20 mx-auto mb-5 rounded-xl bg-background flex items-center justify-center overflow-hidden">
                      {business.logo && business.logo !== "/placeholder.svg" ? (
                        <img
                          src={business.logo}
                          alt={business.name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <Building2 className="w-10 h-10 text-muted-foreground" strokeWidth={1} />
                      )}
                    </div>
                    <h3 className="font-serif text-lg font-medium text-foreground mb-2">
                      {business.name}
                    </h3>
                    <p className="text-muted-foreground text-sm font-light">
                      {business.industry}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-background shadow-lg rounded-full flex items-center justify-center text-foreground hover:bg-secondary luxury-transition z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-background shadow-lg rounded-full flex items-center justify-center text-foreground hover:bg-secondary luxury-transition z-10"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
          </button>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 mt-10">
            {businesses.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`h-1 rounded-full luxury-transition ${
                  index === currentIndex
                    ? "bg-foreground w-8"
                    : "bg-border w-4 hover:bg-muted-foreground"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizimTestimonials;
