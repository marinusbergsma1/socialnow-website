import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  path?: string;
}

const BASE_URL = 'https://socialnow.nl';
const SITE_NAME = 'SocialNow';

export function useSEO({ title, description, path = '' }: SEOProps) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', `${BASE_URL}${path}`);

    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      canonical.href = `${BASE_URL}${path}`;
    }

    return () => {
      document.title = `${SITE_NAME} | AI-Powered Web & Project Development Amsterdam`;
    };
  }, [title, description, path]);
}
