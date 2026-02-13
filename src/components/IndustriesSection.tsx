import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import restaurantImage from "@/assets/industry-restaurant.jpg";
import hotelImage from "@/assets/industry-hotel.jpg";
import airbnbImage from "@/assets/industry-airbnb.jpg";
import resortImage from "@/assets/industry-resort.jpg";
import guesthouseImage from "@/assets/industry-guesthouse.jpg";
import spaImage from "@/assets/industry-spa.jpg";

const industries = [
  {
    image: hotelImage,
    title: "Hotele",
    description: "Tekstile premium për hotele nga 2 deri 5 yje me cilësi të lartë.",
    href: "/sherbimet/tekstile-per-hotele",
  },
  {
    image: restaurantImage,
    title: "Restorante",
    description: "Mbulesa tavoline, peceta dhe tekstile kuzhine për çdo lloj restoranti.",
    href: "/sherbimet/tekstile-per-restorante",
  },
  {
    image: airbnbImage,
    title: "Airbnb",
    description: "Zgjidhje cilësore dhe ekonomike për apartamente turistike.",
    href: "/sherbimet/tekstile-per-airbnb",
  },
  {
    image: resortImage,
    title: "Resorte",
    description: "Tekstile luksoze për resorte bregdetare dhe malore.",
    href: "/sherbimet/tekstile-per-resorte",
  },
  {
    image: guesthouseImage,
    title: "Bujtina",
    description: "Cilësi hotelerie për bujtina tradicionale dhe moderne.",
    href: "/sherbimet/tekstile-per-bujtina",
  },
  {
    image: spaImage,
    title: "SPA & Wellness",
    description: "Peshqirë, batanije dhe tekstile relaksi për qendra wellness.",
    href: "/sherbimet/tekstile-per-spa",
  },
];

const IndustriesSection = () => {
  return (
    <section id="industries" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-muted-foreground font-medium text-xs tracking-widest uppercase mb-6 block">
            Industritë që Shërbejmë
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-6 tracking-tight">
            Zgjidhje për Çdo Sektor
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Furnizojmë me tekstile profesionale biznese të ndryshme që kërkojnë 
            cilësi të lartë dhe besueshmëri.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <Link
              key={index}
              to={industry.href}
              className="group relative overflow-hidden bg-background luxury-transition hover-lift rounded-[15px]"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-[15px]">
                <img
                  src={industry.image}
                  alt={industry.title}
                  className="absolute inset-0 w-full h-full object-cover luxury-transition group-hover:scale-105 rounded-[15px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent rounded-[15px]" />
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-serif text-3xl font-medium text-primary-foreground mb-3">
                  {industry.title}
                </h3>
                <p className="text-primary-foreground/80 text-sm leading-relaxed font-light mb-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 luxury-transition">
                  {industry.description}
                </p>
                <span className="text-sm font-medium tracking-wide text-primary-foreground opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 luxury-transition flex items-center gap-2 group/btn">
                  Shiko më shumë
                  <ArrowRight className="w-4 h-4 luxury-transition group-hover/btn:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
