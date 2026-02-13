import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useRelatedProducts } from "@/hooks/useRelatedProducts";

// Import fallback images
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
  "peshqire": towelsImage
};
interface RelatedProductsProps {
  categoryId: string;
  categorySlug: string;
  currentProductId: string;
}
const RelatedProducts = ({
  categoryId,
  categorySlug,
  currentProductId
}: RelatedProductsProps) => {
  const {
    data: relatedProducts,
    isLoading
  } = useRelatedProducts(categoryId, currentProductId);
  if (isLoading || !relatedProducts || relatedProducts.length === 0) {
    return null;
  }
  const getProductImage = (product: {
    images: string[] | null;
  }) => {
    if (product.images && product.images.length > 0 && product.images[0] && !product.images[0].includes("placeholder")) {
      return product.images[0];
    }
    return categoryImages[categorySlug] || hotelImage;
  };
  return <section className="py-16 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground tracking-tight">
            Produkte të ngjashme
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.map(product => <Link key={product.id} to={`/produktet/${categorySlug}/${product.slug}`} className="group cursor-pointer luxury-transition block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[15px] border border-border">
                <img src={getProductImage(product)} alt={product.name} className="absolute inset-0 w-full h-full object-cover luxury-transition group-hover:scale-105" />
              </div>
              <div className="pt-3 px-1">
                <h3 className="font-serif text-base md:text-lg font-medium text-foreground line-clamp-1">
                  {product.name}
                </h3>
              </div>
            </Link>)}
        </div>
      </div>
    </section>;
};
export default RelatedProducts;