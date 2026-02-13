import { usePageSections } from "@/hooks/useCms";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface CertificationItem {
  name: string;
  image: string | null;
}

const CertificationsSection = () => {
  const { data: sections } = usePageSections("home");
  const section = sections?.find((s) => s.section_key === "certifications");

  if (!section?.is_active) return null;

  const items: CertificationItem[] = (section.items as CertificationItem[]) || [];
  const itemsWithImages = items.filter((item) => item.image);

  if (itemsWithImages.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-14 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        {(section.subtitle || section.title) && (
          <div className="text-center mb-12">
            {section.subtitle && (
              <span className="typo-label text-muted-foreground mb-4">
                {section.subtitle}
              </span>
            )}
            {section.title && (
              <h2 className="typo-h2 text-foreground">
                {section.title}
              </h2>
            )}
          </div>
        )}

        {/* Logos Carousel */}
        <div className="relative px-12 md:px-16">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {itemsWithImages.map((item, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 md:pl-6 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                >
                  <div className="flex items-center justify-center p-4 md:p-6 bg-background rounded-[15px] shadow-sm hover:shadow-md transition-all duration-300 h-24 md:h-28">
                    <img
                      src={item.image!}
                      alt={item.name}
                      title={item.name}
                      className="max-h-14 md:max-h-16 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
