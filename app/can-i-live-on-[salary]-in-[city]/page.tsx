import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 86400; // ISR configuration rule: 24 hours
export const dynamicParams = true; // Allow on-demand generation

interface Props {
  params: Promise<{ salary: string; city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Can I live on ${resolvedParams.salary} in ${resolvedParams.city.replace('-', ' ')}?`,
    description: `Detailed cost of living and savings projection for ${resolvedParams.salary} in ${resolvedParams.city}.`,
    alternates: {
      canonical: `/can-i-live-on-${resolvedParams.salary}-in-${resolvedParams.city}`,
    },
  };
}

export async function generateStaticParams() {
  // Pre-generate popular combinations
  return [
    { salary: '80000', city: 'new-york' },
    { salary: '60000', city: 'berlin' },
    { salary: '50000', city: 'london' }
  ];
}

export default async function LiveOnSalaryInCityPage({ params }: Props) {
  const resolvedParams = await params;
  const { salary, city } = resolvedParams;

  // Validate numeric salary
  const numericSalary = parseInt(salary, 10);
  if (isNaN(numericSalary)) {
    notFound();
  }

  return (
    <main>
      <h1>Can I live on {numericSalary} in {city.replace('-', ' ')}?</h1>
      <p>Here is your financial reality check.</p>
      {/* TODO: Incorporate Interactive Client-Side Calculators with specific city and salary pre-filled */}
    </main>
  );
}
