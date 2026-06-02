import React from 'react';
import { formatCurrency } from '../lib/utils/formatters';
import { CalculationResult, getFinancialSimulation } from '../lib/tax/engine';

// Section 7: Can I Afford This City?
export function AffordabilityScenarios({ countryId, cityId, salary, currentSavings }: { countryId: string, cityId: string, salary: number, currentSavings: number }) {
  const currency = countryId === 'usa' ? 'USD' : countryId === 'uk' ? 'GBP' : 'EUR';
  
  // Calculate the 3 scenarios
  let frugal, mid, premium;
  try {
    frugal = getFinancialSimulation(countryId as any, cityId, 'frugal', salary, currentSavings);
    mid = getFinancialSimulation(countryId as any, cityId, 'mid_range', salary, currentSavings);
    premium = getFinancialSimulation(countryId as any, cityId, 'premium', salary, currentSavings);
  } catch (e) {
    return null; // fallback
  }

  const scenarios = [
    { name: 'Frugal', desc: 'Roommates, public transit, home cooking', sim: frugal, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { name: 'Mid-Range', desc: '1BR apartment, dining out, local travel', sim: mid, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { name: 'Premium', desc: 'Luxury apartment, car, frequent travel', sim: premium, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' }
  ];

  return (
    <section className="py-12 border-b border-slate-100">
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Can I Afford This City?</h2>
      <p className="text-slate-500 mb-8 font-medium">Compare lifestyle affordability and savings potential.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {scenarios.map((scen, i) => (
          <div key={i} className={`p-8 rounded-3xl border ${scen.border} bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}>
            <div className={`absolute top-0 left-0 w-full h-1.5 ${scen.bg}`}></div>
            <h3 className={`text-xl font-bold ${scen.color} mb-1`}>{scen.name} Lifestyle</h3>
            <p className="text-slate-500 text-sm mb-6 h-10">{scen.desc}</p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                <span className="text-sm font-semibold text-slate-500">Monthly Budget</span>
                <span className="text-lg font-black text-slate-900 tabular-nums">{formatCurrency(scen.sim.itemizedMonthlyLivingCosts || 0, currency)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                <span className="text-sm font-semibold text-slate-500">Net Savings</span>
                <span className={`text-lg font-black tabular-nums ${scen.sim.monthlySavings && scen.sim.monthlySavings > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(scen.sim.monthlySavings || 0, currency)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-semibold text-slate-500">Financial Runway</span>
                <span className="text-lg font-black text-slate-900">{(scen.sim.emergencyRunway || 0).toFixed(1)} mos</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Section 10: SEO Content Layer
export function SeoContentLayer({ simulation, countryId, cityName, salary }: { simulation: CalculationResult, countryId: string, cityName: string, salary: number }) {
  const currency = countryId === 'usa' ? 'USD' : countryId === 'uk' ? 'GBP' : 'EUR';
  const ctryName = countryId === 'usa' ? 'the United States' : countryId === 'uk' ? 'the United Kingdom' : 'Germany';
  
  return (
    <section className="py-12 border-b border-slate-100">
      <article className="prose prose-slate max-w-4xl">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Salary After Tax in {ctryName}</h2>
        <p className="text-slate-600 text-lg leading-relaxed mb-4">
          At a gross salary of <strong className="text-slate-900">{formatCurrency(salary, currency)}</strong> in {ctryName}, your estimated monthly take-home pay is <strong className="text-slate-900">{formatCurrency(simulation.netMonthlyTakeHome, currency)}</strong> after deducting statutory income taxes and social contributions.
        </p>
        <p className="text-slate-600 text-lg leading-relaxed">
          If you plan to relocate to <strong className="text-slate-900">{cityName || 'a major city'}</strong>, your estimated monthly living costs will be around <strong className="text-slate-900">{formatCurrency(simulation.itemizedMonthlyLivingCosts || 0, currency)}</strong>, leaving you with a net monthly savings potential of <strong className="text-slate-900">{formatCurrency(simulation.monthlySavings || 0, currency)}</strong>. 
          {simulation.savingsPercentage && simulation.savingsPercentage > 20 
            ? ' This is considered an excellent savings rate, providing a strong financial runway.' 
            : ' Careful budgeting is recommended to maintain a healthy financial runway.'}
        </p>
      </article>
    </section>
  );
}

// Section 8: City Comparison
export function CityComparison({ countryId, salary, currentSavings }: { countryId: string, salary: number, currentSavings: number }) {
  const currency = countryId === 'usa' ? 'USD' : countryId === 'uk' ? 'GBP' : 'EUR';
  
  // Hardcoded popular comparisons based on country
  const pairs = countryId === 'usa' ? [
    { c1: 'new-york', c1Name: 'New York', c2: 'austin', c2Name: 'Austin' },
    { c1: 'san-francisco', c1Name: 'San Francisco', c2: 'seattle', c2Name: 'Seattle' }
  ] : countryId === 'uk' ? [
    { c1: 'london', c1Name: 'London', c2: 'manchester', c2Name: 'Manchester' }
  ] : [
    { c1: 'berlin', c1Name: 'Berlin', c2: 'munich', c2Name: 'Munich' }
  ];

  return (
    <section className="py-12 border-b border-slate-100">
      <h2 className="text-3xl font-bold text-slate-900 mb-2">City Comparison Engine</h2>
      <p className="text-slate-500 mb-8 font-medium">Compare the financial reality of top destinations.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pairs.map((pair, i) => {
          let sim1, sim2;
          try {
            sim1 = getFinancialSimulation(countryId as any, pair.c1, 'mid_range', salary, currentSavings);
            sim2 = getFinancialSimulation(countryId as any, pair.c2, 'mid_range', salary, currentSavings);
          } catch (e) {
            return null;
          }

          return (
            <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-slate-50">
                <h4 className="text-lg font-bold text-slate-900 mb-4">{pair.c1Name}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Net Income</span>
                    <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(sim1.netMonthlyTakeHome, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Living Cost</span>
                    <span className="font-bold text-rose-500 tabular-nums">{formatCurrency(sim1.itemizedMonthlyLivingCosts || 0, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-50">
                    <span className="text-slate-500 font-medium">Savings</span>
                    <span className="font-black text-emerald-600 tabular-nums">{formatCurrency(Math.max(0, sim1.monthlySavings || 0), currency)}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-6 bg-slate-50/50">
                <h4 className="text-lg font-bold text-slate-900 mb-4">{pair.c2Name}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Net Income</span>
                    <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(sim2.netMonthlyTakeHome, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Living Cost</span>
                    <span className="font-bold text-rose-500 tabular-nums">{formatCurrency(sim2.itemizedMonthlyLivingCosts || 0, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-50">
                    <span className="text-slate-500 font-medium">Savings</span>
                    <span className="font-black text-emerald-600 tabular-nums">{formatCurrency(Math.max(0, sim2.monthlySavings || 0), currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
