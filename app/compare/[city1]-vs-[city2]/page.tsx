import { Metadata } from 'next';
import Dashboard from '../../../components/Dashboard';

export const revalidate = 86400; // 24 hours
export const dynamicParams = true;

interface Props {
  params: Promise<{ city1: string; city2: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city1, city2 } = await params;
  const formatName = (str: string) => str.replace(/-/g, ' ').replace(/\\b\\w/g, c => c.toUpperCase());
  const formattedCity1 = formatName(city1);
  const formattedCity2 = formatName(city2);
  
  return {
    title: `Compare Cost of Living: ${formattedCity1} vs ${formattedCity2} (2026)`,
    description: `Detailed comparison of net salary, taxes, rent, and cost of living between ${formattedCity1} and ${formattedCity2}. Find out which city offers a better standard of living.`,
    alternates: {
      canonical: `/compare/${city1}-vs-${city2}`,
    },
    openGraph: {
      title: `TakeHome Pro: ${formattedCity1} vs ${formattedCity2}`,
      description: `Compare cost of living and take-home pay between ${formattedCity1} and ${formattedCity2}.`,
    }
  };
}

export async function generateStaticParams() {
  return [
    { city1: 'berlin', city2: 'munich' },
    { city1: 'new-york', city2: 'austin' },
    { city1: 'london', city2: 'manchester' }
  ];
}

export default async function CompareCitiesPage({ params }: Props) {
  const { city1, city2 } = await params;
  const formatName = (str: string) => str.replace(/-/g, ' ').replace(/\\b\\w/g, c => c.toUpperCase());
  const formattedCity1 = formatName(city1);
  const formattedCity2 = formatName(city2);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is it cheaper to live in ${formattedCity1} or ${formattedCity2}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Compare the cost of living and average rent between ${formattedCity1} and ${formattedCity2} using our 2026 relocation engine.`
        }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Dashboard initialCityId={city1} initialCityQuery={formattedCity1} />
    </>
  );
}
