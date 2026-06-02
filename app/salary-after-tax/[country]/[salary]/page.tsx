import { Metadata } from 'next';
import Dashboard from '../../../../components/Dashboard';

export const revalidate = 86400; // 24 hours
export const dynamicParams = true;

interface Props {
  params: Promise<{ country: string; salary: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, salary } = await params;
  const ctryName = country === 'usa' ? 'the United States' : country === 'uk' ? 'the United Kingdom' : 'Germany';
  const currency = country === 'usa' ? '$' : country === 'uk' ? '£' : '€';
  
  return {
    title: `${currency}${salary} Salary After Tax in ${ctryName} (2026)`,
    description: `Calculate your exact net paycheck, taxes, and deductions for a ${currency}${salary} gross salary in ${ctryName}. See the full tax breakdown and living costs.`,
    alternates: {
      canonical: `/salary-after-tax/${country}/${salary}`,
    },
    openGraph: {
      title: `TakeHome Pro: ${currency}${salary} Salary After Tax in ${ctryName}`,
      description: `Detailed 2026 tax calculation and net income breakdown for ${currency}${salary} in ${ctryName}.`,
    }
  };
}

export async function generateStaticParams() {
  return [
    { country: 'germany', salary: '80000' },
    { country: 'usa', salary: '100000' },
    { country: 'uk', salary: '50000' }
  ];
}

export default async function SalaryAfterTaxPage({ params }: Props) {
  const { country, salary } = await params;
  
  // Safe cast for typescript checking in the prop
  const validCountry = ['usa', 'uk', 'germany'].includes(country) ? country as 'usa'|'uk'|'germany' : 'usa';
  const numericSalary = parseInt(salary, 10) || 80000;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How much tax will I pay on ${numericSalary} in ${validCountry}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Use our 2026 calculator to see the exact federal, state, and local tax deductions for ${numericSalary} in ${validCountry}.`
        }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Dashboard initialCountry={validCountry} initialSalary={numericSalary} />
    </>
  );
}
