import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";
import { FontProvider } from "./components/FontProvider";
import Index from "./pages/Index";
import Products from "./pages/Products";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetail from "./pages/ProductDetail";
import ServiceDetail from "./pages/ServiceDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Contact from "./pages/Contact";
import RequestQuote from "./pages/RequestQuote";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Personalizimi from "./pages/Personalizimi";
import Clients from "./pages/Clients";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminAuth from "./pages/AdminAuth";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
     <AuthProvider>
       <FontProvider>
       <TooltipProvider>
         <Toaster />
         <Sonner />
         <BrowserRouter>
           <ScrollToTop />
           <Routes>
             <Route path="/" element={<Index />} />
             <Route path="/produktet" element={<Products />} />
             <Route path="/produktet/:categorySlug" element={<CategoryProducts />} />
             <Route path="/produktet/:categorySlug/:productSlug" element={<ProductDetail />} />
             <Route path="/sherbimet/:serviceSlug" element={<ServiceDetail />} />
             <Route path="/blog" element={<Blog />} />
             <Route path="/blog/:postSlug" element={<BlogPost />} />
             <Route path="/projekte" element={<Projects />} />
             <Route path="/projekte/:projectSlug" element={<ProjectDetail />} />
             <Route path="/kontakt" element={<Contact />} />
             <Route path="/merr-nje-oferte" element={<RequestQuote />} />
              <Route path="/rreth-nesh" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/personalizimi" element={<Personalizimi />} />
              <Route path="/klientet" element={<Clients />} />
              <Route path="/admin" element={<Admin />} />
             <Route path="/admin/auth" element={<AdminAuth />} />
             {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
             <Route path="*" element={<NotFound />} />
           </Routes>
         </BrowserRouter>
        </TooltipProvider>
       </FontProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
