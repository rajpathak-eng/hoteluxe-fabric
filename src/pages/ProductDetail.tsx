import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import RelatedProducts from "@/components/RelatedProducts";
import { useCategoryBySlug } from "@/hooks/useCategories";
import { useProductBySlug } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { WashingIconsDisplay } from "@/components/admin/WashingIconsEditor";
import { ProductFeaturesDisplay } from "@/components/admin/ProductFeaturesEditor";
import { ProductVariantsDisplay } from "@/components/admin/ProductVariantsEditor";
import { DynamicSeoHead } from "@/components/seo/DynamicSeoHead";

// Import local images for fallbacks - ONLY product-specific images
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
import showerCapImage from "@/assets/product-shower-cap.jpg";
import bathrobeImage from "@/assets/product-bathrobe.jpg";
import slippersImage from "@/assets/product-slippers.jpg";
import cushionsImage from "@/assets/product-cushions.jpg";
import beachTowelImage from "@/assets/product-beach-towel.jpg";
import bathMatImage from "@/assets/product-bath-mat.jpg";

// Fallback gallery images for product categories - 2-3 product-specific images only
const categoryGalleryImages: Record<string, string[]> = {
  // Çarçafë - imazhe çarçafësh dhe shtresa
  "carcafe": [sheetsImage, duvetImage, pillowImage],
  // Jorgan - imazhe jorgnash dhe batanijesh
  "jorgan": [duvetImage, blanketImage, sheetsImage],
  // Dyshekë - imazhe dyshekësh dhe mbrojtëse
  "dysheke": [mattressImage, protectorImage],
  // Jastëk gjumi - imazhe jastëkësh
  "jastek-gjumi": [pillowImage, cushionsImage],
  // Batanije - imazhe batanijesh dhe jorgnash
  "batanije": [blanketImage, duvetImage],
  // Mbrojtëse - imazhe mbrojtëse dysheku
  "mbrojtese": [protectorImage, mattressImage],
  // Mbulesa tavoline - imazhe mbulesa tavoline
  "mbulesa-tavoline": [tableclothImage],
  // Perde - imazhe perdesh
  "perde": [curtainsImage],
  // Grila - imazhe grilaash
  "grila": [curtainsImage],
  // Peshqirë - imazhe peshqirësh
  "peshqire": [towelsImage, bathMatImage, beachTowelImage],
  // Peshqir plazhi - imazhe peshqirë plazhi
  "peshqir-plazhi": [beachTowelImage, towelsImage],
  // Peshqirë këmbësh - imazhe peshqirë këmbësh
  "peshqire-kembesh": [bathMatImage, towelsImage],
  // Rrobdishane/Bornoz - imazhe bornoz
  "rrobdishane": [bathrobeImage, slippersImage],
  // Shapka - VETËM imazhe shapka (shower cap)
  "shapka": [showerCapImage, amenitiesImage],
  // Shilte - imazhe shilte/jastëk dekorativ
  "shilte": [cushionsImage, pillowImage],
  // Amenities - imazhe amenities
  "skin-essentials": [amenitiesImage, showerCapImage, slippersImage],
  "le-jardin-med": [amenitiesImage, showerCapImage, slippersImage],
  "sarbacane": [amenitiesImage, showerCapImage, slippersImage],
  "good-to-declare": [amenitiesImage, showerCapImage, slippersImage],
  "per-femijet": [amenitiesImage, towelsImage],
  // Pantofla - imazhe pantofla
  "accessories-slippers": [slippersImage, bathrobeImage],
};

// Default fallback - 2 neutral product images
const defaultGallery = [sheetsImage, towelsImage];

const ProductDetail = () => {
  const { categorySlug, productSlug } = useParams();
  const { data: category } = useCategoryBySlug(categorySlug);
  const { data: product, isLoading } = useProductBySlug(categorySlug, productSlug);
  const [selectedImage, setSelectedImage] = useState(0);

  const openWhatsApp = () => {
    const phone = "355686000626";
    const message = `Përshëndetje! Jam i interesuar për produktin: ${product?.name} (${category?.name}). Mund të më jepni një ofertë?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Get images with fallback
  const getImages = () => {
    if (product?.images && product.images.length > 0 && product.images[0] && !product.images[0].includes("placeholder")) {
      return product.images;
    }
    // Use category-specific gallery or default
    return categoryGalleryImages[categorySlug || ""] || defaultGallery;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <Skeleton className="aspect-square rounded-sm" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-48" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product || !category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 container mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl mb-4">Produkti nuk u gjet</h1>
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

  const images = getImages();

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Generate SEO metadata
  const seoTitle = (product as any).meta_title || `${product.name} - ${category.name} | EMA Hotelling`;
  const seoDescription = (product as any).meta_description || product.description || `Blini ${product.name} cilësore për hotele dhe biznese mikpritjeje. Produkt premium nga EMA Hotelling.`;
  const productImage = images[0] || "";

  return (
    <div className="min-h-screen bg-background">
      <DynamicSeoHead
        title={seoTitle}
        description={seoDescription}
        ogImage={productImage}
        ogType="product"
        canonicalUrl={`https://hoteluxe-fabrics.lovable.app/produktet/${categorySlug}/${productSlug}`}
      />
      <Header />
      
      {/* Breadcrumb */}
      <section className="pt-28 pb-4 md:pt-32">
        <div className="container mx-auto px-4">
          <nav className="text-muted-foreground text-sm">
            <Link to="/" className="hover:text-foreground transition-colors">
              Kreu
            </Link>
            <span className="mx-2">/</span>
            <Link to="/produktet" className="hover:text-foreground transition-colors">
              Produktet
            </Link>
            <span className="mx-2">/</span>
            <Link to={`/produktet/${categorySlug}`} className="hover:text-foreground transition-colors">
              {category.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image with Navigation */}
              <div className="relative aspect-square overflow-hidden bg-muted rounded-[15px] group">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover luxury-transition"
                />
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background luxury-transition z-10 rounded-full opacity-0 group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background luxury-transition z-10 rounded-full opacity-0 group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                    </button>
                  </>
                )}

                {/* Image counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 text-xs font-medium text-foreground">
                    {selectedImage + 1} / {images.length}
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative aspect-square overflow-hidden rounded-[15px] border-2 transition-all ${
                        selectedImage === idx ? "border-foreground" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-foreground tracking-tight">
                  {product.name}
                </h1>
              </div>

              {product.description ? (
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  {product.description}
                </p>
              ) : (
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  Produkt premium i cilësisë së lartë, i projektuar për industrinë e mikpritjes dhe hotelerisë. 
                  Materialet janë të zgjedhura me kujdes për të garantuar komoditet dhe qëndrueshmëri maksimale.
                </p>
              )}

              {/* Features from new product_features JSONB - text only */}
              {(product as any).product_features && (product as any).product_features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-foreground">Karakteristikat:</h3>
                  <ProductFeaturesDisplay features={(product as any).product_features} />
                </div>
              )}

              {/* Legacy Features - simple string array (fallback) */}
              {product.features && product.features.length > 0 && !(product as any).product_features?.length && (
                <div className="space-y-3">
                  <h3 className="font-medium text-foreground">Karakteristikat:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <Check className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Product Variants */}
              {(product as any).variants && (product as any).variants.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <h3 className="font-medium text-foreground">Variantet e disponueshme:</h3>
                  <ProductVariantsDisplay variants={(product as any).variants} />
                </div>
              )}

              {/* Washing Icons - New JSONB field with uploaded icons */}
              {(product as any).washing_icons && (product as any).washing_icons.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <h3 className="font-medium text-foreground">Udhëzimet e Larjes</h3>
                  <WashingIconsDisplay icons={(product as any).washing_icons} />
                </div>
              )}

              {/* Specifications (legacy - keep for backwards compatibility) */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-foreground">Specifikimet:</h3>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="contents">
                        <dt className="text-muted-foreground">{key}:</dt>
                        <dd className="text-foreground">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* CTA */}
              <div className="pt-4 space-y-4 border-t border-border">
                <Button 
                  size="lg" 
                  onClick={openWhatsApp}
                  className="w-full md:w-auto group text-base px-8"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Merr një ofertë
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-muted-foreground text-sm">
                  Çmimet janë të personalizuara sipas porosisë. Na kontaktoni për një ofertë të detajuar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <RelatedProducts 
        categoryId={category.id} 
        categorySlug={categorySlug || ""} 
        currentProductId={product.id} 
      />

      {/* Back Navigation */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Link to={`/produktet/${categorySlug}`}>
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kthehu te {category.name}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProductDetail;
