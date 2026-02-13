import { Link, useParams } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useCategoryBySlug } from "@/hooks/useCategories";
import { useProductsByCategory } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DynamicSeoHead } from "@/components/seo/DynamicSeoHead";

// Import local images for fallbacks
import sheetsImage from "@/assets/product-sheets-new.jpg";
import duvetImage from "@/assets/product-duvet.jpg";
import mattressImage from "@/assets/product-mattress-new.jpg";
import pillowImage from "@/assets/product-sleeping-pillow.jpg";
import blanketImage from "@/assets/product-blanket.jpg";
import protectorImage from "@/assets/product-mattress-protector.jpg";
import tableclothImage from "@/assets/product-tablecloth.jpg";
import curtainsImage from "@/assets/product-curtains-new.jpg";
import towelsImage from "@/assets/product-towels-new.jpg";
import amenitiesImage from "@/assets/product-amenities.jpg";
import hotelImage from "@/assets/industry-hotel.jpg";
import showerCapImage from "@/assets/product-shower-cap.jpg";
import bathrobeImage from "@/assets/product-bathrobe.jpg";
import slippersImage from "@/assets/product-slippers.jpg";
import cushionsImage from "@/assets/product-cushions.jpg";
import beachTowelImage from "@/assets/product-beach-towel.jpg";
import bathMatImage from "@/assets/product-bath-mat.jpg";

// Fallback images for product categories
const categoryProductImages: Record<string, string[]> = {
  "carcafe": [sheetsImage, duvetImage, pillowImage],
  "jorgan": [duvetImage, blanketImage, sheetsImage],
  "dysheke": [mattressImage, protectorImage, sheetsImage],
  "jastek-gjumi": [pillowImage, sheetsImage, blanketImage],
  "batanije": [blanketImage, duvetImage, sheetsImage],
  "mbrojtese": [protectorImage, mattressImage, sheetsImage],
  "mbulesa-tavoline": [tableclothImage, towelsImage, amenitiesImage],
  "perde": [curtainsImage, hotelImage, amenitiesImage],
  "grila": [curtainsImage, hotelImage, amenitiesImage],
  "peshqire": [towelsImage, amenitiesImage, sheetsImage],
  "peshqir-plazhi": [beachTowelImage, towelsImage, hotelImage],
  "peshqire-kembesh": [bathMatImage, towelsImage, protectorImage],
  "rrobdishane": [bathrobeImage, towelsImage, sheetsImage],
  "shapka": [showerCapImage, amenitiesImage, towelsImage],
  "shilte": [cushionsImage, pillowImage, blanketImage],
  "skin-essentials": [amenitiesImage, towelsImage, hotelImage],
  "le-jardin-med": [amenitiesImage, towelsImage, hotelImage],
  "sarbacane": [amenitiesImage, towelsImage, hotelImage],
  "good-to-declare": [amenitiesImage, towelsImage, hotelImage],
  "per-femijet": [amenitiesImage, towelsImage, pillowImage],
  "accessories-slippers": [slippersImage, amenitiesImage, towelsImage],
};

const defaultProductImage = hotelImage;

const CategoryProducts = () => {
  const { categorySlug } = useParams();
  const { data: category, isLoading: categoryLoading } = useCategoryBySlug(categorySlug);
  const { data: products, isLoading: productsLoading } = useProductsByCategory(category?.id);

  const openWhatsApp = (productName?: string) => {
    const phone = "355686000626";
    const message = productName 
      ? `Përshëndetje! Jam i interesuar për produktin: ${productName}. Mund të më jepni më shumë informacion?`
      : `Përshëndetje! Jam i interesuar për kategorinë: ${category?.name}. Mund të më jepni më shumë informacion?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Get product image with fallback
  const getProductImage = (product: { images: string[] }, index: number) => {
    // Check if product has valid images
    if (product.images && product.images.length > 0 && product.images[0] && !product.images[0].includes("placeholder")) {
      return product.images[0];
    }
    // Use category-specific fallback images, cycling through them
    const categoryFallbacks = categoryProductImages[categorySlug || ""] || [defaultProductImage];
    return categoryFallbacks[index % categoryFallbacks.length];
  };

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 container mx-auto px-4">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 container mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl mb-4">Kategoria nuk u gjet</h1>
          <Link to="/produktet">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kthehu te Produktet
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Generate SEO metadata
  const seoTitle = (category as any).meta_title || `${category.name} - Produkte për Hotele | EMA Hotelling`;
  const seoDescription = (category as any).meta_description || category.description || `Shfletoni koleksionin tonë të ${category.name} cilësore për hotele, restorante dhe biznese mikpritjeje.`;

  return (
    <div className="min-h-screen bg-background">
      <DynamicSeoHead
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={`https://hoteluxe-fabrics.lovable.app/produktet/${categorySlug}`}
      />
      <Header />
      
      {/* Hero Banner */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary" />
        <div className="container mx-auto px-4 relative z-10">
          <nav className="text-primary-foreground/60 text-sm mb-4">
            <Link to="/" className="hover:text-primary-foreground transition-colors">
              Kreu
            </Link>
            <span className="mx-2">/</span>
            <Link to="/produktet" className="hover:text-primary-foreground transition-colors">
              Produktet
            </Link>
            <span className="mx-2">/</span>
            <span className="text-primary-foreground">{category.name}</span>
          </nav>
          <h1 className="typo-h1 text-primary-foreground">
            {category.name}
          </h1>
        </div>
      </section>

      {/* Products Grid or Empty State */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-sm" />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product, index) => (
                <Link
                  key={product.id}
                  to={`/produktet/${categorySlug}/${product.slug}`}
                  className="group relative overflow-hidden cursor-pointer luxury-transition hover-lift bg-background border border-border rounded-[15px]"
                >
                  <div className="relative aspect-square overflow-hidden bg-muted rounded-t-[15px]">
                    <img
                      src={getProductImage(product, index)}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover luxury-transition group-hover:scale-105"
                    />
                    
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-serif text-base md:text-lg font-medium text-foreground mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <span className="text-xs font-medium tracking-wide text-muted-foreground flex items-center gap-1.5 group-hover:text-accent luxury-transition">
                      Shiko detajet
                      <ArrowRight className="w-3 h-3 luxury-transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="font-serif text-2xl text-foreground mb-4">
                Produktet për këtë kategori do të shtohen së shpejti
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Na kontaktoni direkt në WhatsApp për të marrë informacion mbi produktet e disponueshme në këtë kategori.
              </p>
              <Button 
                size="lg" 
                onClick={() => openWhatsApp()}
                className="group"
              >
                Merr një ofertë
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Back to Products */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <Link to="/produktet">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Të gjitha kategoritë
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default CategoryProducts;
