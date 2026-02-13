import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { usePublicProjects } from "@/hooks/useProjects";
import { usePageSection } from "@/hooks/usePageSections";
import { Skeleton } from "@/components/ui/skeleton";

const PortfolioSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { data: projects, isLoading } = usePublicProjects();
  const { data: section } = usePageSection("home", "portfolio");
 
  
  // Limit to maximum 4 projects on homepage
  const displayProjects = projects?.slice(0, 4) || [];
  const projectsLength = displayProjects.length;

  const goToNext = useCallback(() => {
    if (projectsLength === 0) return;
    setCurrentIndex((prev) => (prev + 1) % projectsLength);
  }, [projectsLength]);

  const goToPrev = useCallback(() => {
    if (projectsLength === 0) return;
    setCurrentIndex((prev) => (prev - 1 + projectsLength) % projectsLength);
  }, [projectsLength]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (!isAutoPlaying || projectsLength === 0) return;
    
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext, projectsLength]);
 
  // Reset index if projects change
  useEffect(() => {
    if (currentIndex >= projectsLength) {
      setCurrentIndex(0);
    }
  }, [projectsLength, currentIndex]);
 
  if (isLoading) {
    return (
      <section id="portfolio" className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Skeleton className="h-4 w-24 mx-auto mb-6" />
            <Skeleton className="h-12 w-64 mx-auto mb-6" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <Skeleton className="max-w-6xl mx-auto aspect-[16/9] rounded-[15px]" />
        </div>
      </section>
    );
  }
 
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section id="portfolio" className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="typo-label text-muted-foreground mb-6">
            {section?.subtitle || "Portfolio"}
          </span>
          <h2 className="typo-h2 text-foreground mb-6">
            {section?.title || "Projektet tona"}
          </h2>
          <p className="typo-body text-muted-foreground max-w-2xl mx-auto">
            {section?.content || "Shikoni disa nga projektet e suksesshme që kemi realizuar për klientët tanë."}
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Main Carousel */}
          <div className="relative overflow-hidden rounded-[15px]">
            <div 
              className="flex luxury-transition"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {displayProjects.map((item, index) => (
                <div
                  key={index}
                  className="min-w-full relative aspect-[16/9]"
                >
                  <img
                    src={item.hero_image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-[15px]"
                  />
                  {/* Elegant Gradient Overlay - Stronger on mobile for better readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-primary/10 md:from-primary md:via-primary/30 md:to-transparent rounded-[15px]" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-16">
                    <span className="inline-block text-primary-foreground/90 text-[10px] sm:text-xs font-medium tracking-widest uppercase mb-2 sm:mb-4">
                      {item.tag}
                    </span>
                    <h3 className="typo-h3 text-primary-foreground mb-2 sm:mb-3 sm:text-2xl md:text-3xl">
                      {item.title}
                    </h3>
                    <p className="typo-body-sm text-primary-foreground/90 mb-4 sm:mb-6 max-w-xl line-clamp-2">
                      {item.description}
                    </p>
                    <Link
                      to={`/projekte/${item.slug}`}
                      className="text-xs sm:text-sm font-medium tracking-wide text-primary-foreground flex items-center gap-2 group/btn hover:gap-3 luxury-transition"
                    >
                      Shiko projektin
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 luxury-transition" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - Hidden on mobile, visible on tablet+ */}
          <button
            onClick={goToPrev}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background luxury-transition z-10 rounded-full hidden sm:flex"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background luxury-transition z-10 rounded-full hidden sm:flex"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
          </button>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-3 mt-8">
            {displayProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-px luxury-transition ${
                  index === currentIndex 
                    ? "bg-foreground w-12" 
                    : "bg-border w-8 hover:bg-muted-foreground"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-8">
            <Link
              to={section?.button_url || "/projekte"}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-[15px] font-medium hover:bg-primary/90 transition-all duration-300"
            >
              {section?.button_text || "Shiko të gjitha projektet"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
