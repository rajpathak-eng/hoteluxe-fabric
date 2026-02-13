import { useEffect } from "react";
import { useTypographySettings, buildGoogleFontsUrl } from "@/hooks/useTypographySettings";

export function FontProvider({ children }: { children: React.ReactNode }) {
  const { data: settings } = useTypographySettings();

  useEffect(() => {
    if (!settings) return;
    
    // Load Google Fonts
    const googleUrl = buildGoogleFontsUrl(settings);
    const existingLink = document.getElementById("dynamic-google-fonts") as HTMLLinkElement;
    
    if (googleUrl) {
      if (existingLink) {
        existingLink.href = googleUrl;
      } else {
        const link = document.createElement("link");
        link.id = "dynamic-google-fonts";
        link.rel = "stylesheet";
        link.href = googleUrl;
        document.head.appendChild(link);
      }
    } else if (existingLink) {
      existingLink.remove();
    }

    // Load custom font URLs
    [
      { id: "custom-font-primary", url: settings.primary_font_url },
      { id: "custom-font-secondary", url: settings.secondary_font_url },
    ].forEach(({ id, url }) => {
      const el = document.getElementById(id) as HTMLLinkElement;
      if (url) {
        if (el) {
          el.href = url;
        } else {
          const link = document.createElement("link");
          link.id = id;
          link.rel = "stylesheet";
          link.href = url;
          document.head.appendChild(link);
        }
      } else if (el) {
        el.remove();
      }
    });

    // Apply CSS custom properties with priority to override :root defaults
    const root = document.documentElement;
    const primaryStack = `'${settings.primary_font}', ${settings.fallback_primary}`;
    const secondaryStack = `'${settings.secondary_font}', ${settings.fallback_secondary}`;

    root.style.setProperty("--font-serif", primaryStack);
    root.style.setProperty("--font-display", primaryStack);
    root.style.setProperty("--font-sans", secondaryStack);

    // Also set font-weight CSS variables
    root.style.setProperty("--font-primary-weight", settings.primary_weight);
    root.style.setProperty("--font-secondary-weight", settings.secondary_weight);

    // Apply font size scaling
    const headingScale = (Number(settings.heading_size || "100") / 100);
    const bodyScale = (Number(settings.body_size || "100") / 100);
    root.style.setProperty("--heading-size-scale", String(headingScale));
    root.style.setProperty("--body-size-scale", String(bodyScale));
    root.style.fontSize = `${bodyScale * 100}%`;
  }, [settings]);

  return <>{children}</>;
}
