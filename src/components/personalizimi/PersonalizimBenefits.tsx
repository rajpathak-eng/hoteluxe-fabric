import { Award, Palette, HeadphonesIcon, Truck, LucideIcon } from "lucide-react";
import type { PageSection } from "@/hooks/usePageSections";

interface BenefitItem {
  icon?: string;
  title: string;
  description: string;
}

interface PersonalizimBenefitsProps {
  data: PageSection;
}

const iconMap: Record<string, LucideIcon> = {
  Award,
  Palette,
  HeadphonesIcon,
  Truck,
};

const defaultBenefits: BenefitItem[] = [
  {
    icon: "Award",
    title: "Materiale premium dhe cilësi e garantuar",
    description: "Përdorim vetëm materiale të cilësisë së lartë që garantojnë qëndrueshmëri dhe komoditet."
  },
  {
    icon: "Palette",
    title: "Dizajn unik për çdo biznes",
    description: "Krijojmë dizajne të personalizuara që pasqyrojnë identitetin e markës suaj."
  },
  {
    icon: "HeadphonesIcon",
    title: "Mbështetje e shpejtë dhe komunikim direkt",
    description: "Ekipi ynë është gjithmonë i gatshëm t'ju ndihmojë në çdo hap të procesit."
  },
  {
    icon: "Truck",
    title: "Porosi fleksibile dhe transport i shpejtë",
    description: "Ofrojmë fleksibilitet në porosi dhe dorëzim të shpejtë në të gjithë Shqipërinë."
  }
];

const PersonalizimBenefits = ({ data }: PersonalizimBenefitsProps) => {
  const title = data?.title || "Pse të zgjidhni Ema Hotelling?";
  const subtitle = data?.subtitle || "Përfitimet";
  const content = data?.content || "Me mbi 10 vite eksperiencë në industrinë e tekstileve, ofrojmë zgjidhje të plota për biznesin tuaj.";
  const benefits = (data?.items as BenefitItem[]) || defaultBenefits;

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

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => {
            const IconComponent = iconMap[benefit.icon || "Award"] || Award;
            return (
              <div
                key={index}
                className="flex gap-5 p-6 rounded-2xl bg-background border border-border hover:border-foreground/20 luxury-transition group"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 luxury-transition">
                    <IconComponent className="w-7 h-7 text-foreground" strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <h3 className="typo-h3 text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="typo-body-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PersonalizimBenefits;
