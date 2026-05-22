import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { learningHubs } from '@/data/learning-paths';
import { careerGuides } from '@/data/career-guides';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseRoutes = [
    '',
    '/learning',
    '/career',
    '/syllabus',
    '/projects',
    '/career-outcomes',
    '/about',
    '/contact',
    '/login',
    '/signup'
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const hubRoutes = learningHubs.map((hub) => ({
    url: `${siteConfig.url}/learning/${hub.slug}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const guideRoutes = careerGuides.map((guide) => ({
    url: `${siteConfig.url}/career/guide/${guide.slug}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...baseRoutes, ...hubRoutes, ...guideRoutes];
}
