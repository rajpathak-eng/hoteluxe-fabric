import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import hotelImage from "@/assets/industry-hotel.jpg";
import airbnbImage from "@/assets/industry-airbnb.jpg";
import restaurantImage from "@/assets/industry-restaurant.jpg";
import resortImage from "@/assets/industry-resort.jpg";
import guesthouseImage from "@/assets/industry-guesthouse.jpg";
import spaImage from "@/assets/industry-spa.jpg";

const industries = [
  {
    title: "Tekstile për hotele",
    description: "Zgjidhje premium për çdo ambient hoteli, nga dhomat e gjumit deri te spa.",
    image: hotelImage,
    href: "/sherbimet/tekstile-per-hotele",
  },
  {
    title: "Tekstile për Airbnb",
    description: "Kualitet hotelerie për pronë me qera afatshkurtër dhe boutique.",
    image: airbnbImage,
    href: "/sherbimet/tekstile-per-airbnb",
  },
  {
    title: "Tekstile për restorante",
    description: "Mbulesa tavoline dhe tekstile elegante për çdo ambient gastronomie.",
    image: restaurantImage,
    href: "/sherbimet/tekstile-per-restorante",
  },
  {
    title: "Tekstile për resorte",
    description: "Tekstile luksoze për resorte bregdetare dhe malore.",
    image: resortImage,
    href: "/sherbimet/tekstile-per-resorte",
  },
  {
    title: "Tekstile për bujtina",
    description: "Cilësi hotelerie për bujtina tradicionale dhe moderne.",
    image: guesthouseImage,
    href: "/sherbimet/tekstile-per-bujtina",
  },
  {
    title: "Tekstile për SPA",
    description: "Peshqirë, batanije dhe tekstile relaksi për qendra wellness.",
    image: spaImage,
    href: "/sherbimet/tekstile-per-spa",
  },
];

const IndustriesWeServe = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-muted-foreground font-medium text-xs tracking-widest uppercase mb-4 block">
            Sektorët
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4 tracking-tight">
            Industritë ku operojmë
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Ofrojmë tekstile profesionale për sektorët kryesorë të mikpritjes.
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
              <CarouselItem key={index} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <Link
                  to={industry.href}
                  className="group relative block overflow-hidden luxury-transition hover-lift h-full rounded-[15px]"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[15px]">
                    <img
                      src={industry.image}
                      alt={industry.title}
                      className="absolute inset-0 w-full h-full object-cover luxury-transition group-hover:scale-105 rounded-[15px]"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-80 group-hover:opacity-90 luxury-transition rounded-[15px]" />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="font-serif text-xl md:text-2xl font-semibold text-primary-foreground mb-2">
                      {industry.title}
                    </h3>
                    <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4 line-clamp-2">
                      {industry.description}
                    </p>
                    <span className="text-sm font-medium tracking-wide text-primary-foreground flex items-center gap-2 group/link">
                      Mëso më shumë
                      <ArrowRight className="w-4 h-4 luxury-transition group-hover/link:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0 h-12 w-12 border-border bg-background hover:bg-secondary" />
            <CarouselNext className="relative inset-0 translate-x-0 translate-y-0 h-12 w-12 border-border bg-background hover:bg-secondary" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default IndustriesWeServe;
