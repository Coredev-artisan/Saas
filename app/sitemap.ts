import { MetadataRoute } from 'next';
import citiesData from '../data/cities.json';

// We chunk the sitemap if needed, but for now we generate the top permutations
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://takehomepro.com';
  const lastModified = new Date();

  // Top static pages
  const staticRoutes = [
    { url: baseUrl, lastModified, changeFrequency: 'daily' as const, priority: 1.0 },
  ];

  // Generate for popular salaries
  const popularSalaries = [40000, 50000, 60000, 80000, 100000, 120000, 150000];
  const countries = ['usa', 'uk', 'germany'];

  const salaryAfterTaxRoutes = countries.flatMap(country => 
    popularSalaries.map(salary => ({
      url: `${baseUrl}/salary-after-tax/${country}/${salary}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }))
  );

  const canILiveOnRoutes = citiesData.flatMap(city => 
    popularSalaries.map(salary => ({
      url: `${baseUrl}/can-i-live-on/${salary}/${city.id}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }))
  );

  const costOfLivingRoutes = citiesData.map(city => ({
    url: `${baseUrl}/cost-of-living/${city.id}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }));

  return [
    ...staticRoutes,
    ...salaryAfterTaxRoutes,
    ...canILiveOnRoutes,
    ...costOfLivingRoutes,
  ];
}
