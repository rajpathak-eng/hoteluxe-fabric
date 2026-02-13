import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TypographySettings {
  primary_font: string;
  primary_font_url: string;
  primary_weight: string;
  secondary_font: string;
  secondary_font_url: string;
  secondary_weight: string;
  fallback_primary: string;
  fallback_secondary: string;
  heading_size: string;
  body_size: string;
}

const DEFAULTS: TypographySettings = {
  primary_font: "Lexend Deca",
  primary_font_url: "",
  primary_weight: "600",
  secondary_font: "DM Sans",
  secondary_font_url: "",
  secondary_weight: "400",
  fallback_primary: "sans-serif",
  fallback_secondary: "sans-serif",
  heading_size: "100",
  body_size: "100",
};

export function useTypographySettings() {
  return useQuery({
    queryKey: ["typography-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("setting_key", "typography")
        .maybeSingle();
      if (error) throw error;
      if (!data) return DEFAULTS;
      return { ...DEFAULTS, ...(data.setting_value as unknown as TypographySettings) };
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30, // refetch after 30s
  });
}

export function buildGoogleFontsUrl(settings: TypographySettings): string | null {
  const fonts: string[] = [];
  if (settings.primary_font && !settings.primary_font_url) {
    fonts.push(`family=${settings.primary_font.replace(/ /g, "+")}:wght@400;500;600;700`);
  }
  if (settings.secondary_font && !settings.secondary_font_url && settings.secondary_font !== settings.primary_font) {
    fonts.push(`family=${settings.secondary_font.replace(/ /g, "+")}:wght@400;500;600;700`);
  }
  return fonts.length > 0 ? `https://fonts.googleapis.com/css2?${fonts.join("&")}&display=swap` : null;
}
