import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { PageSection } from "@/hooks/usePageSections";

interface FaqItem {
  question: string;
  answer: string;
}

interface PersonalizimFAQProps {
  data: PageSection;
}

const defaultFaqItems: FaqItem[] = [
  {
    question: "Çfarë lloj tekstilesh personalizoni?",
    answer: "Personalizojmë një gamë të gjerë tekstilesh hoteliere duke përfshirë çarçafë, peshqirë, perde, jastekë, jorganë, uniforma stafi, dhe aksesorë spa & wellness. Të gjitha produktet mund të personalizohen me logon, ngjyrat dhe dizajnin e brand-it tuaj."
  },
  {
    question: "Si funksionon procesi i personalizimit?",
    answer: "Procesi fillon me një konsultë falas ku diskutojmë nevojat tuaja. Më pas krijojmë mostra të produkteve të personalizuara për miratimin tuaj. Pasi të aprovohet dizajni, fillojmë prodhimin dhe dorëzimin sipas afatit të rënë dakord."
  },
  {
    question: "A mund t'i shtoj logon dhe ngjyrat e markës?",
    answer: "Absolutisht! Çdo produkt mund të personalizohet me logon tuaj, ngjyrat e brand-it, dhe elemente të tjera grafike. Ofrojmë konsulencë profesionale për të arritur rezultatin më të mirë vizual."
  },
  {
    question: "Cilat teknika përdorni (print, embroidery, etj.)?",
    answer: "Përdorim teknika të ndryshme varësisht nga produkti dhe dizajni i dëshiruar: qendisje (embroidery) për logo të qëndrueshme, printim dixhital për dizajne komplekse, printim tradicional për porosi të mëdha, dhe kombinime të teknikave për efekte speciale."
  },
  {
    question: "Sa kohë zgjat realizimi i porosisë?",
    answer: "Koha e realizimit varet nga sasia dhe kompleksiteti i personalizimit. Zakonisht, porositë standarde realizohen brenda 2-4 javësh. Për porosi urgjente ofrojmë opsione të përshpejtuara."
  },
  {
    question: "A ka minimum porosie?",
    answer: "Po, për produktet e personalizuara aplikohet një minimum porosie e cila varion sipas llojit të produktit. Kontaktoni për të marrë informacion specifik mbi sasitë minimale për produktin që ju intereson."
  },
  {
    question: "A mund të shoh mostra para porosisë së madhe?",
    answer: "Po, para çdo porosie të madhe krijojmë mostra fizike të produkteve të personalizuara. Kjo ju lejon të shihni dhe prekni cilësinë e materialeve dhe përfundimin e personalizimit para se të vendosni."
  }
];

const PersonalizimFAQ = ({ data }: PersonalizimFAQProps) => {
  const title = data?.title || "Pyetjet më të shpeshta";
  const subtitle = data?.subtitle || "FAQ";
  const content = data?.content || "Gjeni përgjigjet për pyetjet më të zakonshme rreth shërbimit të personalizimit.";
  const faqItems = (data?.items as FaqItem[]) || defaultFaqItems;

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

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background rounded-xl px-6 border-0 shadow-sm"
              >
                <AccordionTrigger className="text-left font-serif text-base md:text-lg font-medium hover:no-underline py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-light leading-relaxed pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default PersonalizimFAQ;
