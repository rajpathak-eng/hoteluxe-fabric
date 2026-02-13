import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import type { PageSection } from "@/hooks/usePageSections";

interface ServiceItem {
  title: string;
  description: string;
  image?: string;
  link?: string;
}

interface PersonalizimServicesProps {
  data: PageSection;
}

const defaultServices: ServiceItem[] = [
  {
    title: "Çarçafë & mbulesa krevati me logo",
    description: "Çarçafë hotelerie me logon e brand-it tuaj të qendisur ose printuar me cilësi të lartë.",
    link: "/produktet/carcafe-mbulesa"
  },
  {
    title: "Jastekë, këllëfë jastëku & jorganë",
    description: "Jastekë dhe jorganë të personalizuara sipas standardeve të hotelit tuaj.",
    link: "/produktet/jasteke-jorgane"
  },
  {
    title: "Peshqirë hotelerie, spa & wellness",
    description: "Peshqirë premium me branding të plotë për hotele, spa dhe qendra wellness.",
    link: "/produktet/peshqire"
  },
  {
    title: "Perde & grila",
    description: "Perde dhe grila të dizajnuara sipas ambientit dhe nevojave të hapësirës suaj.",
    link: "/produktet/perde"
  },
  {
    title: "Dyshekë & mbrojtëse dysheku",
    description: "Dyshekë profesionalë dhe mbrojtëse të personalizuara për komoditet maksimal.",
    link: "/produktet/dysheke"
  }
];

const PersonalizimServices = ({ data }: PersonalizimServicesProps) => {
  const title = data?.title || "Çfarë ofrojmë për biznesin tuaj";
  const subtitle = data?.subtitle || "Shërbimet tona";
  const content = data?.content || "Ne personalizojmë tekstile hoteliere dhe profesionale sipas identitetit të brand-it tuaj.";
  const services = (data?.items as ServiceItem[]) || defaultServices;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="typo-label text-muted-foreground mb-6">
            {subtitle}
          </span>
          <h2 className="typo-h2 text-foreground mb-6">
            {title}
          </h2>
          <p className="typo-body text-muted-foreground max-w-2xl mx-auto">
            {content}
          </p>
        </div>

        {/* Options badge */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 rounded-full">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Opsione: print, qëndisje, ngjyra dhe përmasa të personalizuara
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.link || "#"}
              className="group bg-secondary/30 rounded-2xl overflow-hidden hover:shadow-xl luxury-transition"
            >
              {service.image && (
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 luxury-transition"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="typo-h3 text-foreground mb-3 group-hover:text-primary luxury-transition">
                  {service.title}
                </h3>
                <p className="typo-body-sm text-muted-foreground mb-4">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground group-hover:gap-3 luxury-transition">
                  Mëso më shumë
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PersonalizimServices;
