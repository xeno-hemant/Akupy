import { useEffect } from 'react';

/**
 * useSEO — dynamic meta tag manager for Vite/React SPA
 * Updates document.title, meta description, og:tags on mount
 *
 * @param {object} params
 * @param {string} params.title - Page title (will append " | Akupy")
 * @param {string} params.description - Page meta description
 * @param {string} [params.ogImage] - Open Graph image URL
 * @param {string} [params.ogUrl] - Canonical URL for this page
 * @param {string} [params.ogType] - OG type (default: 'website')
 */
export default function useSEO({ title, description, ogImage, ogUrl, ogType = 'website' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Akupy` : 'Akupy — Discover Local Shops & Buy Locally';
    const fullDesc = description || 'Akupy is a smart local marketplace. Discover shops near you and buy locally.';
    const image = ogImage || 'https://akupy.in/og-image.png';
    const url = ogUrl || (typeof window !== 'undefined' ? window.location.href : 'https://akupy.in');

    document.title = fullTitle;

    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        // determine if property or name attr
        if (selector.includes('property=')) el.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1]);
        else el.setAttribute('name', selector.match(/name="([^"]+)"/)?.[1]);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', fullDesc);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', fullDesc);
    setMeta('meta[property="og:image"]', 'content', image);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:type"]', 'content', ogType);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', fullDesc);
    setMeta('meta[name="twitter:image"]', 'content', image);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [title, description, ogImage, ogUrl, ogType]);
}
