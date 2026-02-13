import { Award, Wallet, Sparkles, Clock } from "lucide-react";
 import { usePageSection } from "@/hooks/usePageSections";
 import { LucideIcon } from "lucide-react";

 interface DifferentiatorItem {
   icon: string;
   title: string;
   description: string;
 }
 
 const iconMap: Record<string, LucideIcon> = {
   Award,
   Wallet,
   Sparkles,
   Clock,
 };
 
 const defaultItems: DifferentiatorItem[] = [
   { icon: "Award", title: "Cilësi industriale hotelerie", description: "Tekstile të certifikuara që plotësojnë standardet më të larta të industrisë së mikpritjes" },
   { icon: "Wallet", title: "Çmime konkurruese B2B", description: "Ofrojmë çmime të favorshme për biznese me sasi të mëdha dhe bashkëpunime afatgjata" },
   { icon: "Sparkles", title: "Produkte të personalizuara", description: "Mundësi loguara dhe personalizimi sipas kërkesave specifike të biznesit tuaj" },
   { icon: "Clock", title: "Eksperiencë 10+ vite", description: "Dekada përvojë në furnizimin e hoteleve dhe objekteve të mikpritjes në rajon" },
 ];

const DifferentiatorsSection = () => {
   const { data: section } = usePageSection("home", "differentiators");
   const items: DifferentiatorItem[] = (section?.items as DifferentiatorItem[]) || defaultItems;
 
  return (
     <section className="py-10 bg-background">
       <div className="container mx-auto px-4 text-center mb-8">
          <span className="typo-label text-muted-foreground mb-4">
           {section?.subtitle || "Pse ne"}
          </span>
          <h2 className="typo-h2 text-foreground">
            {section?.title || "Pse të zgjidhni ne?"}
         </h2>
       </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
           {items.map((item, index) => {
             const IconComponent = iconMap[item.icon] || Award;
             return (
               <div
              key={index}
              className="text-center p-8 md:p-10 bg-background rounded-sm border border-border/50 hover:border-border luxury-transition group cursor-default hover-lift"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted text-foreground mb-8 luxury-transition group-hover:bg-primary group-hover:text-primary-foreground">
                   <IconComponent className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="typo-h3 text-foreground mb-4">
                {item.title}
              </h3>
              <p className="typo-body-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
               );
           })}
        </div>
      </div>
    </section>
  );
};

export default DifferentiatorsSection;
