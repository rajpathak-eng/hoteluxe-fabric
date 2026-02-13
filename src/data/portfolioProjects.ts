// Static portfolio data - 3 real projects only
import restaurantImage from "@/assets/industry-restaurant.jpg";
import hotelImage from "@/assets/industry-hotel.jpg";
import guesthouseImage from "@/assets/industry-guesthouse.jpg";
import meliaDurresImage from "@/assets/project-melia-durres.jpg";
import xhaBeqoImage from "@/assets/project-xha-beqo.jpg";
import artigianoImage from "@/assets/project-artigiano.jpg";

// Product images
import sheetsImage from "@/assets/product-sheets-new.jpg";
import towelsImage from "@/assets/product-towels-new.jpg";
import duvetImage from "@/assets/product-duvet.jpg";
import pillowImage from "@/assets/product-sleeping-pillow.jpg";
import tableclothImage from "@/assets/product-tablecloth.jpg";
import bathrobeImage from "@/assets/product-bathrobe.jpg";

export interface ProjectProduct {
  name: string;
  slug: string;
  categorySlug: string;
  image: string;
}

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  tag: "Hotel" | "Restorante" | "Bujtinë";
  description: string;
  environment: string;
  goal: string;
  heroImage: string;
  gallery: string[];
  products: ProjectProduct[];
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "1",
    slug: "restorant-artigiano",
    title: "Restorant Artigiano",
    tag: "Restorante",
    description: "Furnizim komplet me tekstile elegante për restorantin Artigiano. Mbulesa tavoline me dizajn të sofistikuar, peceta premium dhe tekstile kuzhine profesionale që reflektojnë standardet e larta të gastronomisë italiane.",
    environment: "Sallë restoranti, hapësirë VIP dhe kuzhinë profesionale",
    goal: "Krijimi i një atmosfere elegante dhe të rafinuar që përputhet me konceptin e kuzhinës artizanale italiane, duke ofruar eksperiencë të paharrueshme për klientët.",
    heroImage: artigianoImage,
    gallery: [artigianoImage, tableclothImage, towelsImage],
    products: [
      { name: "Mbulesa tavoline premium", slug: "mbulesa-tavoline-premium", categorySlug: "mbulesa-tavoline", image: tableclothImage },
      { name: "Peceta tekstili", slug: "peceta-tekstili", categorySlug: "mbulesa-tavoline", image: tableclothImage },
      { name: "Peshqirë kuzhine profesionale", slug: "peshqire-kuzhine", categorySlug: "peshqire", image: towelsImage },
    ],
  },
  {
    id: "2",
    slug: "hotel-melia-durres",
    title: "Hotel Melia Durrës",
    tag: "Hotel",
    description: "Furnizim i plotë me tekstile premium për Melia Hotel Durrës, duke përmbushur standardet ndërkombëtare të zinxhirit Melia. Projekti përfshiu tekstile për dhomat, banjot, zonën e SPA-s dhe hapësirat e përbashkëta.",
    environment: "Dhoma hoteli, banjo luksoze, SPA dhe zona të përbashkëta",
    goal: "Përmbushja e standardeve të larta të zinxhirit Melia duke ofruar komoditet maksimal dhe estetikë moderne për mysafirët ndërkombëtarë.",
    heroImage: meliaDurresImage,
    gallery: [meliaDurresImage, sheetsImage, towelsImage, duvetImage, pillowImage, bathrobeImage],
    products: [
      { name: "Çarçafë premium 400TC", slug: "carcafe-premium-400tc", categorySlug: "carcafe", image: sheetsImage },
      { name: "Peshqirë SPA luxury", slug: "peshqire-spa-luxury", categorySlug: "peshqire", image: towelsImage },
      { name: "Jorgan premium", slug: "jorgan-premium", categorySlug: "jorgane", image: duvetImage },
      { name: "Jastëk ortopedik", slug: "jastek-ortopedik", categorySlug: "jastek-gjumi", image: pillowImage },
      { name: "Bornoz SPA", slug: "bornoz-spa", categorySlug: "bornoz", image: bathrobeImage },
    ],
  },
  {
     id: "3",
     slug: "agroturizmi-xha-beqo",
     title: "Agroturizmi Xha Beqo",
     tag: "Bujtinë",
     description: "Tekstile autentike dhe cilësore për bujtinën tradicionale Xha Beqo. Kombinim i komoditetit modern me frymëzimin tradicional shqiptar, duke ofruar një përvojë unike për turistët.",
     environment: "Dhoma të stilit tradicional, banjo dhe hapësira të përbashkëta",
     goal: "Krijimi i një atmosfere të ngrohtë dhe autentike që reflekton mikpritjen tradicionale shqiptare, me tekstile cilësore që garantojnë komoditet për mysafirët.",
     heroImage: xhaBeqoImage,
     gallery: [xhaBeqoImage, sheetsImage, towelsImage, pillowImage],
    products: [
      { name: "Çarçafë pambuku", slug: "carcafe-pambuku", categorySlug: "carcafe", image: sheetsImage },
      { name: "Peshqirë standard plus", slug: "peshqire-standard-plus", categorySlug: "peshqire", image: towelsImage },
      { name: "Jastëk komod", slug: "jastek-komod", categorySlug: "jastek-gjumi", image: pillowImage },
    ],
  },
];
