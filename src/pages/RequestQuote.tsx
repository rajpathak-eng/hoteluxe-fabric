import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, CheckCircle, Clock, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SeoMetaHead } from "@/components/admin/SeoMetaHead";
import { usePageSection } from "@/hooks/usePageSections";

const productOptions = [
  { id: "carcafe", label: "Çarçafë" },
  { id: "jorgane", label: "Jorganë" },
  { id: "jasteke", label: "Jastëkë" },
  { id: "batanije", label: "Batanije" },
  { id: "peshqire", label: "Peshqirë" },
  { id: "mbulesa-tavoline", label: "Mbulesa tavoline" },
  { id: "servieta", label: "Servieta" },
  { id: "perde", label: "Perde" },
  { id: "dysheke", label: "Dyshekë" },
  { id: "amenities", label: "Amenities" },
];

const RequestQuote = () => {
  const { data: heroSection } = usePageSection("quote", "hero");
  const { data: stepsSection } = usePageSection("quote", "steps");
 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    ambientType: "",
    products: [] as string[],
    quantity: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProductToggle = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.includes(productId)
        ? prev.products.filter(p => p !== productId)
        : [...prev.products, productId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.products.length === 0) {
      toast.error("Ju lutem zgjidhni të paktën një produkt");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Faleminderit! Kërkesa juaj u dërgua me sukses. Do t'ju kontaktojmë brenda 24 orëve.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      ambientType: "",
      products: [],
      quantity: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const steps = [
    {
      icon: MessageSquare,
      title: "Plotësoni formularin",
      description: "Plotësoni formularin më poshtë me detajet e kërkesës suaj.",
    },
    {
      icon: Clock,
      title: "Shqyrtim i shpejtë",
      description: "Ekipi ynë profesionist do të shqyrtojë kërkesën dhe do t'ju dërgojë ofertën më të mirë.",
    },
    {
      icon: CheckCircle,
      title: "Ofertë e personalizuar",
      description: "Ju mund të diskutoni çdo ndryshim ose opsion shtesë për të përmirësuar zgjidhjen.",
    },
  ];

 return (
   <div className="min-h-screen">
     <SeoMetaHead
       pageSlug="quote"
       fallbackTitle="Kërko një Ofertë – EMA Hotelling, Tekstile për Hotele dhe Restorante"
       fallbackDescription="Plotësoni formularin për të marrë një ofertë të personalizuar për produktet tona të tekstileve për hotele, restorante dhe Airbnb."
     />
     <Header />
     <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="typo-label text-muted-foreground mb-4">
                {heroSection?.subtitle || "Ofertë e personalizuar"}
              </span>
              <h1 className="typo-h1 text-foreground mb-6">
                {heroSection?.title || "Kërko një ofertë"}
              </h1>
              <p className="typo-body text-muted-foreground md:text-lg">
                {heroSection?.content || "Dëshironi të pajisni ambientin tuaj me tekstile të klasit të parë? EMA Hotelling ju ofron oferta të personalizuara për hotele, restorante dhe Airbnb, bazuar në nevojat dhe sasinë e produktit që ju nevojitet."}
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 border-b border-border/30">
          <div className="container mx-auto px-4">
            <h2 className="typo-h2 text-foreground mb-10 text-center">
              {stepsSection?.title || "Si funksionon"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-background rounded-full text-foreground border border-border">
                    <step.icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <h3 className="typo-h3 text-foreground mb-2">{step.title}</h3>
                  <p className="typo-body-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote Form Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-background p-8 md:p-12 border border-border/50">
                <div className="text-center mb-8">
                  <h3 className="typo-h3 text-foreground mb-2">
                    Formulari për ofertë
                  </h3>
                  <p className="text-primary font-medium text-sm">
                    Siguro një ofertë të personalizuar brenda 24 orëve!
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm tracking-wide">Numri i telefonit *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+355 69 XXX XXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="border-border/50 bg-background focus:border-foreground luxury-transition"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ambientType" className="text-sm tracking-wide">Lloji i ambientit *</Label>
                      <Select
                        value={formData.ambientType}
                        onValueChange={(value) => setFormData({ ...formData, ambientType: value })}
                        required
                      >
                        <SelectTrigger className="border-border/50 bg-background focus:border-foreground luxury-transition">
                          <SelectValue placeholder="Zgjidhni llojin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hotel">Hotel</SelectItem>
                          <SelectItem value="restorant">Restorant</SelectItem>
                          <SelectItem value="airbnb">Airbnb</SelectItem>
                          <SelectItem value="tjeter">Tjetër</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm tracking-wide">Produktet e dëshiruara *</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {productOptions.map((product) => (
                        <div key={product.id} className="flex items-center gap-2">
                          <Checkbox
                            id={product.id}
                            checked={formData.products.includes(product.id)}
                            onCheckedChange={() => handleProductToggle(product.id)}
                          />
                          <Label 
                            htmlFor={product.id} 
                            className="text-sm font-normal cursor-pointer"
                          >
                            {product.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-sm tracking-wide">Sasia (opsionale)</Label>
                    <Input
                      id="quantity"
                      type="text"
                      placeholder="p.sh. 50 çarçafë, 100 peshqirë..."
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="border-border/50 bg-background focus:border-foreground luxury-transition"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm tracking-wide">Mesazhi shtesë</Label>
                    <Textarea
                      id="message"
                      placeholder="Shkruani detaje shtesë për kërkesën tuaj..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
                        Dërgo kërkesën
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

export default RequestQuote;
