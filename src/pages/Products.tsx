import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useCategories } from "@/hooks/useCategories";
 import { Skeleton } from "@/components/ui/skeleton";
 import { SeoMetaHead } from "@/components/admin/SeoMetaHead";

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

// Fallback images for categories (mapped by slug)
const categoryImages: Record<string, string> = {
  "carcafe": sheetsImage,
  "jorgan": duvetImage,
  "dysheke": mattressImage,
  "jastek-gjumi": pillowImage,
  "batanije": blanketImage,
  "mbrojtese": protectorImage,
  "mbulesa-tavoline": tableclothImage,
  "perde": curtainsImage,
  "grila": curtainsImage,
  "peshqire": towelsImage,
  "peshqir-plazhi": beachTowelImage,
  "peshqire-kembesh": bathMatImage,
  "rrobdishane": bathrobeImage,
  "shapka": showerCapImage,
  "shilte": cushionsImage,
  "skin-essentials": amenitiesImage,
  "le-jardin-med": amenitiesImage,
  "sarbacane": amenitiesImage,
  "good-to-declare": amenitiesImage,
  "per-femijet": amenitiesImage,
  "accessories-slippers": slippersImage,
};

// Default fallback
const defaultImage = hotelImage;

const Products = () => {
  const { data: categories, isLoading } = useCategories();

  const getImage = (category: { slug: string; image_url: string | null }) => {
    // First try the database image, then the mapped fallback, then the default
    if (category.image_url && !category.image_url.includes("placeholder")) {
      return category.image_url;
    }
    return categoryImages[category.slug] || defaultImage;
  };

 return (
   <div className="min-h-screen bg-background">
     <SeoMetaHead
       pageSlug="products"
       fallbackTitle="Produktet Tona - EMA Hotelling"
       fallbackDescription="Shfletoni koleksionin tonë të plotë të tekstileve premium për industrinë e mikpritjes."
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
            <span className="text-primary-foreground">Produktet</span>
          </nav>
          <h1 className="typo-h1 text-primary-foreground">
            Produktet
          </h1>
          <p className="typo-body text-primary-foreground/70 mt-4 max-w-2xl md:text-lg">
            Koleksion premium produktesh tekstile për industrinë e mikpritjes dhe hotelerisë.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-[15px]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categories?.map((category) => (
                <Link
                  key={category.id}
                  to={`/produktet/${category.slug}`}
                  className="group cursor-pointer luxury-transition block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[15px] border border-border">
                    <img
                      src={getImage(category)}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover luxury-transition group-hover:scale-105"
                    />
                  </div>
                  <div className="pt-3 px-1">
                    <h3 className="font-serif text-lg md:text-xl font-medium text-foreground line-clamp-1">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Products;
