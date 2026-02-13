import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Send, Phone, Mail, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
 import { usePageSection } from "@/hooks/usePageSections";

const ContactSection = () => {
   const { data: section } = usePageSection("home", "contact");
 
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
    message: "",
    gdprConsent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.gdprConsent) {
      toast.error("Ju lutem pranoni politikën e privatësisë");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Faleminderit! Mesazhi juaj u dërgua me sukses. Do t'ju kontaktojmë së shpejti.");
    setFormData({
      name: "",
      business: "",
      email: "",
      phone: "",
      message: "",
      gdprConsent: false,
    });
    setIsSubmitting(false);
  };

  // Get contact info from CMS or use defaults
  const contactInfo = (section?.items as { phone?: string; email?: string; address?: string; working_hours?: string }) || {};
  const phone = contactInfo.phone || "+355 69 XXX XXXX";
  const email = contactInfo.email || "info@emahotelling.al";
  const address = contactInfo.address || "Tiranë, Shqipëri";
  const workingHours = contactInfo.working_hours;

  const contactItems = [
    {
      icon: Phone,
      title: "Telefon",
      value: phone,
      href: `tel:${phone.replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      title: "Email",
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: MapPin,
      title: "Adresa",
      value: address,
    },
    ...(workingHours ? [{
      icon: Clock,
      title: "Orari",
      value: workingHours,
    }] : []),
  ];

  return (
    <section id="contact" className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Info */}
          <div>
            <span className="typo-label text-muted-foreground mb-6">
               {section?.subtitle || "Na kontaktoni"}
            </span>
            <h2 className="typo-h2 text-foreground mb-8">
               {section?.title || "Kërkoni ofertën tuaj"}
            </h2>
            <p className="typo-body text-muted-foreground mb-12">
               {section?.content || "Plotësoni formularin e mëposhtëm dhe ekipi ynë do t'ju kontaktojë brenda 24 orëve me një ofertë të personalizuar sipas nevojave të biznesit tuaj."}
            </p>
            
            <div className="space-y-8">
              {contactItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={`flex items-center gap-5 group ${item.href ? "cursor-pointer" : "cursor-default"}`}
                >
                  <div className="w-12 h-12 flex items-center justify-center text-muted-foreground luxury-transition group-hover:text-foreground">
                    <item.icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="font-medium text-sm tracking-wide text-foreground">{item.title}</div>
                    <div className="text-muted-foreground text-sm font-light luxury-transition group-hover:text-foreground">
                      {item.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-background p-8 md:p-12 border border-border/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm tracking-wide">Emër *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Emri juaj"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="border-border/50 bg-transparent focus:border-foreground luxury-transition"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business" className="text-sm tracking-wide">Emri i biznesit</Label>
                  <Input
                    id="business"
                    type="text"
                    placeholder="Emri i kompanisë"
                    value={formData.business}
                    onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                    className="border-border/50 bg-transparent focus:border-foreground luxury-transition"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm tracking-wide">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@shembull.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="border-border/50 bg-transparent focus:border-foreground luxury-transition"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm tracking-wide">Telefon *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+355 69 XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="border-border/50 bg-transparent focus:border-foreground luxury-transition"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm tracking-wide">Mesazh *</Label>
                <Textarea
                  id="message"
                  placeholder="Përshkruani nevojat tuaja për tekstile..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="border-border/50 bg-transparent focus:border-foreground luxury-transition resize-none"
                />
              </div>
              
              <div className="flex items-start gap-3">
                <Checkbox
                  id="gdpr"
                  checked={formData.gdprConsent}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, gdprConsent: checked as boolean })
                  }
                />
                <Label htmlFor="gdpr" className="text-xs text-muted-foreground leading-relaxed cursor-pointer font-light">
                  Pranoj që të dhënat e mia të përpunohen sipas politikës së privatësisë 
                  për qëllime të komunikimit dhe ofertimit.
                </Label>
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
  );
};

export default ContactSection;
