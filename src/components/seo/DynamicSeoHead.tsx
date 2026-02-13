import { useEffect } from "react";

interface DynamicSeoHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
}

/**
 * Komponenti për SEO dinamik në faqe individuale (produkte, projekte, blog posts)
 * Përdoret kur metadata vjen nga databaza për entitete specifike
 */
export function DynamicSeoHead({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType = "website",
}: DynamicSeoHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta description
    updateMetaTag("description", description);
    
    // Update Open Graph tags
    updateMetaProperty("og:title", title);
    updateMetaProperty("og:description", description);
    updateMetaProperty("og:type", ogType);
    
    if (ogImage) {
      updateMetaProperty("og:image", ogImage);
    }
    
    if (canonicalUrl) {
      updateMetaProperty("og:url", canonicalUrl);
      updateCanonicalLink(canonicalUrl);
    }

    // Update Twitter Card tags
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    if (ogImage) {
      updateMetaTag("twitter:image", ogImage);
    }

    // Cleanup function
    return () => {
      // Reset to defaults on unmount (optional)
      document.title = "EMA Hotelling";
    };
  }, [title, description, canonicalUrl, ogImage, ogType]);

  return null;
}

function updateMetaTag(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function updateMetaProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function updateCanonicalLink(url: string) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}
