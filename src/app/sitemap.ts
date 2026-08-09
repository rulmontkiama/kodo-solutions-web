import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kōdo-solutions.com';

  // List of all static routes in the application
  const routes = [
    '',
    '/kodo-pos',
    '/services/bookings',
    '/services/pos',
    '/services/web',
    '/onboarding',
    '/cgv',
    '/politique-de-confidentialite',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route.startsWith('/services') || route.startsWith('/kodo-pos') ? 0.8 : 0.5,
  }));
}
