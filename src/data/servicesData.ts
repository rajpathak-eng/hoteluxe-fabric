// Static services data for individual service pages
import hotelImage from "@/assets/industry-hotel.jpg";
import restaurantImage from "@/assets/industry-restaurant.jpg";
import airbnbImage from "@/assets/industry-airbnb.jpg";
import resortImage from "@/assets/industry-resort.jpg";
import guesthouseImage from "@/assets/industry-guesthouse.jpg";
import spaImage from "@/assets/industry-spa.jpg";

export interface ServicePageData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  features: string[];
  recommendedCategories: string[]; // category slugs from database
  metaTitle?: string;
  metaDescription?: string;
}

export const servicesPageData: Record<string, ServicePageData> = {
  "tekstile-per-hotele": {
    slug: "tekstile-per-hotele",
    title: "Tekstile për hotele",
    subtitle: "Zgjidhje të kompletuara për hotele me pesë yje",
    metaTitle: "Tekstile për hotele – EMA Hotelling, cilësi premium",
    metaDescription: "Zgjidhje të kompletuara për tekstilet e hoteleve me pesë yje – çarçafë, jorganë, batanije dhe jastëkë gjumi me cilësi të lartë dhe dizajn elegant.",
    description: `EMA Hotelling ofron zgjidhje të kompletuara për arredimin dhe tekstilet e hoteleve me pesë yje. Që nga viti 2010, ne kemi ndjekur një rrugë të qëndrueshme zhvillimi në industrinë e tekstileve, duke sjellë produkte me cilësi të lartë dhe dizajn elegant.

Produktet tona për hotele përfshijnë linjat e çarçafëve, jorganëve, batanijeve dhe jastëkëve të gjumit, të gjitha të dizajnuara për të ofruar rehati maksimale dhe një përvojë luksoze për mysafirët tuaj. Me ekspertizën e ekipit tonë prej më shumë se 15 profesionistësh, ne sigurojmë që çdo dhomë hoteli të jetë e përgatitur për të kënaqur të gjitha shqisat e mysafirëve.`,
    heroImage: hotelImage,
    features: [
      "Çarçafë premium me thread count të lartë (300-600TC)",
      "Jorganë të lehtë dhe të ngrohtë me dizajn elegant",
      "Batanije luksoze për çdo sezon",
      "Jastëkë gjumi ergonomikë dhe hipoalergjikë",
      "Produkte të qëndrueshme për larje industriale",
      "Personalizim me logon e hotelit",
    ],
    recommendedCategories: ["carcafe", "jorgan", "batanije", "jastek-gjumi", "mbrojtese"],
  },
  "tekstile-per-restorante": {
    slug: "tekstile-per-restorante",
    title: "Tekstile për restorante",
    subtitle: "Elegancë dhe cilësi për çdo ambient gastronomik",
    metaTitle: "Tekstile për restorante – EMA Hotelling, elegancë dhe cilësi",
    metaDescription: "Tekstile të dizajnuara për restorante – mbulesa tavoline, servieta dhe aksesorë të tjerë për një ambient luksoz dhe të përshtatshëm për mysafirët tuaj.",
    description: `EMA Hotelling ofron tekstile profesionale për restorante, duke kombinuar dizajn elegant dhe material cilësor. Qëllimi ynë është që çdo ambient të reflektojë stil, rehati dhe higjienë, duke përmirësuar përvojën e mysafirëve.

Nga mbulesat e tavolinave deri te servietat dhe aksesorët tekstil, produktet tona janë krijuar për t'u përshtatur me çdo temë dhe stil të restorantit tuaj. Me një ekip ekspertësh dhe një përvojë të gjatë në industrinë e tekstileve, EMA Hotelling garanton që çdo detaj i ambientit tuaj të jetë i përgatitur për të impresionuar mysafirët.`,
    heroImage: restaurantImage,
    features: [
      "Mbulesa tavolinash elegante në stile të ndryshme",
      "Servieta cilësore për çdo rast",
      "Tekstile kuzhine profesionale",
      "Materiale rezistente ndaj njollave",
      "Dizajne të personalizuara sipas temës",
      "Personalizim me logon e restorantit",
    ],
    recommendedCategories: ["mbulesa-tavoline", "peshqire"],
  },
  "tekstile-per-airbnb": {
    slug: "tekstile-per-airbnb",
    title: "Tekstile të dedikuara për Airbnb",
    subtitle: "Komfort dhe estetikë për çdo pronë",
    metaTitle: "Tekstile për Airbnb – EMA Hotelling, komfort dhe estetikë",
    metaDescription: "Siguroni që çdo mysafir të ndjejë rehati maksimale me tekstilet tona për Airbnb – çarçafë, jorganë, jastëkë dhe batanije luksoze.",
    description: `EMA Hotelling ofron tekstile të dizajnuara posaçërisht për pronarët e Airbnb, duke sjellë rehati, stil dhe cilësi në çdo pronë. Që nga çarçafët dhe jorganët, te jastëkët e gjumit dhe batanijet, produktet tona janë të krijuara për të garantuar një qëndrim të këndshëm dhe të paharrueshëm për mysafirët.

Me një ekip profesional dhe mbi një dekadë përvojë në industrinë e tekstileve, EMA Hotelling siguron që çdo ambient të jetë i freskët, i rehatshëm dhe estetikisht tërheqës, duke rritur kënaqësinë e mysafirëve dhe vlerën e pronës suaj Airbnb.`,
    heroImage: airbnbImage,
    features: [
      "Çarçafë cilësorë me çmime konkurruese",
      "Jorganë sezonale - të lehtë dhe të ngrohtë",
      "Jastëkë gjumi komodë dhe të qëndrueshëm",
      "Batanije luksoze për çdo sezon",
      "Produkte Easy Care - thahen shpejt",
      "Ngjyra neutrale që përshtaten me çdo dekor",
    ],
    recommendedCategories: ["carcafe", "jorgan", "jastek-gjumi", "batanije", "peshqire"],
  },
  "tekstile-per-resorte": {
    slug: "tekstile-per-resorte",
    title: "Tekstile për resorte",
    subtitle: "Luksi dhe eleganca për resorte premium",
    metaTitle: "Tekstile për resorte – EMA Hotelling, luksi premium",
    metaDescription: "Tekstile luksoze për resorte bregdetare dhe malore – peshqirë plazhi, çarçafë premium dhe jorganë të cilësisë më të lartë.",
    description: `EMA Hotelling ofron tekstile të nivelit më të lartë për resorte bregdetare dhe malore. Produktet tona janë të dizajnuara për të përballuar kushtet e veçanta të ambienteve të resorteve, duke ruajtur elegancën dhe rehatinë që mysafirët presin.

Nga peshqirët e plazhit deri te çarçafët premium dhe jorganët, çdo produkt është zgjedhur me kujdes për të ofruar qëndrueshmëri maksimale dhe një përvojë luksoze. Me tekstilet tona, resorti juaj do të dallohet për cilësinë dhe vëmendjen ndaj detajeve.`,
    heroImage: resortImage,
    features: [
      "Peshqirë plazhi të mëdhenj dhe absorbuese",
      "Çarçafë premium rezistentë ndaj diellit",
      "Jorganë të lehtë për klima të ngrohta",
      "Tekstile pishinash profesionale",
      "Materiale që thahen shpejt",
      "Personalizim me logon e resortit",
    ],
    recommendedCategories: ["peshqire", "carcafe", "jorgan", "batanije"],
  },
  "tekstile-per-bujtina": {
    slug: "tekstile-per-bujtina",
    title: "Tekstile për bujtina",
    subtitle: "Cilësi hotelerie për mikpritje tradicionale",
    metaTitle: "Tekstile për bujtina – EMA Hotelling, mikpritje cilësore",
    metaDescription: "Tekstile cilësore për bujtina tradicionale dhe moderne – çarçafë, peshqirë dhe jorganë që kombinojnë rehatinë me mikpritjen autentike.",
    description: `EMA Hotelling ofron tekstile të përshtatshme për bujtina tradicionale dhe moderne. Produktet tona kombinojnë cilësinë e hoteleve me ngrohtësinë e mikpritjes tradicionale shqiptare, duke ofruar një përvojë të veçantë për mysafirët.

Çdo produkt është zgjedhur për të ofruar rehati maksimale dhe qëndrueshmëri, duke garantuar që bujtina juaj të dallohet për cilësinë e tekstileve dhe kujdesin ndaj mysafirëve.`,
    heroImage: guesthouseImage,
    features: [
      "Çarçafë cilësorë me çmime të përballueshme",
      "Peshqirë të butë dhe absorbuese",
      "Jorganë të ngrohta për çdo sezon",
      "Materiale natyrale dhe hipoalergjike",
      "Ngjyra neutrale për çdo dekor",
      "Produkte Easy Care për mirëmbajtje të lehtë",
    ],
    recommendedCategories: ["carcafe", "peshqire", "jorgan", "batanije", "jastek-gjumi"],
  },
  "tekstile-per-spa": {
    slug: "tekstile-per-spa",
    title: "Tekstile për SPA & Wellness",
    subtitle: "Relaksim dhe luksi për qendra wellness",
    metaTitle: "Tekstile për SPA & Wellness – EMA Hotelling, relaks premium",
    metaDescription: "Tekstile luksoze për qendra SPA dhe wellness – peshqirë të butë, batanije, bathrobes dhe aksesorë relaksi të cilësisë më të lartë.",
    description: `EMA Hotelling ofron tekstile të specializuara për qendra SPA dhe wellness. Produktet tona janë të dizajnuara për të krijuar një atmosferë relaksimi dhe luksi, duke ofruar rehati maksimale për klientët tuaj.

Nga peshqirët e butë deri te batanijet e ngrohta dhe bathrobes elegante, çdo produkt është zgjedhur për të përmirësuar përvojën e wellness dhe për të ndihmuar klientët të ndjehen të kujdesur dhe të relaksuar.`,
    heroImage: spaImage,
    features: [
      "Peshqirë ekstra të butë për masazh",
      "Bathrobes luksoze dhe të ngrohta",
      "Batanije relaksi të lehta",
      "Çarçafë masazhi profesionalë",
      "Materiale hipoalergjike dhe natyrale",
      "Aksesorë tekstilë për dhoma relaksi",
    ],
    recommendedCategories: ["peshqire", "batanije", "mbrojtese"],
  },
};
