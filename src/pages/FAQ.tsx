import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SeoMetaHead } from "@/components/admin/SeoMetaHead";
import { usePublicFaqItems } from "@/hooks/useFaqItems";
import { usePageSection } from "@/hooks/usePageSections";
import { Skeleton } from "@/components/ui/skeleton";
 
const FAQ = () => {
  const { data: faqs, isLoading } = usePublicFaqItems();
  const { data: heroSection } = usePageSection("faq", "hero");
  const { data: ctaSection } = usePageSection("faq", "cta");
 
  return (
    <div className="min-h-screen">
      <SeoMetaHead
        pageSlug="faq"
        fallbackTitle="Pyetje të shpeshta (FAQ) - EMA Hotelling"
        fallbackDescription="Gjeni përgjigjet për pyetjet tuaja më të shpeshta rreth produkteve dhe shërbimeve tona."
      />
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <span className="typo-label text-muted-foreground mb-6">
              {heroSection?.subtitle || "Ndihmë"}
            </span>
            <h1 className="typo-h1 text-foreground mb-6">
              {heroSection?.title || "Pyetje të shpeshta (FAQ)"}
            </h1>
            <p className="typo-body text-muted-foreground max-w-2xl mx-auto">
              {heroSection?.content || "Gjeni përgjigjet për pyetjet më të zakonshme rreth produkteve, shërbimeve dhe procesit tonë të punës."}
            </p>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {faqs?.map((faq, index) => (
                    <AccordionItem key={faq.id} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="typo-h2 text-foreground mb-4">
              {ctaSection?.title || "Nuk gjeni përgjigjen që kërkoni?"}
            </h2>
            <p className="typo-body text-muted-foreground mb-8 max-w-xl mx-auto">
              {ctaSection?.content || "Na kontaktoni drejtpërdrejt dhe ekipi ynë do t'ju ndihmojë brenda 24 orëve."}
            </p>
            <Link to="/kontakt">
              <Button size="lg" className="rounded-full px-8">
                Na kontaktoni
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default FAQ;
