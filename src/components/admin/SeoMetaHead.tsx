 import { useEffect } from "react";
 import { useSeoPageBySlug } from "@/hooks/useSeoMetadata";
 
 interface SeoMetaHeadProps {
   pageSlug: string;
   fallbackTitle: string;
   fallbackDescription: string;
 }
 
 export function SeoMetaHead({ pageSlug, fallbackTitle, fallbackDescription }: SeoMetaHeadProps) {
   const { data: seoData } = useSeoPageBySlug(pageSlug);
 
   useEffect(() => {
     const title = seoData?.meta_title || fallbackTitle;
     const description = seoData?.meta_description || fallbackDescription;
 
     // Update document title
     document.title = title;
 
     // Update or create meta description
     let metaDescription = document.querySelector('meta[name="description"]');
     if (!metaDescription) {
       metaDescription = document.createElement("meta");
       metaDescription.setAttribute("name", "description");
       document.head.appendChild(metaDescription);
     }
     metaDescription.setAttribute("content", description);
 
     // Update Open Graph tags
     let ogTitle = document.querySelector('meta[property="og:title"]');
     if (!ogTitle) {
       ogTitle = document.createElement("meta");
       ogTitle.setAttribute("property", "og:title");
       document.head.appendChild(ogTitle);
     }
     ogTitle.setAttribute("content", title);
 
     let ogDescription = document.querySelector('meta[property="og:description"]');
     if (!ogDescription) {
       ogDescription = document.createElement("meta");
       ogDescription.setAttribute("property", "og:description");
       document.head.appendChild(ogDescription);
     }
     ogDescription.setAttribute("content", description);
 
   }, [seoData, fallbackTitle, fallbackDescription]);
 
   return null;
 }