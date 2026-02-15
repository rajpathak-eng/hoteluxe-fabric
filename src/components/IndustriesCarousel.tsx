import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
 import { usePageSection } from "@/hooks/usePageSections";
import restaurantImage from "@/assets/industry-restaurant.jpg";
import hotelImage from "@/assets/industry-hotel.jpg";
import airbnbImage from "@/assets/industry-airbnb.jpg";
import resortImage from "@/assets/industry-resort.jpg";
import guesthouseImage from "@/assets/industry-guesthouse.jpg";
import spaImage from "@/assets/industry-spa.jpg";

 interface IndustryItem {
   title: string;
   description: string;
   href: string;
   image: string;
 }
 
 const imageMap: Record<string, string> = {
   "industry-hotel": hotelImage,
   "industry-restaurant": restaurantImage,
   "industry-airbnb": airbnbImage,
   "industry-resort": resortImage,
   "industry-guesthouse": guesthouseImage,
   "industry-spa": spaImage,
 };
 
 const defaultIndustries: IndustryItem[] = [
   { image: "industry-hotel", title: "Hotele", description: "Tekstile premium për hotele nga 2 deri 5 yje me cilësi të lartë.", href: "/sherbimet/tekstile-per-hotele" },
   { image: "industry-restaurant", title: "Restorante", description: "Mbulesa tavoline, peceta dhe tekstile kuzhine për çdo lloj restoranti.", href: "/sherbimet/tekstile-per-restorante" },
   { image: "industry-airbnb", title: "Airbnb", description: "Zgjidhje cilësore dhe ekonomike për apartamente turistike.", href: "/sherbimet/tekstile-per-airbnb" },
   { image: "industry-resort", title: "Resorte", description: "Tekstile luksoze për resorte bregdetare dhe malore.", href: "/sherbimet/tekstile-per-resorte" },
   { image: "industry-guesthouse", title: "Bujtina", description: "Cilësi hotelerie për bujtina tradicionale dhe moderne.", href: "/sherbimet/tekstile-per-bujtina" },
   { image: "industry-spa", title: "SPA & Wellness", description: "Peshqirë, batanije dhe tekstile relaksi për qendra wellness.", href: "/sherbimet/tekstile-per-spa" },
 ];

interface IndustriesCarouselProps {
  className?: string;
}

const IndustriesCarousel = ({ className = "" }: IndustriesCarouselProps) => {
  const { data: section, isLoading } = usePageSection("home", "industries");
  const industries: IndustryItem[] = section
    ? ((section.items as IndustryItem[]) || defaultIndustries)
    : defaultIndustries;
  const showImages = !isLoading;

  return (
    <section id="industries" className={`py-12 bg-background ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="typo-label text-muted-foreground mb-6">
             {section?.subtitle || "Industritë që shërbejmë"}
          </span>
          <h2 className="typo-h2 text-foreground mb-6">
             {section?.title || "Zgjidhje për çdo sektor"}
          </h2>
          <p className="typo-body text-muted-foreground max-w-2xl mx-auto">
             {section?.content || "Furnizojmë me tekstile profesionale biznese të ndryshme që kërkojnë cilësi të lartë dhe besueshmëri."}
          </p>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {industries.map((industry, index) => (
              <CarouselItem key={index} className="pl-4 basis-full md:basis-1/2 lg:basis-1/4">
                <Link
                  to={industry.href}
                  className="group relative block overflow-hidden bg-background luxury-transition hover-lift h-full rounded-[15px]"
                >
                  {/* Image Container - only show image after section loaded to avoid flash of old images */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[15px]">
                    {showImages ? (
                      <img
                        src={imageMap[industry.image] || industry.image}
                        alt={industry.title}
                        className="absolute inset-0 w-full h-full object-cover luxury-transition group-hover:scale-105 rounded-[15px]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-muted rounded-[15px]" aria-hidden />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent rounded-[15px]" />
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="typo-h3 text-primary-foreground mb-3 md:text-2xl">
                      {industry.title}
                    </h3>
                    <p className="typo-body-sm text-primary-foreground/80 mb-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 luxury-transition">
                      {industry.description}
                    </p>
                    <span className="text-sm font-medium tracking-wide text-primary-foreground opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 luxury-transition flex items-center gap-2 group/btn">
                      Shiko më shumë
                      <ArrowRight className="w-4 h-4 luxury-transition group-hover/btn:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation Arrows - Unified style */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0" />
            <CarouselNext className="relative inset-0 translate-x-0 translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default IndustriesCarousel;
