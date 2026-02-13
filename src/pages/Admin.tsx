import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LogOut, Package, FolderOpen, FileText, Layout, Tags, Briefcase, HelpCircle, Settings, Globe, Search, Type, Users } from "lucide-react";
import { ProductEditor } from "@/components/admin/ProductEditor";
import { CategoryEditor } from "@/components/admin/CategoryEditor";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { BlogCategoryEditor } from "@/components/admin/BlogCategoryEditor";
import { PageBuilderEditor } from "@/components/admin/PageBuilderEditor";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { FaqEditor } from "@/components/admin/FaqEditor";
import { ServicePageEditor } from "@/components/admin/ServicePageEditor";
import { SiteSettingsEditor } from "@/components/admin/SiteSettingsEditor";
import { SeoEditor } from "@/components/admin/SeoEditor";
import { TypographySettingsEditor } from "@/components/admin/TypographySettingsEditor";
import { ClientEditor } from "@/components/admin/ClientEditor";
 export default function Admin() {
   const { user, isLoading, isAdmin, signOut } = useAuth();
   const navigate = useNavigate();
 
   useEffect(() => {
     if (!isLoading && (!user || !isAdmin)) {
       navigate("/admin/auth");
     }
   }, [user, isLoading, isAdmin, navigate]);
 
   const handleSignOut = async () => {
     await signOut();
     navigate("/");
   };
 
   if (isLoading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-background">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
       </div>
     );
   }
 
   if (!user || !isAdmin) {
     return null;
   }
 
   return (
     <div className="min-h-screen bg-secondary/30">
       <header className="bg-background border-b border-border sticky top-0 z-50">
         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
           <h1 className="font-serif text-xl font-semibold">CMS Dashboard</h1>
           <div className="flex items-center gap-4">
             <span className="text-sm text-muted-foreground hidden md:block">{user.email}</span>
             <Button variant="outline" size="sm" onClick={handleSignOut}>
               <LogOut className="h-4 w-4 mr-2" />
               Dil
             </Button>
           </div>
         </div>
       </header>
 
       <main className="container mx-auto px-4 py-8">
         <Tabs defaultValue="products" className="w-full">
            <TabsList className="flex flex-wrap w-full mb-8 h-auto gap-1 p-1">
             <TabsTrigger value="products" className="gap-2 py-2">
               <Package className="h-4 w-4" />
               <span className="hidden sm:inline">Produktet</span>
             </TabsTrigger>
             <TabsTrigger value="categories" className="gap-2 py-2">
               <FolderOpen className="h-4 w-4" />
               <span className="hidden sm:inline">Kategoritë</span>
             </TabsTrigger>
              <TabsTrigger value="projects" className="gap-2 py-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Projekte</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="gap-2 py-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Shërbime</span>
              </TabsTrigger>
             <TabsTrigger value="blog" className="gap-2 py-2">
               <FileText className="h-4 w-4" />
               <span className="hidden sm:inline">Blog</span>
             </TabsTrigger>
             <TabsTrigger value="blog-categories" className="gap-2 py-2">
               <Tags className="h-4 w-4" />
               <span className="hidden sm:inline">Kat. Blog</span>
             </TabsTrigger>
              <TabsTrigger value="faq" className="gap-2 py-2">
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">FAQ</span>
              </TabsTrigger>
              <TabsTrigger value="pages" className="gap-2 py-2">
                <Layout className="h-4 w-4" />
                <span className="hidden sm:inline">Faqet</span>
              </TabsTrigger>
              <TabsTrigger value="site-settings" className="gap-2 py-2">
                 <Globe className="h-4 w-4" />
                 <span className="hidden sm:inline">Header/Footer</span>
               </TabsTrigger>
                <TabsTrigger value="seo" className="gap-2 py-2">
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">SEO</span>
                </TabsTrigger>
                <TabsTrigger value="typography" className="gap-2 py-2">
                   <Type className="h-4 w-4" />
                   <span className="hidden sm:inline">Tipografia</span>
                 </TabsTrigger>
                 <TabsTrigger value="clients" className="gap-2 py-2">
                   <Users className="h-4 w-4" />
                   <span className="hidden sm:inline">Klientët</span>
                 </TabsTrigger>
               </TabsList>

             <TabsContent value="products"><ProductEditor /></TabsContent>
             <TabsContent value="categories"><CategoryEditor /></TabsContent>
              <TabsContent value="projects"><ProjectEditor /></TabsContent>
              <TabsContent value="services"><ServicePageEditor /></TabsContent>
             <TabsContent value="blog"><BlogEditor /></TabsContent>
             <TabsContent value="blog-categories"><BlogCategoryEditor /></TabsContent>
              <TabsContent value="faq"><FaqEditor /></TabsContent>
             <TabsContent value="pages"><PageBuilderEditor /></TabsContent>
             <TabsContent value="site-settings"><SiteSettingsEditor /></TabsContent>
              <TabsContent value="seo"><SeoEditor /></TabsContent>
               <TabsContent value="typography"><TypographySettingsEditor /></TabsContent>
               <TabsContent value="clients"><ClientEditor /></TabsContent>
          </Tabs>
       </main>
     </div>
   );
 }