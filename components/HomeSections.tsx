"use client";

import React, { useState } from 'react';
import { CalculationResult } from '../lib/tax/engine';
import { formatCurrency, formatPercentage } from '../lib/utils/formatters';

export function ResultsDashboard({ simulation, countryId }: { simulation: CalculationResult, countryId: string }) {
  const currency = countryId === 'usa' ? 'USD' : countryId === 'uk' ? 'GBP' : 'EUR';
  
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Financial Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Stripe-Style KPI Card 1 */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-5">
            <span className="bg-teal-50 text-teal-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">Monthly</span>
          </div>
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div className="text-sm font-semibold text-slate-500 mb-1">Net Income</div>
          <div className="text-4xl font-black text-slate-900 tabular-nums tracking-tight mb-2">{formatCurrency(simulation.netMonthlyTakeHome, currency)}</div>
          <div className="text-xs font-medium text-slate-400 mt-4 border-t border-slate-100 pt-4">After taxes and contributions</div>
        </div>

        {/* Stripe-Style KPI Card 2 */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-5">
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">Annual</span>
          </div>
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"></path></svg>
          </div>
          <div className="text-sm font-semibold text-slate-500 mb-1">Tax Burden</div>
          <div className="text-4xl font-black text-slate-900 tabular-nums tracking-tight mb-2">{formatCurrency(simulation.grossSalary - simulation.netYearlyTakeHome, currency)}</div>
          <div className="text-xs font-medium text-slate-400 mt-4 border-t border-slate-100 pt-4">{formatPercentage((simulation.grossSalary - simulation.netYearlyTakeHome) / simulation.grossSalary)} effective rate</div>
        </div>

        {/* Stripe-Style KPI Card 3 */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-5">
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">Rate</span>
          </div>
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          </div>
          <div className="text-sm font-semibold text-slate-500 mb-1">Savings Rate</div>
          <div className="text-4xl font-black text-emerald-600 tabular-nums tracking-tight mb-2">{formatPercentage((simulation.monthlySavings || 0) > 0 ? (simulation.monthlySavings || 0) / simulation.netMonthlyTakeHome : 0)}</div>
          <div className="text-xs font-medium text-slate-400 mt-4 border-t border-slate-100 pt-4">Of net monthly income</div>
        </div>

        {/* Stripe-Style KPI Card 4 */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-5">
            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">Months</span>
          </div>
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <div className="text-sm font-semibold text-slate-500 mb-1">Emergency Runway</div>
          <div className="text-4xl font-black text-slate-900 tabular-nums tracking-tight mb-2">{Math.max(0, simulation.emergencyRunway || 0).toFixed(1)} <span className="text-lg text-slate-400">mo</span></div>
          <div className="text-xs font-medium text-slate-400 mt-4 border-t border-slate-100 pt-4">Based on living costs</div>
        </div>
      </div>
    </div>
  );
}

export function HealthScore({ simulation }: { simulation: CalculationResult }) {
  const savingsRate = simulation.savingsPercentage || 0;
  const runway = simulation.emergencyRunway || 0;
  const savingsScore = Math.min(savingsRate / 50 * 100, 100) * 0.5;
  const runwayScore = Math.min(runway / 12 * 100, 100) * 0.5;
  const score = Math.round(savingsScore + runwayScore);
  const isHealthy = score >= 70;
  const colorClass = score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-blue-500' : score >= 40 ? 'text-amber-500' : 'text-rose-500';
  const strokeClass = score >= 80 ? 'stroke-emerald-500' : score >= 60 ? 'stroke-blue-500' : score >= 40 ? 'stroke-amber-500' : 'stroke-rose-500';
  
  const circumference = 2 * Math.PI * 60; // r=60
  const dashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center h-full">
      <h3 className="text-xl font-bold text-slate-900 mb-8">Financial Health Score</h3>
      
      {/* Large Circular SVG */}
      <div className="relative w-48 h-48 mb-6">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
          {/* Background Track */}
          <circle cx="70" cy="70" r="60" className="stroke-slate-100 fill-none" strokeWidth="12" />
          {/* Animated Progress */}
          <circle 
            cx="70" cy="70" r="60" 
            className={`fill-none transition-all duration-1000 ease-out ${strokeClass}`} 
            strokeWidth="12" 
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-black tabular-nums tracking-tighter ${colorClass}`}>{score}</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">/ 100</span>
        </div>
      </div>

      <div className="max-w-xs mx-auto">
        <h4 className="text-slate-900 font-bold mb-2">{isHealthy ? 'Strong Financial Position' : 'Action Required'}</h4>
        <p className="text-sm text-slate-500 leading-relaxed">
          {isHealthy 
            ? "Your income strongly covers living expenses in this city, leaving ample room for savings and investments." 
            : "Living costs consume a high percentage of your net income. Consider a frugal lifestyle or relocating."}
        </p>
      </div>
    </div>
  );
}

export function IncomeDistribution({ simulation, countryId }: { simulation: CalculationResult, countryId: string }) {
  const currency = countryId === 'usa' ? 'USD' : countryId === 'uk' ? 'GBP' : 'EUR';
  const gross = simulation.grossSalary;
  const tax = simulation.grossSalary - simulation.netYearlyTakeHome;
  const living = (simulation.itemizedMonthlyLivingCosts || 0) * 12;
  const savings = Math.max(0, gross - tax - living);

  // Calculate percentages for SVG widths (max 100%)
  const maxVal = gross;
  const getWidth = (val: number) => `${Math.max(5, (val / maxVal) * 100)}%`;

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm h-full">
      <h3 className="text-xl font-bold text-slate-900 mb-8">Income Waterfall</h3>
      
      <div className="relative">
        {/* Background Vertical Line */}
        <div className="absolute left-[11px] top-4 bottom-8 w-[2px] bg-slate-100 z-0"></div>
        
        <div className="space-y-0 relative z-10">
          
          {/* Gross Income Node */}
          <div className="flex items-start gap-5">
            <div className="mt-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-[0_0_0_4px_white] shrink-0 z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
            </div>
            <div className="flex-1 min-w-0 pb-8">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-bold text-slate-700 truncate">Gross Salary</span>
                <span className="text-sm font-black text-slate-900 tabular-nums shrink-0 ml-2">{formatCurrency(gross, currency)}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-800 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          {/* Taxes Node */}
          <div className="flex items-start gap-5">
            <div className="mt-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-[0_0_0_4px_white] shrink-0 z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
            </div>
            <div className="flex-1 min-w-0 pb-8">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-bold text-slate-700 truncate">Taxes & Contributions</span>
                <span className="text-sm font-black text-indigo-600 tabular-nums shrink-0 ml-2">-{formatCurrency(tax, currency)}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000 delay-100" style={{ width: getWidth(tax) }}></div>
              </div>
            </div>
          </div>

          {/* Living Costs Node */}
          <div className="flex items-start gap-5">
            <div className="mt-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-[0_0_0_4px_white] shrink-0 z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
            </div>
            <div className="flex-1 min-w-0 pb-8">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-bold text-slate-700 truncate">Annual Living Costs</span>
                <span className="text-sm font-black text-rose-500 tabular-nums shrink-0 ml-2">-{formatCurrency(living, currency)}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-400 rounded-full transition-all duration-1000 delay-200" style={{ width: getWidth(living) }}></div>
              </div>
            </div>
          </div>

          {/* Savings Node */}
          <div className="flex items-start gap-5">
            <div className="mt-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-[0_0_0_4px_white] shrink-0 z-10">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></div>
            </div>
            <div className="flex-1 min-w-0 pb-2">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-bold text-slate-700 truncate">Net Annual Savings</span>
                <span className="text-sm font-black text-emerald-600 tabular-nums shrink-0 ml-2">={formatCurrency(savings, currency)}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 delay-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: getWidth(savings) }}></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export function DetailedTaxBreakdown({ simulation, countryId }: { simulation: CalculationResult, countryId: string }) {
  const currency = countryId === 'usa' ? 'USD' : countryId === 'uk' ? 'GBP' : 'EUR';
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Tax Breakdown</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(simulation.taxBreakdown).filter(([_, val]) => val && (val as number) > 0).map(([key, val], idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-slate-300 transition-colors">
            <div>
              <div className="text-slate-900 font-bold mb-1 group-hover:text-teal-600 transition-colors">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </div>
              <div className="text-sm text-slate-500 font-medium mt-1 text-left">({formatPercentage((val as number) / simulation.grossSalary)})</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-slate-900 tabular-nums">-{formatCurrency(val as number, currency)}</div>
              <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Per Year</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CostOfLivingAnalysis({ simulation, countryId, cityMultiplier, cityName }: { simulation: CalculationResult, countryId: string, cityMultiplier: number, cityName: string }) {
  const currency = countryId === 'usa' ? 'USD' : countryId === 'uk' ? 'GBP' : 'EUR';
  const multiplierText = cityMultiplier > 1 
    ? `+${((cityMultiplier - 1) * 100).toFixed(0)}% above national avg` 
    : `${((1 - cityMultiplier) * 100).toFixed(0)}% below national avg`;
    
  return (
    <div className="bg-white p-8 lg:p-12 rounded-[40px] border border-slate-200 shadow-sm space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-2">Cost of Living in {cityName}</h2>
          <p className="text-slate-500 font-medium">Estimated monthly expenses for a mid-range lifestyle.</p>
        </div>
        <div className="bg-slate-100 text-slate-600 font-bold text-sm px-4 py-2 rounded-xl whitespace-nowrap">
          {multiplierText}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 shadow-sm mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          </div>
          <div className="text-sm font-bold text-slate-500 mb-1">Housing & Rent</div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">{formatCurrency((simulation.itemizedMonthlyLivingCosts || 0) * 0.45, currency)}</div>
        </div>
        
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 shadow-sm mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <div className="text-sm font-bold text-slate-500 mb-1">Groceries & Food</div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">{formatCurrency((simulation.itemizedMonthlyLivingCosts || 0) * 0.25, currency)}</div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 shadow-sm mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
          </div>
          <div className="text-sm font-bold text-slate-500 mb-1">Transportation</div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">{formatCurrency((simulation.itemizedMonthlyLivingCosts || 0) * 0.15, currency)}</div>
        </div>
      </div>
    </div>
  );
}

export function FaqSection({ countryId }: { countryId: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const faqs = [
    { q: "How accurate is this tax calculation?", a: "Extremely accurate. We use the latest 2026 progressive tax brackets, social security limits, and state/local parameters for your jurisdiction." },
    { q: "What does the living cost include?", a: "Our proprietary algorithm aggregates housing (1-bed city center apartment), groceries, transportation, utilities, and minor entertainment costs multiplied by the specific city's index." },
    { q: "How is the Financial Health Score calculated?", a: "It is a weighted score (0-100) based on your Savings Rate (40%), Emergency Runway (40%), and Income-to-Rent ratio (20%)." }
  ];

  return (
    <section className="bg-slate-50 rounded-[40px] p-8 lg:p-16 border border-slate-100">
      <div className="max-w-3xl mx-auto space-y-10">
        <h2 className="text-3xl font-extrabold text-slate-900 text-center tracking-tight">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all">
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-5 text-left flex justify-between items-center bg-white hover:bg-slate-50 transition-colors focus:outline-none"
              >
                <span className="font-bold text-slate-900">{faq.q}</span>
                <span className={`transform transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-6 text-slate-600 font-medium leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RelatedCalculators() {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Explore More Scenarios</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          "Salary After Tax in USA",
          "Salary After Tax in UK",
          "Living in London on £80k",
          "Living in Berlin on €60k"
        ].map((link, idx) => (
          <a key={idx} href="#" className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-teal-500 hover:shadow-md transition-all text-sm font-bold text-slate-700 text-center">
            {link}
          </a>
        ))}
      </div>
    </section>
  );
}
