import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useClients } from "@/hooks/useClients";
import { usePageSection } from "@/hooks/usePageSections";
import { Loader2 } from "lucide-react";
import { SeoMetaHead } from "@/components/admin/SeoMetaHead";

export default function Clients() {
  const { data: clients, isLoading } = useClients();
  const { data: heroSection } = usePageSection("klientet", "hero");
  const activeClients = clients?.filter((c) => c.is_active !== false);

  const title = heroSection?.title || "Klientët Tanë";
  const subtitle = heroSection?.subtitle || "Jemi krenarë që bashkëpunojmë me disa nga emrat më të njohur në industrinë e hotelerisë dhe shërbimeve.";

  return (
    <div className="min-h-screen">
      <SeoMetaHead
        pageSlug="klientet"
        fallbackTitle="Klientët - EMA Hotelling"
        fallbackDescription="Partnerimet tona me hotelet dhe bizneset kryesore."
      />
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header - same style as Projects page */}
          <div className="text-center mb-14">
            <span className="typo-label text-muted-foreground mb-6">
              Partnerët
            </span>
            <h1 className="typo-h1 text-foreground mb-4">
              {title}
            </h1>
            <p className="typo-body text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>

          {/* Clients Grid */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !activeClients?.length ? (
            <p className="text-center text-muted-foreground py-16">
              Nuk ka klientë për momentin.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
              {activeClients.map((client) => (
                <a
                  key={client.id}
                  href={client.website_url || undefined}
                  target={client.website_url ? "_blank" : undefined}
                  rel={client.website_url ? "noopener noreferrer" : undefined}
                  className="group flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card hover:shadow-md transition-all duration-300"
                >
                  {client.logo_url ? (
                    <img
                      src={client.logo_url}
                      alt={client.name}
                      className="h-16 md:h-20 w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-16 md:h-20 w-full rounded bg-muted flex items-center justify-center text-sm text-muted-foreground font-medium">
                      {client.name}
                    </div>
                  )}
                  <span className="text-sm font-medium text-foreground text-center truncate w-full">
                    {client.name}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
