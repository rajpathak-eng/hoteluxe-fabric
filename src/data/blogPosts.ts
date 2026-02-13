// Blog data from WordPress export
import hotelImage from "@/assets/industry-hotel.jpg";
import sheetsImage from "@/assets/product-sheets-new.jpg";
import towelsImage from "@/assets/product-towels-new.jpg";
import pillowImage from "@/assets/product-sleeping-pillow.jpg";
import duvetImage from "@/assets/product-duvet.jpg";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: "te-gjitha" | "dhoma-gjumi" | "hotele" | "banjo" | "amenities";
  categoryLabel: string;
  publishedAt: string;
  readTime: string;
}

export const blogCategories = [
  { value: "te-gjitha", label: "Të gjitha" },
  { value: "dhoma-gjumi", label: "Dhoma gjumi" },
  { value: "hotele", label: "Hotele" },
  { value: "banjo", label: "Banjo" },
  { value: "amenities", label: "Amenities" },
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "5-tipare-tekstilet-hotel-rehati-maksimale",
    title: "5 tipare që duhet të kenë tekstilet e hotelit për të garantuar rehati maksimale",
    excerpt: "Kur vizitoni një hotel të bukur, gjërat që ndihen më shumë sesa shihen shpesh janë tekstilet. Çarçafët e butë, peshqirët e ngrohtë dhe batanijet që të përqafojnë menjëherë janë detajet që bëjnë një qëndrim të paharrueshëm.",
    content: `
      <p>Kur vizitoni një hotel të bukur, gjërat që ndihen më shumë sesa shihen shpesh janë tekstilet. Çarçafët e butë, peshqirët e ngrohtë dhe batanijet që të përqafojnë menjëherë janë detajet që bëjnë një qëndrim të paharrueshëm. Tekstilet nuk janë thjesht dekor, por pjesë e përvojës që mysafirët do të kujtojnë.</p>
      
      <h2>1. Materiale të larta cilësore</h2>
      <p>Gjërat fillojnë me materialin. Nuk ka asgjë më të kënaqshme se të shtrihet në një çarçaf të butë dhe të ndihesh si në një përqafim. Çarçafët dhe peshqirët e hotelit duhet të jenë bërë nga materiale natyrale si pambuku egjiptian, linen dhe mikrofibra luksoze, që ndihen të buta dhe të rehatshme për lëkurën.</p>
      
      <h2>2. Butësi dhe komoditet</h2>
      <p>Një nga gjërat më të rëndësishme për rehati është butësia e tekstileve. Një çarçaf që ngrihet shpejt nga krevati ose një peshqir që ndihet i ashpër nuk ofron ndjesinë e luksit që mysafirët kërkojnë. Tekstilet duhet të jenë të ftohta në prekje dhe të ngrohta kur nevojitet.</p>
      
      <h2>3. Absorbim dhe tharje e shpejtë</h2>
      <p>Peshqirët dhe rrobat e banjës janë pjesë thelbësore e eksperiencës hoteliere. Ata duhet të thithin lagështinë shpejt dhe të thahen po aq shpejt, që mysafirët të ndihen të freskët dhe stafi i hotelit të ketë lehtësi në menaxhim.</p>
      
      <h2>4. Qëndrueshmëri dhe rezistencë</h2>
      <p>Një tjetër pikë kyçe është qëndrueshmëria. Tekstilet e hotelit përballen me larje të shpeshta dhe përdorim të vazhdueshëm, prandaj është e rëndësishme të zgjidhen materiale të forta dhe qepje të qëndrueshme.</p>
      
      <h2>5. Estetikë dhe dizajn harmonik</h2>
      <p>Ngjyrat, modelet dhe dizajni i tekstileve duhet të krijojnë një atmosferë të këndshme dhe të përputhen me stilin e hotelit, për të bërë që mysafirët të ndihen rehat dhe të kënaqur me ambientin.</p>
    `,
    image: pillowImage,
    category: "hotele",
    categoryLabel: "Hotele",
    publishedAt: "2026-01-25",
    readTime: "6 min",
  },
  {
    id: "2",
    slug: "si-ndikojne-tekstilet-pervoja-klientit-hotele",
    title: "Si ndikojnë tekstilet në përvojën e klientit në hotele",
    excerpt: "Në industrinë e hotelerisë, përvoja e klientit ndërtohet nga një sërë detajesh që, të marra së bashku, krijojnë perceptimin e përgjithshëm për cilësinë e shërbimit.",
    content: `
      <p>Në industrinë e hotelerisë, përvoja e klientit ndërtohet nga një sërë detajesh që, të marra së bashku, krijojnë perceptimin e përgjithshëm për cilësinë e shërbimit. Ndër këta elementë, tekstilet zënë një vend kyç, edhe pse shpesh nënvlerësohen.</p>
      
      <h2>Tekstilet dhe cilësia e gjumit</h2>
      <p>Cilësia e gjumit është një nga faktorët më të rëndësishëm të kënaqësisë së klientit. Një gjumë i mirë shpesh përkthehet në vlerësime pozitive, rikthim të klientëve dhe rekomandime. Në këtë aspekt, tekstilet e shtratit luajnë rol vendimtar.</p>
      
      <h2>Roli i tekstileve në banjo</h2>
      <p>Banjoja është një tjetër hapësirë ku tekstilet kanë ndikim të drejtpërdrejtë në perceptimin e klientit. Peshqirët, rrobat e banjos dhe tapetet duhet të transmetojnë ndjesinë e pastërtisë absolute dhe kujdesit maksimal ndaj higjienës.</p>
      
      <h2>Tekstilet si faktor emocional</h2>
      <p>Përvoja e klientit nuk është vetëm funksionale, por edhe emocionale. Tekstilet ndikojnë në mënyrën se si klienti ndihet gjatë qëndrimit: i relaksuar, i përkëdhelur, i mirëpritur apo i zhgënjyer.</p>
    `,
    image: sheetsImage,
    category: "dhoma-gjumi",
    categoryLabel: "Dhoma gjumi",
    publishedAt: "2026-01-11",
    readTime: "5 min",
  },
  {
    id: "3",
    slug: "pse-duhet-te-zgjidhni-ema-hotelling-tekstil-mikpritje",
    title: "Pse duhet të zgjidhni EMA Hotelling për produktet e tekstilit në sektorin e mikpritjes",
    excerpt: "Në industrinë e mikpritjes, cilësia dhe besueshmëria janë dy elemente kyçe që ndikojnë drejtpërdrejt në përvojën e mysafirëve tuaj. EMA Hotelling ofron produkte tekstili të cilësisë më të lartë.",
    content: `
      <p>Në industrinë e mikpritjes, cilësia dhe besueshmëria janë dy elemente kyçe që ndikojnë drejtpërdrejt në përvojën e mysafirëve tuaj. Si një partner i besueshëm i industrisë së mikpritjes, Ema Hotelling ofron produkte tekstili të cilësisë më të lartë.</p>
      
      <h2>1. Cilësi e Përsosur</h2>
      <p>Produktet tona janë të dizajnuara dhe prodhuara duke përdorur materialet më të mira dhe teknologjitë më moderne.</p>
      
      <h2>2. Dizajn i Personalizuar</h2>
      <p>Ema Hotelling ofron mundësinë për t'u përshtatur me identitetin dhe stilin e hotelit tuaj. Nga ngjyrat, tek logot dhe detajet e tjera, ne mund ta personalizojmë çdo produkt tekstili.</p>
      
      <h2>3. Qëndrueshmëri dhe Durim</h2>
      <p>Në sektorin e mikpritjes, qëndrueshmëria e produkteve është thelbësore. Ne ofrojmë produkte që janë të qëndrueshme ndaj përdorimit të përditshëm.</p>
      
      <h2>4. Shërbim i Shpejtë dhe i Besueshëm</h2>
      <p>Ne e dimë që koha është e çmuar, dhe për këtë arsye ofrojmë shërbim të shpejtë dhe të besueshëm.</p>
    `,
    image: hotelImage,
    category: "hotele",
    categoryLabel: "Hotele",
    publishedAt: "2025-12-25",
    readTime: "4 min",
  },
  {
    id: "4",
    slug: "si-te-zgjidhni-tekstilet-e-duhura-per-hotele",
    title: "Si të zgjidhni tekstilet e duhura për hotele?",
    excerpt: "Zgjedhja e tekstileve të duhura për një hotel nuk është gjithmonë e lehtë. Ja disa këshilla praktike për menaxherët e hoteleve.",
    content: `
      <p>Zgjedhja e tekstileve të duhura për një hotel nuk është gjithmonë e lehtë. Ja disa këshilla që mund t'ju ndihmojnë:</p>
      
      <h2>1. Vlerësoni nevojat tuaja</h2>
      <p>Çdo hotel ka nevoja specifike bazuar në kategori, klientelë dhe stil. Filloni duke identifikuar prioritetet tuaja.</p>
      
      <h2>2. Zgjidhni materiale cilësore</h2>
      <p>Investoni në materiale natyrale dhe luksoze – pambuku egjiptian dhe linen janë gjithmonë zgjedhje të sigurta për rehati dhe qëndrueshmëri.</p>
      
      <h2>3. Konsideroni mirëmbajtjen</h2>
      <p>Tekstilet e hotelit përballen me larje të shpeshta. Sigurohuni që produktet që zgjidhni të jenë rezistente ndaj temperaturave të larta dhe të mos humbasin ngjyrën.</p>
      
      <h2>4. Mendoni afatgjatë</h2>
      <p>Tekstilet cilësore kanë jetëgjatësi më të madhe dhe ruajnë pamjen e tyre për më shumë kohë. Kjo ul kostot e zëvendësimit të shpeshtë.</p>
    `,
    image: towelsImage,
    category: "banjo",
    categoryLabel: "Banjo",
    publishedAt: "2025-11-18",
    readTime: "5 min",
  },
  {
    id: "5",
    slug: "ku-te-gjeni-produktet-me-te-mira-per-hotele-ne-shqiperi",
    title: "Ku të gjeni produktet më të mira për hotele në Shqipëri?",
    excerpt: "Në botën e mikpritjes, çdo detaj ka rëndësi. EMA Hotelling është një nga emrat më të besueshëm në tregun shqiptar për tekstile hoteliere.",
    content: `
      <p>Në botën e mikpritjes, çdo detaj ka rëndësi. Një hotel apo resort nuk vlerësohet vetëm nga arkitektura apo pamja e përgjithshme, por edhe nga cilësia e produktëve që përdoren për mysafirët.</p>
      
      <h2>Rreth EMA Hotelling</h2>
      <p>EMA Hotelling është një lider në fushën e produkteve hoteliere dhe tekstileve profesionale që prej vitit 2010. Me një ekip ekspertësh të dedikuar dhe shërbim profesional, kompania ofron një gamë të plotë produktesh për hoteleri, restorante dhe ambiente të tjera mikpritëse.</p>
      
      <h2>Produktet kryesore</h2>
      <p>EMA Hotelling ofron një gamë të gjerë produktesh hoteliere që mbulojnë të gjitha nevojat e një hoteli modern: çarçafë, peshqirë, jorganë, jastëkë, mbulesa krevati, perde dhe shumë më tepër.</p>
      
      <h2>Pse të zgjidhni EMA Hotelling?</h2>
      <p>Eksperienca e gjatë në industri, cilësi dhe pastërti në çdo produkt, zgjidhje të personalizuara dhe çmime konkurruese.</p>
    `,
    image: duvetImage,
    category: "hotele",
    categoryLabel: "Hotele",
    publishedAt: "2025-11-10",
    readTime: "5 min",
  },
  {
    id: "6",
    slug: "furnitoret-me-te-mire-te-tekstileve-ne-shqiperi",
    title: "Furnitorët më të mirë të tekstileve në Shqipëri",
    excerpt: "Industria e hotelerisë, restoranteve dhe SPA-ve kërkon standarde të larta në çdo detaj. Një nga elementët më të rëndësishëm që ndikon drejtpërdrejt në eksperiencën e klientit është cilësia e tekstileve.",
    content: `
      <p>Industria e hotelerisë, restoranteve, SPA-ve dhe shërbimeve profesionale kërkon standarde të larta në çdo detaj. Një nga elementët më të rëndësishëm që ndikon drejtpërdrejt në eksperiencën e klientit është cilësia e tekstileve.</p>
      
      <h2>EMA Hotelling – Lideri i tekstileve profesionale</h2>
      <p>EMA Hotelling renditet pa diskutim si furnitori numër një i tekstileve hoteliere në Shqipëri. Me fokus të qartë në hoteleri, resorte, bujtina, apartamente turistike, SPA dhe restorante, EMA Hotelling ka ndërtuar një reputacion të fortë për cilësi të qëndrueshme dhe çmime konkurruese.</p>
      
      <h2>Çfarë e diferencon EMA Hotelling?</h2>
      <p>Diferenca kryesore qëndron në cilësinë e lartë të produkteve të kombinuar me çmime shumë të arsyeshme. EMA Hotelling punon me standarde profesionale, të përshtatura për përdorim intensiv.</p>
      
      <h2>Si të zgjidhni furnitorin e duhur?</h2>
      <p>Zgjedhja e furnitorit të tekstileve është një vendim strategjik për çdo biznes shërbimi. Kriteret më të rëndësishme janë: cilësia e materialeve, rezistenca ndaj përdorimit, raporti cilësi-çmim, dhe eksperienca në hoteleri.</p>
    `,
    image: hotelImage,
    category: "hotele",
    categoryLabel: "Hotele",
    publishedAt: "2026-02-03",
    readTime: "6 min",
  },
];
