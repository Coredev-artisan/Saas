import { Metadata } from 'next';
import Dashboard from '../../../../components/Dashboard';

export const revalidate = 86400; // 24 hours
export const dynamicParams = true;

interface Props {
  params: Promise<{ salary: string; city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { salary, city } = await params;
  const formattedCity = city.replace(/-/g, ' ').replace(/\\b\\w/g, c => c.toUpperCase());
  
  return {
    title: `Can I Live on ${salary} in ${formattedCity}?`,
    description: `Detailed cost of living analysis, rent breakdown, and savings projection for a ${salary} salary in ${formattedCity}.`,
    alternates: {
      canonical: `/can-i-live-on/${salary}/${city}`,
    },
    openGraph: {
      title: `TakeHome Pro: Affording ${formattedCity} on ${salary}`,
      description: `See if you can afford to live in ${formattedCity} on ${salary}. Includes frugal, mid-range, and premium lifestyle cost breakdowns.`,
    }
  };
}

export async function generateStaticParams() {
  return [
    { salary: '100000', city: 'new-york' },
    { salary: '80000', city: 'berlin' },
    { salary: '50000', city: 'london' }
  ];
}

export default async function CanILiveOnPage({ params }: Props) {
  const { salary, city } = await params;
  const numericSalary = parseInt(salary, 10) || 80000;
  const formattedCity = city.replace(/-/g, ' ').replace(/\\b\\w/g, c => c.toUpperCase());

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Can I afford to live in ${formattedCity} on ${numericSalary}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `It depends on your lifestyle. Our calculator provides a detailed breakdown of rent, food, and transport costs for ${formattedCity} to help you decide.`
        }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Dashboard initialSalary={numericSalary} initialCityId={city} initialCityQuery={formattedCity} />
    </>
  );
}
