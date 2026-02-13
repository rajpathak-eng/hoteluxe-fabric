import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "355691234567"; // Replace with actual number
  const message = encodeURIComponent("Përshëndetje! Dëshiroj të marr informacion për produktet tuaja tekstile.");
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
      aria-label="Na kontaktoni në WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute right-full mr-3 bg-card text-foreground px-4 py-2 rounded-lg shadow-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Na shkruani në WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;
