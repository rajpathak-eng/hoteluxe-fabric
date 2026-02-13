import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { PageSection } from "@/hooks/usePageSections";

interface PersonalizimGalleryProps {
  data: PageSection;
}

const defaultGallery = [
  { src: "/placeholder.svg", alt: "Peshqirë me logo hotelerie", caption: "Peshqirë premium me logo të qendisur" },
  { src: "/placeholder.svg", alt: "Çarçafë me branding", caption: "Çarçafë hotelerie me dizajn të personalizuar" },
  { src: "/placeholder.svg", alt: "Set krevatesh hotelerie", caption: "Set i plotë krevatesh për hotele 5-yjesh" },
  { src: "/placeholder.svg", alt: "Perde elegante", caption: "Perde luksoze për ambiente hoteliere" },
  { src: "/placeholder.svg", alt: "Uniforma personale", caption: "Uniforma stafi të personalizuara" },
  { src: "/placeholder.svg", alt: "Aksesorë spa", caption: "Aksesorë spa & wellness me branding" }
];

const PersonalizimGallery = ({ data }: PersonalizimGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const title = data?.title || "Shembuj të punës sonë";
  const subtitle = data?.subtitle || "Portfolio";
  const content = data?.content || "Shikoni disa nga projektet e personalizimit që kemi realizuar për klientët tanë.";
  
  // Use gallery array from CMS or default
  const galleryImages = data?.gallery?.map((src, index) => ({
    src,
    alt: `Portfolio image ${index + 1}`,
    caption: ""
  })) || defaultGallery;

  const openLightbox = (index: number) => setSelectedImage(index);
  const closeLightbox = () => setSelectedImage(null);
  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
    }
  };
  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-muted-foreground font-medium text-xs tracking-widest uppercase mb-6 block">
            {subtitle}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-6 tracking-tight">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            {content}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <button
              key={index}
              onClick={() => openLightbox(index)}
              className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 luxury-transition"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 luxury-transition flex items-end">
                {image.caption && (
                  <div className="p-4 translate-y-full group-hover:translate-y-0 luxury-transition">
                    <p className="text-primary-foreground text-sm font-medium">
                      {image.caption}
                    </p>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Lightbox */}
        <Dialog open={selectedImage !== null} onOpenChange={closeLightbox}>
          <DialogContent className="max-w-5xl bg-background/95 backdrop-blur-sm border-0 p-0">
            <div className="relative">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 p-2 bg-background/80 rounded-full hover:bg-background luxury-transition"
              >
                <X className="w-5 h-5" />
              </button>
              
              {selectedImage !== null && (
                <>
                  <img
                    src={galleryImages[selectedImage].src}
                    alt={galleryImages[selectedImage].alt}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                  
                  {galleryImages[selectedImage].caption && (
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <p className="text-foreground font-medium">
                        {galleryImages[selectedImage].caption}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-background/80 rounded-full hover:bg-background luxury-transition"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-background/80 rounded-full hover:bg-background luxury-transition"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default PersonalizimGallery;
