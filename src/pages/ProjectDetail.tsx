import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { usePublicProject, usePublicProjects, useProjectProducts } from "@/hooks/useProjects";
import { Skeleton } from "@/components/ui/skeleton";
import { DynamicSeoHead } from "@/components/seo/DynamicSeoHead";

const ProjectDetail = () => {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { data: project, isLoading } = usePublicProject(projectSlug);
  const { data: allProjects } = usePublicProjects();
  const { data: projectProducts } = useProjectProducts(project?.id);
 
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Skeleton className="h-screen" />
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-4xl text-foreground mb-4">Projekti nuk u gjet</h1>
            <p className="text-muted-foreground mb-8">Projekti që po kërkoni nuk ekziston.</p>
            <Link to="/projekte">
              <Button>Kthehu te projektet</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const openWhatsApp = () => {
    const message = `Përshëndetje! Po shikoj projektin "${project.title}" dhe dëshiroj të marr një ofertë të ngjashme për biznesin tim.`;
    window.open(`https://wa.me/355686000626?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Get tag styling
  const getTagStyle = (tag: string) => {
    switch (tag) {
      case "Hotel":
        return "bg-accent text-accent-foreground";
      case "Restorante":
        return "bg-primary text-primary-foreground";
      case "Airbnb":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const gallery = project.gallery?.length > 0 ? project.gallery : [project.hero_image || "/placeholder.svg"];
 
  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };
 
  // Generate SEO metadata
  const seoTitle = (project as any).meta_title || `${project.title} - Projekt | EMA Hotelling`;
  const seoDescription = (project as any).meta_description || project.description || `Shikoni projektin ${project.title} - një nga projektet e suksesshme të EMA Hotelling.`;
  const heroImage = project.hero_image || "/placeholder.svg";
  const otherProjects = allProjects?.filter((p) => p.id !== project.id).slice(0, 3) || [];
  return (
    <div className="min-h-screen bg-background">
      <DynamicSeoHead
        title={seoTitle}
        description={seoDescription}
        ogImage={heroImage}
        canonicalUrl={`https://hoteluxe-fabrics.lovable.app/projekte/${projectSlug}`}
      />
      <Header />
      <main>
        {/* Immersive Hero Section */}
        <section className="relative h-screen min-h-[700px]">
          <img
            src={heroImage}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Elegant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-primary/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent" />
          
          {/* Back button */}
          <div className="absolute top-28 left-0 right-0 z-10">
            <div className="container mx-auto px-4">
              <Link
                to="/projekte"
                className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground luxury-transition group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 luxury-transition" />
                <span className="text-sm font-medium tracking-wide">Të gjitha projektet</span>
              </Link>
            </div>
          </div>
          
          {/* Hero Content - Minimal & Premium */}
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-20 md:pb-28">
              <div className="max-w-3xl">
                <h1 className="font-serif text-5xl md:text-7xl font-medium text-primary-foreground mb-4 tracking-tight leading-tight animate-fade-up">
                  {project.title}
                </h1>
                <p className="text-primary-foreground/70 text-lg md:text-xl font-light tracking-wide animate-fade-up-delay-1 mb-8">
                  {project.tag}
                </p>
                <Button
                  variant="secondary"
                  size="lg"
                  className="group animate-fade-up-delay-1"
                  onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Shiko Galerinë
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 luxury-transition" />
                </Button>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary-foreground/60">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-primary-foreground/30 animate-pulse" />
          </div>
        </section>

        {/* Simple Project Description */}
        <section className="py-16 md:py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6 tracking-tight">
                {project.title}
              </h2>
              <p className="text-foreground/80 text-lg md:text-xl font-light leading-relaxed mb-6">
                {project.description}
              </p>
              {projectProducts && projectProducts.length > 0 && (
                <p className="text-muted-foreground font-light">
                  <span className="font-medium text-foreground">Produkte:</span>{" "}
                  {projectProducts.map(p => p.product_name).join(", ")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Visual Gallery Section */}
        <section id="gallery" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-muted-foreground font-medium text-xs tracking-widest uppercase mb-4 block">
                Galeria e projektit
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground tracking-tight">
                Pamje nga ambienti
              </h2>
            </div>

            {/* Main Gallery Image */}
            <div className="relative max-w-5xl mx-auto mb-6">
              <div className="aspect-[16/10] overflow-hidden bg-muted rounded-[15px]">
                <img
                  src={gallery[activeImageIndex]}
                  alt={`${project.title} - Foto ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover luxury-transition rounded-[15px]"
                />
              </div>

              {/* Navigation Arrows */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background luxury-transition z-10 rounded-full"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background luxury-transition z-10 rounded-full"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                  </button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-foreground">
                {activeImageIndex + 1} / {gallery.length}
              </div>
            </div>

            {/* Thumbnail Grid */}
            {gallery.length > 1 && (
              <div className="flex justify-center gap-3 max-w-5xl mx-auto">
                {gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative aspect-[4/3] w-20 md:w-28 overflow-hidden luxury-transition rounded-[10px] ${
                      index === activeImageIndex
                        ? "ring-2 ring-foreground"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded-[10px]"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Products Section - Premium Layout */}
        {projectProducts && projectProducts.length > 0 && (
          <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <span className="text-muted-foreground font-medium text-xs tracking-widest uppercase mb-4 block">
                Zgjidhjet e ofruara
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4 tracking-tight">
                Produktet e përdorura në këtë projekt
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto font-light">
                Tekstilet premium që u përzgjodhën për të krijuar ambientin ideal.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {projectProducts.map((product, index) => (
                <Link
                  key={index}
                  to={product.category_slug && product.product_slug ? `/produktet/${product.category_slug}/${product.product_slug}` : "/produktet"}
                  className="group bg-background overflow-hidden luxury-transition hover-lift rounded-[15px]"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden rounded-t-[15px]">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.product_name}
                      className="w-full h-full object-cover luxury-transition group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 luxury-transition" />
                    
                    {/* Hover overlay with arrow */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 luxury-transition">
                      <div className="w-14 h-14 bg-background flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-foreground" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-5 border-t border-border">
                    <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-accent luxury-transition mb-1">
                      {product.product_name}
                    </h3>
                    <span className="text-xs text-muted-foreground tracking-wide uppercase">
                      Shiko produktin →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* CTA Section */}
        <section className="relative py-32 overflow-hidden">
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/90" />
          
          <div className="relative container mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl md:text-5xl font-medium text-primary-foreground mb-6 tracking-tight">
              Dëshironi një projekt të ngjashëm?
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto font-light text-lg leading-relaxed mb-10">
              Na kontaktoni për të diskutuar nevojat tuaja specifike. 
              Ekipi ynë do t'ju ndihmojë të zgjidhni tekstilet e duhura për biznesin tuaj.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={openWhatsApp}
              className="group text-base px-8 py-6"
            >
              <Phone className="w-5 h-5 transition-transform group-hover:rotate-12" />
              Kërko ofertë tani
            </Button>
          </div>
        </section>

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-muted-foreground font-medium text-xs tracking-widest uppercase mb-4 block">
                Shiko më shumë
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground tracking-tight">
                Projekte të tjera
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {otherProjects.map((p) => (
                  <Link
                    key={p.id}
                    to={`/projekte/${p.slug}`}
                    className="group relative overflow-hidden aspect-[4/5] rounded-[15px]"
                  >
                    <img
                      src={p.hero_image || "/placeholder.svg"}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-cover luxury-transition group-hover:scale-105 rounded-[15px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent rounded-[15px]" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className={`inline-block text-xs font-semibold px-3 py-1 mb-3 tracking-wider uppercase ${getTagStyle(p.tag)}`}>
                        {p.tag}
                      </span>
                      <h3 className="font-serif text-2xl font-medium text-primary-foreground group-hover:translate-x-1 luxury-transition">
                        {p.title}
                      </h3>
                    </div>
                  </Link>
                ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/projekte">
                <Button variant="outline" size="lg" className="group">
                  Shiko të gjitha projektet
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 luxury-transition" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProjectDetail;
