import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageSection, PageSection } from "@/hooks/usePageSections";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface FeaturedProductItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  category_slug: string;
}

interface FeaturedProductsSectionProps {
  section?: PageSection;
  pageSlug?: string;
  sectionKey?: string;
}

function ProductCard({ item }: { item: FeaturedProductItem }) {
  const href = item.category_slug
    ? `/produktet/${item.category_slug}/${item.slug}`
    : `/produktet`;

  return (
    <Link
      to={href}
      className="group cursor-pointer luxury-transition block"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[15px] border border-border">
        <img
          src={item.image}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover luxury-transition group-hover:scale-105"
        />
      </div>
      <div className="pt-3 px-1">
        <h3 className="font-serif text-sm md:text-base font-medium text-foreground line-clamp-1">
          {item.name}
        </h3>
      </div>
    </Link>
  );
}

const FeaturedProductsSection = ({ section: externalSection, pageSlug = "home", sectionKey = "featured-products" }: FeaturedProductsSectionProps) => {
  const { data: fetchedSection, isLoading } = usePageSection(pageSlug, sectionKey);
  const section = externalSection || fetchedSection;
  const isMobile = useIsMobile();

  if (isLoading && !externalSection) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Skeleton className="h-4 w-32 mx-auto mb-4" />
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-[15px]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!section) return null;

  const items: FeaturedProductItem[] = Array.isArray(section.items) ? section.items as FeaturedProductItem[] : [];

  if (items.length === 0) return null;

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          {section.subtitle && (
            <span className="typo-label text-muted-foreground mb-4">
              {section.subtitle}
            </span>
          )}
          {section.title && (
            <h2 className="typo-h2 text-foreground mb-4">
              {section.title}
            </h2>
          )}
          {section.content && (
            <p className="typo-body text-muted-foreground max-w-2xl mx-auto">
              {section.content}
            </p>
          )}
        </div>

        {isMobile ? (
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-3">
              {items.map((item) => (
                <CarouselItem key={item.id} className="pl-3 basis-[70%]">
                  <ProductCard item={item} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-4 mt-6">
              <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0 h-10 w-10 border-border bg-background" />
              <CarouselNext className="relative inset-0 translate-x-0 translate-y-0 h-10 w-10 border-border bg-background" />
            </div>
          </Carousel>
        ) : (
          <div className="grid grid-cols-5 gap-4 md:gap-5">
            {items.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {section.button_text && (
          <div className="text-center mt-10">
            <Link
              to={section.button_url || "/produktet"}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground luxury-transition"
            >
              {section.button_text}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
