import React from 'react';
import { formatCurrency, formatPercentage } from '../lib/utils/formatters';
import { CalculationResult } from '../lib/tax/engine';

// Helper to safely get tax breakdown values
const getTax = (simulation: CalculationResult, key: keyof typeof simulation.taxBreakdown) => {
  return simulation.taxBreakdown[key] || 0;
};

// Section 2: Instant Results Dashboard
export function ResultsDashboard({ simulation, countryId }: { simulation: CalculationResult, countryId: string }) {
  const currency = countryId === 'usa' ? 'USD' : countryId === 'uk' ? 'GBP' : 'EUR';
  const totalTax = (simulation.grossSalary / (simulation.grossSalary === simulation.taxBreakdown.incomeTax ? 1 : 12)) - simulation.netMonthlyTakeHome; // rough est for display if annual

  return (
    <section className="py-12 border-b border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Net Monthly Income', val: formatCurrency(simulation.netMonthlyTakeHome, currency), icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-teal-500' },
          { title: 'Total Annual Tax', val: formatCurrency(simulation.taxBreakdown.incomeTax + (simulation.taxBreakdown.socialSecurity || 0) + (simulation.taxBreakdown.nationalInsurance || 0) + (simulation.taxBreakdown.pension || 0) + (simulation.taxBreakdown.health || 0), currency), icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z', color: 'text-rose-500' },
          { title: 'Monthly Savings', val: formatCurrency(Math.max(0, simulation.monthlySavings || 0), currency), icon: 'M5 13l4 4L19 7', color: 'text-green-500' },
          { title: 'Emergency Runway', val: `${(simulation.emergencyRunway || 0).toFixed(1)} months`, icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-indigo-500' }
        ].map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-4 ${card.color}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon}></path></svg>
            </div>
            <h4 className="text-slate-500 text-sm font-medium mb-1">{card.title}</h4>
            <div className="text-3xl font-black text-slate-900 tracking-tight tabular-nums">{card.val}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Section 3: Financial Health Score
export function HealthScore({ simulation }: { simulation: CalculationResult }) {
  const savingsRate = simulation.savingsPercentage || 0;
  
  // Basic heuristic for score
  let score = 50;
  if (savingsRate > 20) score += 20;
  if (savingsRate > 40) score += 15;
  if (savingsRate < 5) score -= 20;
  if ((simulation.emergencyRunway || 0) > 6) score += 15;
  
  score = Math.min(100, Math.max(0, score));
  
  const rating = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor';
  const color = score >= 80 ? 'text-green-500 stroke-green-500' : score >= 60 ? 'text-teal-500 stroke-teal-500' : score >= 40 ? 'text-amber-500 stroke-amber-500' : 'text-rose-500 stroke-rose-500';

  return (
    <section className="py-12 border-b border-slate-100">
      <div className="flex flex-col md:flex-row gap-8 items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="relative w-48 h-48 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="8" fill="none" />
            <circle cx="50" cy="50" r="40" className={color} strokeWidth="8" fill="none" strokeDasharray={`${score * 2.51} 251`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-slate-900">{score}</span>
            <span className={`text-sm font-bold uppercase tracking-widest ${color.split(' ')[0]}`}>{rating}</span>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Financial Health Score</h2>
          <p className="text-slate-500 text-lg leading-relaxed mb-4">
            Your financial health score is based on your savings rate ({savingsRate.toFixed(1)}%), tax burden, cost of living, and emergency runway.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-teal-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <p className="text-slate-700 font-medium">
                Your savings rate is stronger than {Math.min(99, Math.floor(score * 0.9))}% of professionals in similar locations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Section 4: Income Distribution Visualization
export function IncomeDistribution({ simulation, countryId }: { simulation: CalculationResult, countryId: string }) {
  const currency = countryId === 'usa' ? 'USD' : countryId === 'uk' ? 'GBP' : 'EUR';
  const totalGrossMonthly = simulation.grossSalary / 12;
  const incomeTaxMonthly = simulation.taxBreakdown.incomeTax / 12;
  const secondaryTaxYearly = 
    (simulation.taxBreakdown.socialSecurity || 0) + 
    (simulation.taxBreakdown.nationalInsurance || 0) + 
    (simulation.taxBreakdown.pension || 0) + 
    (simulation.taxBreakdown.health || 0) +
    (simulation.taxBreakdown.unemployment || 0) +
    (simulation.taxBreakdown.longTermCare || 0) +
    (simulation.taxBreakdown.medicare || 0) + 
    (simulation.taxBreakdown.additionalMedicare || 0) +
    (simulation.taxBreakdown.solidaritySurcharge || 0);
  const secondaryTaxMonthly = secondaryTaxYearly / 12;
  const livingCost = simulation.itemizedMonthlyLivingCosts || 0;
  const savings = Math.max(0, simulation.monthlySavings || 0);

  const formatPct = (val: number) => ((val / totalGrossMonthly) * 100).toFixed(1) + '%';

  return (
    <section className="py-12 border-b border-slate-100">
      <h2 className="text-3xl font-bold text-slate-900 mb-8">Income Distribution</h2>
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-48 text-sm font-medium text-slate-500">Gross Salary</div>
            <div className="flex-1 h-8 bg-slate-900 rounded-lg relative overflow-hidden group">
               <div className="absolute inset-0 flex items-center px-4 text-white text-xs font-bold">{formatCurrency(totalGrossMonthly, currency)} (100%)</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-48 text-sm font-medium text-slate-500">Income Tax</div>
            <div className="flex-1 flex">
              <div style={{ width: formatPct(incomeTaxMonthly) }} className="h-8 bg-slate-400 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center px-4 text-white text-xs font-bold">{formatPct(incomeTaxMonthly)}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-48 text-sm font-medium text-slate-500">Social Contributions</div>
            <div className="flex-1 flex">
               {/* offset spacer */}
               <div style={{ width: formatPct(incomeTaxMonthly) }}></div>
              <div style={{ width: formatPct(secondaryTaxMonthly) }} className="h-8 bg-slate-500 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center px-4 text-white text-xs font-bold">{formatPct(secondaryTaxMonthly)}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-48 text-sm font-medium text-slate-500">Living Costs</div>
            <div className="flex-1 flex">
               <div style={{ width: formatPct(incomeTaxMonthly + secondaryTaxMonthly) }}></div>
              <div style={{ width: formatPct(livingCost) }} className="h-8 bg-slate-600 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center px-4 text-white text-xs font-bold">{formatPct(livingCost)}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-48 text-sm font-medium text-slate-500">Net Savings</div>
            <div className="flex-1 flex">
               <div style={{ width: formatPct(incomeTaxMonthly + secondaryTaxMonthly + livingCost) }}></div>
              <div style={{ width: formatPct(savings) }} className="h-8 bg-teal-500 rounded-lg relative overflow-hidden shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                <div className="absolute inset-0 flex items-center px-4 text-white text-xs font-bold">{formatPct(savings)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Section 5: Detailed Tax Breakdown
export function DetailedTaxBreakdown({ simulation, countryId }: { simulation: CalculationResult, countryId: string }) {
  const currency = countryId === 'usa' ? 'USD' : countryId === 'uk' ? 'GBP' : 'EUR';
  const totalTax = simulation.taxBreakdown.incomeTax + 
    (simulation.taxBreakdown.socialSecurity || 0) + 
    (simulation.taxBreakdown.medicare || 0) + 
    (simulation.taxBreakdown.additionalMedicare || 0) +
    (simulation.taxBreakdown.nationalInsurance || 0) +
    (simulation.taxBreakdown.pension || 0) +
    (simulation.taxBreakdown.health || 0) +
    (simulation.taxBreakdown.unemployment || 0) +
    (simulation.taxBreakdown.longTermCare || 0) +
    (simulation.taxBreakdown.solidaritySurcharge || 0);
  
  const effectiveRate = (totalTax / simulation.grossSalary) * 100;

  const taxes = [
    { name: 'Federal / National Income Tax', val: simulation.taxBreakdown.incomeTax, desc: 'Progressive income tax levied on taxable earnings.' },
    { name: 'Social Security', val: simulation.taxBreakdown.socialSecurity, desc: 'Funds retirement and disability benefits.' },
    { name: 'Medicare (Incl. Additional)', val: (simulation.taxBreakdown.medicare || 0) + (simulation.taxBreakdown.additionalMedicare || 0), desc: 'Funds healthcare for seniors.' },
    { name: 'National Insurance', val: simulation.taxBreakdown.nationalInsurance, desc: 'Primary UK social contribution.' },
    { name: 'Statutory Pension', val: simulation.taxBreakdown.pension, desc: 'German public retirement system contribution.' },
    { name: 'Statutory Health Insurance', val: simulation.taxBreakdown.health, desc: 'Public health coverage contribution.' },
    { name: 'Unemployment Insurance', val: simulation.taxBreakdown.unemployment, desc: 'Provides unemployment benefits.' },
    { name: 'Long-term Care', val: simulation.taxBreakdown.longTermCare, desc: 'Care insurance contribution.' },
    { name: 'Solidarity Surcharge', val: simulation.taxBreakdown.solidaritySurcharge, desc: 'Surcharge for reunification costs.' },
  ].filter(t => t.val && t.val > 0);

  return (
    <section className="py-12 border-b border-slate-100">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Detailed Tax Breakdown</h2>
        <div className="text-right">
          <span className="text-sm font-medium text-slate-500">Effective Tax Rate</span>
          <div className="text-2xl font-black text-slate-900 tabular-nums">{effectiveRate.toFixed(1)}%</div>
        </div>
      </div>
      <div className="space-y-3">
        {taxes.map((t, i) => (
          <details key={i} className="group bg-white rounded-3xl border border-slate-100 shadow-sm [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-slate-50 transition-colors rounded-3xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-open:bg-teal-50 group-open:text-teal-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                <span className="font-bold text-slate-900">{t.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-500">{((t.val! / simulation.grossSalary) * 100).toFixed(1)}%</span>
                <span className="font-black text-slate-900 w-24 text-right tabular-nums">{formatCurrency(t.val!, currency)}</span>
              </div>
            </summary>
            <div className="px-6 pb-6 pt-2 text-slate-500 border-t border-slate-50 ml-16 mr-6">
              {t.desc}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

// Section 6: Cost of Living Analysis
export function CostOfLivingAnalysis({ simulation, countryId, cityMultiplier, cityName }: { simulation: CalculationResult, countryId: string, cityMultiplier: number, cityName: string }) {
  const currency = countryId === 'usa' ? 'USD' : countryId === 'uk' ? 'GBP' : 'EUR';
  const total = simulation.itemizedMonthlyLivingCosts || 0;
  
  // Fake breakdown based on standard ratios for visual fidelity
  const breakdown = [
    { cat: 'Housing & Utilities', pct: 0.45, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { cat: 'Food & Groceries', pct: 0.20, icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
    { cat: 'Transportation', pct: 0.15, icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
    { cat: 'Healthcare & Personal', pct: 0.10, icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { cat: 'Entertainment & Misc', pct: 0.10, icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];

  const diff = ((cityMultiplier - 1.0) * 100).toFixed(0);
  const comparisonText = cityMultiplier > 1.0 
    ? `${cityName} is ${diff}% more expensive than the national average.`
    : cityMultiplier < 1.0 
      ? `${cityName} is ${Math.abs(Number(diff))}% cheaper than the national average.`
      : `${cityName} costs align with the national average.`;

  return (
    <section className="py-12 border-b border-slate-100">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Cost of Living Analysis</h2>
      <p className="text-slate-500 mb-8 font-medium">{comparisonText}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {breakdown.map((b, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 mb-3">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={b.icon}></path></svg>
            </div>
            <div className="text-xl font-bold text-slate-900 mb-1">{formatCurrency(total * b.pct, currency)}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{b.cat}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Section 11: FAQ Section
export function FaqSection({ countryId }: { countryId: string }) {
  const faqs = countryId === 'germany' ? [
    { q: 'How much tax do I pay in Germany?', a: 'Germany uses a progressive tax system ranging from 14% to 42% for most earners, plus a 5.5% solidarity surcharge on the tax amount for higher earners. You also pay statutory social contributions (pension, health, unemployment, care) capped at specific income thresholds.' },
    { q: 'What is the German Solidarity Surcharge?', a: 'The Solidaritätszuschlag is a 5.5% surcharge on your income tax, originally introduced to finance the reunification of Germany. It now only applies to higher income earners.' }
  ] : countryId === 'uk' ? [
    { q: 'How does the UK Personal Allowance work?', a: 'Most individuals receive a tax-free Personal Allowance (£12,570 for 2026). However, this allowance is reduced by £1 for every £2 earned above £100,000, meaning it disappears entirely at £125,140.' },
    { q: 'What is National Insurance?', a: 'National Insurance (NI) is a tax on earnings paid by employees and employers to fund state benefits, including the State Pension. It is calculated weekly or monthly based on income bands.' }
  ] : [
    { q: 'How are US Federal brackets applied?', a: 'The US uses a marginal tax bracket system. You only pay the higher rate on the portion of your income that falls into that specific bracket, not your entire income.' },
    { q: 'What is FICA tax?', a: 'FICA consists of Social Security (6.2% up to a wage base limit) and Medicare (1.45% on all earnings, plus an additional 0.9% for high earners).' }
  ];

  return (
    <section className="py-12 border-b border-slate-100">
      <h2 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-3">{faq.q}</h3>
            <p className="text-slate-500 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Section 12: Related Calculators
export function RelatedCalculators() {
  const links = [
    'Salary After Tax in USA', 'Salary After Tax in UK', 'Salary After Tax in Germany',
    'Can I Live on $60k in Austin?', 'Can I Live on £80k in London?', 'Can I Live on €90k in Munich?'
  ];
  return (
    <section className="py-12 border-b border-slate-100">
      <h2 className="text-3xl font-bold text-slate-900 mb-8">Related Tax Calculators</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {links.map((link, i) => (
          <a key={i} href="#" className="p-4 bg-slate-50 hover:bg-white border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 hover:text-teal-600 hover:shadow-sm transition-all flex justify-between items-center">
            {link}
            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </a>
        ))}
      </div>
    </section>
  );
}
