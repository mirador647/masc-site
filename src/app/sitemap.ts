import type { MetadataRoute } from "next";


export default function sitemap(): MetadataRoute.Sitemap {
const base = "https://www.avara-shop.fr";
const pages = ["/", "/ai", "/quran", "/quran/fr", "/quran/ar", "/categories", "/objectifs"];
const now = new Date();
return pages.map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: "weekly", priority: 0.7 }));
}