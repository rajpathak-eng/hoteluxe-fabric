import { useEffect, useState, useRef } from "react";
 import { usePageSection } from "@/hooks/usePageSections";

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
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

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

const TrustSection = () => {
   const { data: section } = usePageSection("home", "trust");
   const stats: StatItem[] = (section?.items as StatItem[]) || defaultStats;
 
  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <span className="typo-label text-muted-foreground mb-6">
             {section?.subtitle || "Numrat flasin"}
          </span>
          <h2 className="typo-h2 text-foreground mb-6">
             {section?.title || "Besueshmëri e provuar"}
          </h2>
          <p className="typo-body text-muted-foreground max-w-2xl mx-auto">
             {section?.content || "Përvojë e gjatë dhe mijëra klientë të kënaqur në të gjithë rajonin dëshmojnë për cilësinë e produkteve dhe shërbimeve tona."}
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group text-center p-8 md:p-12 cursor-default"
            >
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
};

export default TrustSection;
