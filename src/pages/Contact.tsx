import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SeoMetaHead } from "@/components/admin/SeoMetaHead";
import { usePageSection } from "@/hooks/usePageSections";
import { useFooterSettings } from "@/hooks/useSiteSettings";
import { SocialLinks } from "@/components/SocialLinks";

const Contact = () => {
  const { data: heroSection } = usePageSection("contact", "hero");
  const { data: infoSection } = usePageSection("contact", "info");
  const { data: footerSettings } = useFooterSettings();
 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Faleminderit! Mesazhi juaj u dërgua me sukses. Do t'ju kontaktojmë së shpejti.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  // Get contact info from footer settings or use defaults
  const contactEmail = footerSettings?.email || "info@emahotelling.com";
  const contactPhone = footerSettings?.phone || "+355 68 600 0626";
  const contactAddress = footerSettings?.address || "Tiranë, Shqipëri";
 
  const contactItems = [
    {
      icon: Mail,
      title: "Email",
      value: contactEmail,
      href: `mailto:${contactEmail}`,
    },
    {
      icon: Phone,
      title: "Telefon",
      value: contactPhone,
      href: `tel:${contactPhone.replace(/\s/g, '')}`,
    },
    {
      icon: MapPin,
      title: "Adresa",
      value: contactAddress,
    },
  ];

 return (
   <div className="min-h-screen">
     <SeoMetaHead
       pageSlug="contact"
       fallbackTitle="Kontakti EMA Hotelling – Tekstile për Hotele, Restorante dhe Airbnb"
       fallbackDescription="Na kontaktoni për çdo pyetje, kërkesë ose informacion mbi tekstilet tona për hotele, restorante dhe Airbnb. Ekipi ynë profesional është gati t'ju ndihmojë."
     />
     <Header />
     <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="typo-label text-muted-foreground mb-4">
                {heroSection?.subtitle || "Kontakti"}
              </span>
              <h1 className="typo-h1 text-foreground mb-6">
                {heroSection?.title || "Na kontaktoni"}
              </h1>
              <p className="typo-body text-muted-foreground md:text-lg">
                {heroSection?.content || "Jemi këtu për t'ju ndihmuar! EMA Hotelling ofron shërbim profesional për çdo pyetje mbi produktet dhe zgjidhjet tona të tekstileve për hotele, restorante dhe Airbnb."}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Contact Info */}
              <div>
                <h2 className="typo-h2 text-foreground mb-6">
                  {infoSection?.title || "Informacion kontakti"}
                </h2>
                <p className="typo-body text-muted-foreground mb-8">
                  {infoSection?.content || "Përmes kësaj faqeje mund të na kontaktoni direkt. Gjithashtu, mund të përdorni formularin për të dërguar mesazh direkt te ekipi ynë. Ne do t'ju kthejmë përgjigje sa më shpejt të jetë e mundur."}
                </p>
                
                <div className="space-y-6">
                  {contactItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className={`flex items-center gap-5 group ${item.href ? "cursor-pointer" : "cursor-default"}`}
                    >
                      <div className="w-14 h-14 flex items-center justify-center bg-background rounded-lg text-muted-foreground luxury-transition group-hover:text-foreground border border-border">
                        <item.icon className="w-6 h-6" strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="font-medium text-sm tracking-wide text-foreground">{item.title}</div>
                        <div className="text-muted-foreground font-light luxury-transition group-hover:text-foreground">
                          {item.value}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Social Links */}
                <div className="pt-6 mt-6 border-t border-border/50">
                  <h3 className="font-medium text-sm tracking-wide text-foreground mb-4">Na ndiqni në rrjetet sociale</h3>
                  <SocialLinks variant="dark" iconClassName="w-10 h-10 flex items-center justify-center bg-background rounded-lg border border-border hover:bg-muted" />
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="bg-background p-8 md:p-12 border border-border/50">
                <h3 className="typo-h3 text-foreground mb-6">
                  Dërgo mesazh
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm tracking-wide">Emri i plotë *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Emri juaj i plotë"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="border-border/50 bg-background focus:border-foreground luxury-transition"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm tracking-wide">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@shembull.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="border-border/50 bg-background focus:border-foreground luxury-transition"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm tracking-wide">Numri i telefonit (opsional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+355 69 XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="border-border/50 bg-background focus:border-foreground luxury-transition"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm tracking-wide">Mesazhi / Pyetja *</Label>
                    <Textarea
                      id="message"
                      placeholder="Shkruani mesazhin ose pyetjen tuaj..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="border-border/50 bg-background focus:border-foreground luxury-transition resize-none"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    className="w-full luxury-transition"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Duke dërguar...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" strokeWidth={1.5} />
                        Dërgo mesazhin
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contact;
