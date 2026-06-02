import { Metadata } from 'next';
import Dashboard from '../../../components/Dashboard';

export const revalidate = 86400; // 24 hours
export const dynamicParams = true;

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const formattedCity = city.replace(/-/g, ' ').replace(/\\b\\w/g, c => c.toUpperCase());
  
  return {
    title: `Cost of Living in ${formattedCity} (2026 Prices)`,
    description: `Comprehensive breakdown of living costs in ${formattedCity} including rent, groceries, transport, utilities and more.`,
    alternates: {
      canonical: `/cost-of-living/${city}`,
    },
    openGraph: {
      title: `TakeHome Pro: Cost of Living in ${formattedCity}`,
      description: `Plan your relocation budget with accurate 2026 living costs for ${formattedCity}.`,
    }
  };
}

export async function generateStaticParams() {
  return [
    { city: 'new-york' },
    { city: 'london' },
    { city: 'berlin' },
    { city: 'austin' },
    { city: 'munich' }
  ];
}

export default async function CostOfLivingPage({ params }: Props) {
  const { city } = await params;
  const formattedCity = city.replace(/-/g, ' ').replace(/\\b\\w/g, c => c.toUpperCase());

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the cost of living in ${formattedCity}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The cost of living in ${formattedCity} varies by lifestyle. Our tool breaks down the exact average costs for housing, food, and utilities.`
        }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Dashboard initialCityId={city} initialCityQuery={formattedCity} />
    </>
  );
}
