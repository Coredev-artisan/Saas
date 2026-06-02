import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 86400; // ISR configuration rule: 24 hours
export const dynamicParams = true; // Allow on-demand generation

interface Props {
  params: Promise<{ country: string; salary: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `${resolvedParams.salary} Salary After Tax in ${resolvedParams.country.toUpperCase()}`,
    description: `Calculate net paycheck, taxes, and deductions for a ${resolvedParams.salary} salary in ${resolvedParams.country}.`,
    alternates: {
      canonical: `/salary-after-tax-${resolvedParams.country}-${resolvedParams.salary}`,
    },
  };
}

export async function generateStaticParams() {
  // Pre-generate popular combinations
  return [
    { country: 'germany', salary: '80000' },
    { country: 'usa', salary: '100000' },
    { country: 'uk', salary: '50000' }
  ];
}

export default async function SalaryAfterTaxPage({ params }: Props) {
  const resolvedParams = await params;
  const { country, salary } = resolvedParams;

  // Validate numeric salary and supported country
  const numericSalary = parseInt(salary, 10);
  const supportedCountries = ['usa', 'uk', 'germany'];

  if (isNaN(numericSalary) || !supportedCountries.includes(country)) {
    notFound();
  }

  return (
    <main>
      <h1>{numericSalary} Salary After Tax in {country.toUpperCase()}</h1>
      <p>Breakdown of your net paycheck and taxes.</p>
      {/* TODO: Incorporate Interactive Client-Side Calculators with specific country and salary pre-filled */}
    </main>
  );
}
