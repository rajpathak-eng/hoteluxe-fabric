import aboutTextilesImage from "@/assets/about-textiles.jpg";
 import { usePageSection } from "@/hooks/usePageSections";

const AboutSection = () => {
   const { data: section } = usePageSection("home", "about");
 
  return (
    <section id="about" className="py-12 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <span className="typo-label text-muted-foreground mb-6">
               {section?.subtitle || "Rreth nesh"}
            </span>
            <h2 className="typo-h2 text-foreground mb-8">
               {section?.title || "Partneri juaj i besueshëm për tekstile profesionale"}
            </h2>
             {section?.content ? (
               <div 
                 className="space-y-5 text-muted-foreground leading-relaxed prose prose-p:font-normal"
                 dangerouslySetInnerHTML={{ __html: section.content }}
               />
             ) : (
               <div className="space-y-5 text-muted-foreground leading-relaxed">
                 <p className="font-normal">
                   Me më shumë se një dekadë përvojë në industrinë e tekstileve për sektorin e mikpritjes, 
                   EMA Hotelling është bërë emri i besuar për hotele, restorante dhe biznese të tjera 
                   që kërkojnë cilësi të lartë me çmime konkurruese.
                 </p>
                 <p className="font-normal">
                   Ne ofrojmë një gamë të gjerë produktesh që përfshijnë çarçafë, peshqirë, jorganë, perde 
                   dhe shumë më tepër – të gjitha të prodhuara me materiale premium që garantojnë qëndrueshmëri 
                   dhe komoditet maksimal.
                 </p>
                 <p className="font-normal">
                   Qëllimi ynë është të sigurojmë që çdo klient të marrë produkte që jo vetëm plotësojnë 
                   standardet e industrisë, por edhe i tejkalojnë ato.
                 </p>
               </div>
             )}
          </div>
          
          {/* Square Image - Premium Textiles */}
          <div className="order-1 lg:order-2">
            <div className="relative group">
              <img 
                 src={section?.image_url || aboutTextilesImage} 
                alt="Tekstile premium hotelerie - EMA Hotelling" 
                className="w-full aspect-square object-cover luxury-transition group-hover:brightness-105 rounded-[15px]" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;