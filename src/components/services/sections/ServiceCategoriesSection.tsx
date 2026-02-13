import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageSection } from "@/hooks/usePageSections";
import { ServicePage } from "@/hooks/useServicePages";
import { useCategories } from "@/hooks/useCategories";

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

interface ServiceCategoriesSectionProps {
  section: PageSection;
  service: ServicePage;
}

export function ServiceCategoriesSection({ section, service }: ServiceCategoriesSectionProps) {
  const { data: categories, isLoading } = useCategories();

  // Priority: section.items > service.recommended_categories
  // section.items can be string[] or object[] with slug property
  const sectionItems = section.items as any[] | null;
  let categorySlugs: string[] = [];
  
  if (sectionItems && sectionItems.length > 0) {
    // Handle both string array and object array formats
    categorySlugs = sectionItems.map(item => 
      typeof item === 'string' ? item : (item?.slug || '')
    ).filter(Boolean);
  }
  
  // Fallback to service.recommended_categories if section.items is empty
  if (categorySlugs.length === 0 && service.recommended_categories) {
    categorySlugs = service.recommended_categories;
  }

  // Filter categories that match the slugs and preserve order
  const recommendedCategories = categorySlugs
    .map(slug => categories?.find(cat => cat.slug === slug))
    .filter(Boolean) as { id: string; slug: string; name: string; image_url: string | null }[];

  const getCategoryImage = (category: { slug: string; image_url: string | null }) => {
    if (category.image_url && !category.image_url.includes("placeholder")) {
      return category.image_url;
    }
    return categoryImageFallbacks[category.slug] || sheetsImage;
  };

  // Show section even while loading if we have slugs configured
  if (!isLoading && recommendedCategories.length === 0) {
    return null;
  }

  const title = section.title || "Kategoritë e sugjeruara";
  const subtitle = section.subtitle || "Produkte të rekomanduara";

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-muted-foreground font-medium text-xs tracking-widest uppercase mb-6 block">
            {subtitle}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            {section.content || `Zbuloni produktet tona më të përdorura për ${service.title.toLowerCase()}.`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recommendedCategories.map((category) => (
              <Link
                key={category.id}
                to={`/produktet/${category.slug}`}
                className="group cursor-pointer luxury-transition block"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[15px] border border-border">
                  <img
                    src={getCategoryImage(category)}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover luxury-transition group-hover:scale-105"
                  />
                </div>
                <div className="pt-3 px-1">
                  <h3 className="font-serif text-lg font-medium text-foreground line-clamp-1">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/produktet">
            <Button variant="outline" size="lg" className="group">
              {section.button_text || "Shiko të gjitha kategoritë"}
              <ArrowRight className="w-4 h-4 ml-2 luxury-transition group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
