import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/checkout/success'], // Prevent crawlers from indexing private paths
    },
    sitemap: 'https://kōdo-solutions.com/sitemap.xml',
  };
}
