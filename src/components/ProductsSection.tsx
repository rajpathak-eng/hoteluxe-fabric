import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageSection } from "@/hooks/usePageSections";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback images for categories without custom images
import sheetsImage from "@/assets/product-sheets-new.jpg";
import duvetImage from "@/assets/product-duvet.jpg";
import mattressImage from "@/assets/product-mattress-new.jpg";
import pillowImage from "@/assets/product-sleeping-pillow.jpg";
import blanketImage from "@/assets/product-blanket.jpg";
import protectorImage from "@/assets/product-mattress-protector.jpg";
import tableclothImage from "@/assets/product-tablecloth.jpg";
import curtainsImage from "@/assets/product-curtains-new.jpg";
import amenitiesImage from "@/assets/product-amenities.jpg";
import towelsImage from "@/assets/product-towels-new.jpg";

const fallbackImages: Record<string, string> = {
  "carcafe": sheetsImage,
  "carçafe": sheetsImage,
  "jorgane": duvetImage,
  "dysheke": mattressImage,
  "jastek-gjumi": pillowImage,
  "batanije": blanketImage,
  "mbrojtese-dysheku": protectorImage,
  "mbulesa-tavoline": tableclothImage,
  "perde-grila": curtainsImage,
  "peshqire": towelsImage,
  "amenities": amenitiesImage,
};

interface SelectedCategory {
  id: string;
  slug: string;
  name: string;
  image_url?: string | null;
}

const ProductsSection = () => {
  const { data: section, isLoading: sectionLoading } = usePageSection("home", "products");
  const { data: allCategories, isLoading: categoriesLoading } = useCategories();

  // Get selected categories from section items, or fall back to all categories
  const selectedCategories: SelectedCategory[] = Array.isArray(section?.items) && section.items.length > 0
    ? section.items as SelectedCategory[]
    : [];

  // Build display categories - use section items if available, otherwise use all categories
  const displayCategories = selectedCategories.length > 0
    ? selectedCategories.map(sc => {
        // Find the actual category to get updated name if needed
        const dbCategory = allCategories?.find(c => c.id === sc.id);
        return {
          id: sc.id,
          slug: sc.slug,
          name: dbCategory?.name || sc.name,
          // Use section-specific image, or fall back to DB image, or fallback
          image_url: sc.image_url || dbCategory?.image_url || fallbackImages[sc.slug] || sheetsImage,
        };
      })
    : allCategories?.map(c => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        image_url: c.image_url || fallbackImages[c.slug] || sheetsImage,
      })) || [];

  const isLoading = sectionLoading || categoriesLoading;

  return (
    <section id="products" className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="typo-label text-muted-foreground mb-4">
            {section?.subtitle || "Produktet tona"}
          </span>
          <h2 className="typo-h2 text-foreground mb-4">
            {section?.title || "Kategoritë e tekstileve"}
          </h2>
          <p className="typo-body text-muted-foreground max-w-2xl mx-auto">
            {section?.content || "Koleksion premium produktesh tekstile për industrinë e mikpritjes dhe hotelerisë."}
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-[15px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {displayCategories.map((category) => (
              <Link
                key={category.id}
                to={`/produktet/${category.slug}`}
                className="group cursor-pointer luxury-transition block"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[15px] border border-border">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover luxury-transition group-hover:scale-105"
                  />
                </div>
                <div className="pt-3 px-1">
                  <h3 className="font-serif text-sm md:text-base font-medium text-foreground line-clamp-1">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
