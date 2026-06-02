import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 86400; // ISR configuration rule: 24 hours
export const dynamicParams = true; // Allow on-demand generation

interface Props {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Salary Calculator for ${resolvedParams.country.toUpperCase()}`,
    description: `Calculate your net income and savings in ${resolvedParams.country}.`,
    alternates: {
      canonical: `/${resolvedParams.country}-salary`,
    },
  };
}

export async function generateStaticParams() {
  // Pre-generate top 100 country hubs (mocked as the basic 3 for now)
  return [
    { country: 'usa' },
    { country: 'uk' },
    { country: 'germany' }
  ];
}

export default async function CountrySalaryPage({ params }: Props) {
  const resolvedParams = await params;
  const { country } = resolvedParams;

  // Validate country parameter here
  const supportedCountries = ['usa', 'uk', 'germany'];
  if (!supportedCountries.includes(country)) {
    notFound();
  }

  return (
    <main>
      <h1>{country.toUpperCase()} Salary & Net Income Hub</h1>
      <p>Select a salary to see detailed tax breakdown and living costs.</p>
      {/* TODO: Incorporate Interactive Client-Side Calculators */}
    </main>
  );
}
