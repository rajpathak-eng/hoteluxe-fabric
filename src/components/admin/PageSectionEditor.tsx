 import { useState, useEffect } from "react";
 import { Button } from "@/components/ui/button";
 import { Label } from "@/components/ui/label";
 import { Switch } from "@/components/ui/switch";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { toast } from "@/hooks/use-toast";
 import { Loader2, Save, Eye } from "lucide-react";
 import { usePageSections, useUpdatePageSection, PageSection } from "@/hooks/useCms";
import { HeroSectionEditor } from "./section-editors/HeroSectionEditor";
import { DifferentiatorsSectionEditor } from "./section-editors/DifferentiatorsSectionEditor";
import { TrustSectionEditor } from "./section-editors/TrustSectionEditor";
import { IndustriesSectionEditor } from "./section-editors/IndustriesSectionEditor";
import { CertificationsSectionEditor } from "./section-editors/CertificationsSectionEditor";
import { ProductsSectionEditor } from "./section-editors/ProductsSectionEditor";
import { PortfolioSectionEditor } from "./section-editors/PortfolioSectionEditor";
import { AboutSectionEditor } from "./section-editors/AboutSectionEditor";
import { ContactSectionEditor } from "./section-editors/ContactSectionEditor";
import { CtaSectionEditor } from "./section-editors/CtaSectionEditor";
import { GenericSectionEditor } from "./section-editors/GenericSectionEditor";
 
 const pages = [
   { value: "home", label: "Kryefaqja" },
   { value: "about", label: "Rreth Nesh" },
   { value: "contact", label: "Kontakt" },
   { value: "faq", label: "FAQ" },
   { value: "products", label: "Produktet" },
   { value: "projects", label: "Projektet" },
   { value: "blog", label: "Blog" },
    { value: "quote", label: "Kërko Ofertë" },
    { value: "klientet", label: "Klientët" },
  ];
 
const sectionLabels: Record<string, string> = {
  hero: "Hero Banner",
  "hero-homepage": "Hero - Homepage",
  about: "Rreth Nesh",
  differentiators: "Pse Ne? (4 Kartat)",
  products: "Produktet",
  industries: "Industritë (Karusel)",
  portfolio: "Projektet",
  contact: "Kontakt & Formulari",
  trust: "Statistikat (Numrat)",
  certifications: "Certifikime & Partnerë",
  cta: "Call to Action",
  "featured-products": "Produktet Tona",
  history: "Historia",
  commitment: "Përkushtimi",
  info: "Informacion",
  steps: "Si Funksionon",
};
 
 export function PageSectionEditor() {
   const [selectedPage, setSelectedPage] = useState("home");
   const [selectedId, setSelectedId] = useState<string | null>(null);
   const { data: sections, isLoading } = usePageSections(selectedPage);
   const updateSection = useUpdatePageSection();
 
   const [form, setForm] = useState<Partial<PageSection>>({
     title: "",
     subtitle: "",
     content: "",
     image_url: null,
     button_text: "",
     button_url: "",
     is_active: true,
     items: [],
   });
 
   const selectedSection = sections?.find((s) => s.id === selectedId);
 
   useEffect(() => {
     if (selectedSection) {
       setForm({
         title: selectedSection.title || "",
         subtitle: selectedSection.subtitle || "",
         content: selectedSection.content || "",
         image_url: selectedSection.image_url || null,
         button_text: selectedSection.button_text || "",
         button_url: selectedSection.button_url || "",
         is_active: selectedSection.is_active ?? true,
         items: selectedSection.items || [],
       });
     }
   }, [selectedSection]);
 
   useEffect(() => {
     setSelectedId(null);
   }, [selectedPage]);
 
   const handleSave = async () => {
     if (!selectedId) return;
 
     try {
       await updateSection.mutateAsync({ id: selectedId, ...form });
       toast({ title: "Sukses", description: "Seksioni u përditësua" });
     } catch (error: any) {
       toast({
         title: "Gabim",
         description: error.message,
         variant: "destructive",
       });
     }
   };
 
   const getSectionLabel = (key: string) => {
     return sectionLabels[key] || key;
   };
 
   const renderSectionEditor = () => {
     if (!selectedSection) return null;
 
     const sectionKey = selectedSection.section_key;
 
       switch (sectionKey) {
         case "hero":
           return <HeroSectionEditor form={form} setForm={setForm} />;
         case "differentiators":
           return <DifferentiatorsSectionEditor form={form} setForm={setForm} />;
         case "trust":
           return <TrustSectionEditor form={form} setForm={setForm} />;
         case "industries":
           return <IndustriesSectionEditor form={form} setForm={setForm} />;
         case "certifications":
           return <CertificationsSectionEditor form={form} setForm={setForm} />;
         case "products":
           return <ProductsSectionEditor form={form} setForm={setForm} />;
         case "portfolio":
           return <PortfolioSectionEditor form={form} setForm={setForm} />;
         case "about":
           return <AboutSectionEditor form={form} setForm={setForm} />;
         case "contact":
           return <ContactSectionEditor form={form} setForm={setForm} />;
         case "cta":
           return <CtaSectionEditor form={form} setForm={setForm} />;
         default:
           return <GenericSectionEditor form={form} setForm={setForm} />;
       }
     };
 
   return (
     <div className="space-y-6">
       {/* Page Selector */}
       <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
           <Label>Zgjidh faqen:</Label>
           <Select value={selectedPage} onValueChange={setSelectedPage}>
             <SelectTrigger className="w-[200px]">
               <SelectValue />
             </SelectTrigger>
             <SelectContent>
               {pages.map((page) => (
                 <SelectItem key={page.value} value={page.value}>
                   {page.label}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
         </div>
         <Button variant="outline" size="sm" asChild>
           <a href={selectedPage === "home" ? "/" : `/${selectedPage}`} target="_blank" rel="noopener noreferrer">
             <Eye className="w-4 h-4 mr-2" />
             Shiko faqen
           </a>
         </Button>
       </div>
 
       <div className="grid lg:grid-cols-3 gap-6">
         {/* Section List */}
         <Card className="lg:col-span-1">
           <CardHeader>
             <CardTitle className="text-lg">Seksionet</CardTitle>
           </CardHeader>
           <CardContent>
             {isLoading ? (
               <Loader2 className="h-6 w-6 animate-spin mx-auto" />
             ) : sections?.length === 0 ? (
               <p className="text-muted-foreground text-sm text-center py-4">
                 Nuk ka seksione për këtë faqe
               </p>
             ) : (
               <div className="space-y-1">
                 {sections
                   ?.slice()
                   .sort((a, b) => a.display_order - b.display_order)
                   .map((section) => (
                   <button
                     key={section.id}
                     onClick={() => setSelectedId(section.id)}
                     className={`w-full text-left p-3 rounded-md transition-colors ${
                       selectedId === section.id
                         ? "bg-primary text-primary-foreground"
                         : "hover:bg-muted"
                     }`}
                   >
                     <div className="flex items-center justify-between">
                       <span className="font-medium text-sm">
                         {getSectionLabel(section.section_key)}
                       </span>
                       <span className={`w-2 h-2 rounded-full ${section.is_active ? "bg-green-500" : "bg-red-500/50"}`} />
                     </div>
                     <div className="text-xs opacity-70 mt-1 truncate">
                       {section.title || "Pa titull"}
                     </div>
                   </button>
                 ))}
               </div>
             )}
           </CardContent>
         </Card>
 
         {/* Editor */}
         <Card className="lg:col-span-2">
           <CardHeader>
             <CardTitle>
               {selectedSection ? getSectionLabel(selectedSection.section_key) : "Zgjidh seksion"}
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-6">
             {selectedId ? (
               <>
                 <div className="flex items-center gap-2">
                   <Switch
                     checked={form.is_active}
                     onCheckedChange={(v) => setForm({ ...form, is_active: v })}
                   />
                   <Label>Seksioni aktiv</Label>
                 </div>
 
                 {renderSectionEditor()}
 
                 <Button onClick={handleSave} disabled={updateSection.isPending}>
                   {updateSection.isPending ? (
                     <Loader2 className="h-4 w-4 animate-spin mr-2" />
                   ) : (
                     <Save className="h-4 w-4 mr-2" />
                   )}
                   Ruaj ndryshimet
                 </Button>
               </>
             ) : (
               <p className="text-muted-foreground text-center py-8">
                 Zgjidhni një seksion për ta edituar
               </p>
             )}
           </CardContent>
         </Card>
       </div>
     </div>
   );
 }