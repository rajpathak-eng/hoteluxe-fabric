import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategories";
import type { PageSection } from "@/hooks/usePageSections";

// Import category images for fallbacks
import sheetsImage from "@/assets/product-sheets-new.jpg";
import duvetImage from "@/assets/product-duvet.jpg";
import pillowImage from "@/assets/product-sleeping-pillow.jpg";
import blanketImage from "@/assets/product-blanket.jpg";
import protectorImage from "@/assets/product-mattress-protector.jpg";
import tableclothImage from "@/assets/product-tablecloth.jpg";
import towelsImage from "@/assets/product-towels-new.jpg";

const categoryImageFallbacks: Record<string, string> = {
  "carcafe": sheetsImage,
  "jorgan": duvetImage,
  "jastek-gjumi": pillowImage,
  "batanije": blanketImage,
  "mbrojtese": protectorImage,
  "mbulesa-tavoline": tableclothImage,
  "peshqire": towelsImage,
};

interface ServiceRecommendedProductsProps {
  data: PageSection;
}

const ServiceRecommendedProducts = ({ data }: ServiceRecommendedProductsProps) => {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  
  const sectionLabel = data?.subtitle || "Produkte të rekomanduara";
  const title = data?.title || "Kategoritë e sugjeruara";
  const description = data?.content || "Zbuloni produktet tona më të përdorura për këtë shërbim.";
  const buttonText = data?.button_text || "Shiko të gjitha kategoritë";
  const buttonUrl = data?.button_url || "/produktet";
  
  // Items contains the recommended category slugs
  const recommendedSlugs: string[] = Array.isArray(data?.items) 
    ? data.items.map(item => typeof item === 'string' ? item : (item as any).slug || '')
    : [];

  // Filter recommended categories
  const recommendedCategories = recommendedSlugs.length > 0
    ? categories?.filter((cat) => recommendedSlugs.includes(cat.slug))
    : categories?.slice(0, 5); // Show first 5 if no specific ones configured

  // Get category image with fallback
  const getCategoryImage = (category: { slug: string; image_url: string | null }) => {
    if (category.image_url && !category.image_url.includes("placeholder")) {
      return category.image_url;
    }
    return categoryImageFallbacks[category.slug] || sheetsImage;
  };

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-muted-foreground font-medium text-xs tracking-widest uppercase mb-6 block">
            {sectionLabel}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4 tracking-tight">
            {title}
          </h2>
          <p 
            className="text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recommendedCategories?.map((category) => (
              <Link
                key={category.id}
                to={`/produktet/${category.slug}`}
                className="group relative overflow-hidden cursor-pointer luxury-transition hover-lift rounded-[15px]"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-[15px]">
                  <img
                    src={getCategoryImage(category)}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover luxury-transition group-hover:scale-105 rounded-[15px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent rounded-[15px]" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-serif text-lg font-medium text-primary-foreground mb-2">
                    {category.name}
                  </h3>
                  <span className="text-xs font-medium tracking-wide text-primary-foreground opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 luxury-transition flex items-center gap-1.5">
                    Shiko produktet
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to={buttonUrl}>
            <Button variant="outline" size="lg" className="group">
              {buttonText}
              <ArrowRight className="w-4 h-4 ml-2 luxury-transition group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceRecommendedProducts;
