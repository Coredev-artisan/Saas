"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { getFinancialSimulation, CalculationResult } from '../lib/tax/engine';
import { formatCurrency } from '../lib/utils/formatters';
import ExpatAffiliateCard from '../components/ExpatAffiliateCard';
import citiesData from '../data/cities.json';
import { ResultsDashboard, HealthScore, IncomeDistribution, DetailedTaxBreakdown, CostOfLivingAnalysis, FaqSection, RelatedCalculators } from '../components/HomeSections';
import { AffordabilityScenarios, SeoContentLayer, CityComparison } from '../components/HomeScenarios';

export interface DashboardProps {
  initialCountry?: 'usa' | 'uk' | 'germany' | '';
  initialSalary?: number;
  initialCityId?: string;
  initialCityQuery?: string;
}

export default function Dashboard({ initialCountry = '', initialSalary = 80000, initialCityId = '', initialCityQuery = '' }: DashboardProps) {
  const [mounted, setMounted] = useState(false);
  const [isSimulating, setIsSimulating] = useState(true);

  // State
  const [grossSalary, setGrossSalary] = useState(initialSalary);
  const [payPeriod, setPayPeriod] = useState<'annual' | 'monthly'>('annual');
  const [countryId, setCountryId] = useState<'usa' | 'uk' | 'germany' | ''>(initialCountry);
  const [hasCalculated, setHasCalculated] = useState(!!initialCountry);
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>('single');
  const [cityQuery, setCityQuery] = useState(initialCityQuery);
  const [selectedCityId, setSelectedCityId] = useState(initialCityId);
  const [lifestyle, setLifestyle] = useState<'frugal' | 'mid_range' | 'premium'>('mid_range');
  const [currentSavings, setCurrentSavings] = useState(10000);
  const [isCityFocused, setIsCityFocused] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simulate initial loading state for skeleton
    const timer = setTimeout(() => setIsSimulating(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Compute Calculation
  const simulation: CalculationResult | null = useMemo(() => {
    if (!mounted || !countryId) return null;
    const annualSalary = payPeriod === 'monthly' ? grossSalary * 12 : grossSalary;
    try {
      return getFinancialSimulation(countryId as any, selectedCityId || cityQuery.toLowerCase().replace(/\\s+/g, '-'), lifestyle, annualSalary, currentSavings);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [mounted, grossSalary, payPeriod, countryId, filingStatus, selectedCityId, cityQuery, lifestyle, currentSavings]);

  // City Autocomplete Filter
  const filteredCities = useMemo(() => {
    if (!cityQuery) return [];
    const query = cityQuery.toLowerCase();
    return citiesData.filter(c => c.name.toLowerCase().includes(query) && c.country_id === countryId);
  }, [cityQuery, countryId]);

  const activeCity = useMemo(() => {
    if (selectedCityId) return citiesData.find(c => c.id === selectedCityId);
    if (filteredCities.length > 0) return filteredCities[0];
    return { name: cityQuery || 'Anywhere', cost_multiplier: 1.0 };
  }, [selectedCityId, filteredCities, cityQuery]);

  const handleCalculate = () => {
    setIsSimulating(true);
    setHasCalculated(true);
    setTimeout(() => setIsSimulating(false), 600);
  };

  if (!mounted) return null; // Prevent hydration errors

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900 overflow-x-hidden">
      
      {/* SaaS Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              </div>
              <span className="font-bold text-[19px] tracking-tight text-slate-900">TakeHome Pro</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-semibold text-slate-900 hover:text-teal-600 transition-colors">Calculator</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Intelligence</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Compare</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Tax Hub</a>
              <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-teal-500 hover:border-teal-500 transition-all">
                 <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
        
        {/* HERO SECTION: 90vh 2-Column Premium Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center min-h-[85vh]">
          
          {/* LEFT: Inputs & Headlines */}
          <div className="lg:col-span-6 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-20">
            <header className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-teal-100 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span>2026 Tax Engine Live</span>
              </div>
              <h1 className="text-5xl lg:text-[68px] leading-[1.05] font-extrabold tracking-tight text-slate-900">
                True Financial <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-indigo-600">Reality.</span>
              </h1>
              <p className="text-[19px] text-slate-500 leading-relaxed font-medium max-w-lg">
                Calculate your exact take-home pay, living costs, and runway across major global cities with venture-grade accuracy.
              </p>
            </header>

            {/* Premium Control Center */}
            <div className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 space-y-8 relative">
              
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Tax Jurisdiction</label>
                <div className="relative">
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all cursor-pointer text-lg appearance-none shadow-inner"
                    value={countryId} 
                    onChange={e => { setCountryId(e.target.value as any); setHasCalculated(false); }}
                  >
                    <option value="" disabled>Select a country...</option>
                    <option value="usa">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="germany">Germany</option>
                  </select>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {countryId && (
                <div className="space-y-8 animate-in slide-in-from-top-4 fade-in duration-500">
                  <div className="space-y-3 relative">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Target City</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow text-lg shadow-inner placeholder-slate-400"
                        placeholder="Search city (e.g. Berlin)..."
                        value={cityQuery}
                        onFocus={() => setIsCityFocused(true)}
                        onBlur={() => setTimeout(() => setIsCityFocused(false), 200)}
                        onChange={e => { setCityQuery(e.target.value); setSelectedCityId(''); setHasCalculated(false); }}
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      </div>
                    </div>
                    {isCityFocused && filteredCities.length > 0 && (
                      <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl mt-2 max-h-60 overflow-y-auto overflow-hidden">
                        {filteredCities.map(c => (
                          <div key={c.id} onClick={() => { setSelectedCityId(c.id); setCityQuery(c.name); }} className="px-5 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 flex items-center justify-between transition-colors">
                            <span>{c.name}</span>
                            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Select</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    <div className="flex justify-between items-end">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Gross Annual Salary</label>
                    </div>
                    <div className="relative pt-6 pb-2">
                      {/* Floating Bubble */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-black text-xl py-1.5 px-4 rounded-xl shadow-lg pointer-events-none tabular-nums whitespace-nowrap before:content-[''] before:absolute before:-bottom-1.5 before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-slate-900 transition-all duration-75"
                           style={{ left: `calc(${((grossSalary - 20000) / 280000) * 100}%)` }}>
                        {formatCurrency(grossSalary, countryId === 'usa' ? 'USD' : countryId === 'uk' ? 'GBP' : 'EUR')}
                      </div>
                      <input 
                        type="range" 
                        min="20000" max="300000" step="1000"
                        value={grossSalary} 
                        onChange={e => { setGrossSalary(Number(e.target.value)); if(hasCalculated) setHasCalculated(false); }}
                        className="w-full h-2.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-teal-500 shadow-inner focus:outline-none focus:ring-4 focus:ring-teal-500/20"
                      />
                      <div className="flex justify-between text-xs font-semibold text-slate-400 mt-3 tabular-nums">
                        <span>{formatCurrency(20000, countryId === 'usa' ? 'USD' : countryId === 'uk' ? 'GBP' : 'EUR')}</span>
                        <span>{formatCurrency(300000, countryId === 'usa' ? 'USD' : countryId === 'uk' ? 'GBP' : 'EUR')}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleCalculate}
                    className="w-full py-5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white text-[17px] font-bold rounded-2xl shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] transition-all active:scale-[0.98] flex items-center justify-center space-x-2 border border-slate-800/50"
                  >
                    <span>Run Financial Simulation</span>
                    <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Live Preview Dashboard (Stripe-Style) */}
          <div className="lg:col-span-6 relative h-full flex flex-col justify-center">
            {/* Glass Background Blur */}
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 via-indigo-500/5 to-transparent rounded-[40px] blur-3xl -z-10 pointer-events-none"></div>
            
            <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/60 p-8 lg:p-10 relative overflow-hidden flex-1 flex flex-col justify-center">
              
              {/* Shimmer Skeleton if loading/simulating */}
              {(isSimulating || !countryId) && (
                <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex flex-col justify-center p-10 space-y-8">
                  <div className="h-6 w-1/3 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="h-16 w-3/4 bg-slate-200 rounded-2xl animate-pulse delay-75"></div>
                  <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-100">
                    <div className="space-y-4">
                      <div className="h-4 w-1/2 bg-slate-200 rounded-full animate-pulse delay-100"></div>
                      <div className="h-8 w-2/3 bg-slate-200 rounded-xl animate-pulse delay-150"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-4 w-1/2 bg-slate-200 rounded-full animate-pulse delay-200"></div>
                      <div className="h-8 w-2/3 bg-slate-200 rounded-xl animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
              )}

              {simulation && countryId && (
                <div className="relative z-10 space-y-10">
                  <div className="flex items-center space-x-3 text-xs font-bold text-slate-400 tracking-widest uppercase mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]"></div>
                    <span>{activeCity?.name} Output</span>
                  </div>
                  
                  <div>
                    <div className="text-slate-500 font-semibold mb-2 flex items-center space-x-2">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>Net Monthly Income</span>
                    </div>
                    <div className="text-[64px] font-black tracking-tighter text-slate-900 tabular-nums leading-none">
                      {formatCurrency(simulation.netMonthlyTakeHome, countryId === 'usa' ? 'USD' : countryId === 'uk' ? 'GBP' : 'EUR')}
                    </div>
                    <div className="text-sm font-medium text-slate-500 mt-3 bg-slate-50 inline-block px-3 py-1 rounded-lg border border-slate-100">
                      After {formatCurrency((simulation.grossSalary - simulation.netYearlyTakeHome) / 12, countryId === 'usa' ? 'USD' : countryId === 'uk' ? 'GBP' : 'EUR')} in monthly taxes
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                    <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50 transition-colors hover:bg-emerald-50">
                      <div className="text-emerald-700 text-sm font-bold mb-2 flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        <span>Savings Potential</span>
                      </div>
                      <div className="text-3xl font-black text-emerald-600 tabular-nums">{formatCurrency(Math.max(0, simulation.monthlySavings || 0), countryId === 'usa' ? 'USD' : countryId === 'uk' ? 'GBP' : 'EUR')}</div>
                      <div className="text-xs font-semibold text-emerald-600/70 mt-1">Per Month</div>
                    </div>
                    
                    <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100/50 transition-colors hover:bg-rose-50">
                      <div className="text-rose-700 text-sm font-bold mb-2 flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        <span>Living Costs</span>
                      </div>
                      <div className="text-3xl font-black text-rose-600 tabular-nums">{formatCurrency(simulation.itemizedMonthlyLivingCosts || 0, countryId === 'usa' ? 'USD' : countryId === 'uk' ? 'GBP' : 'EUR')}</div>
                      <div className="text-xs font-semibold text-rose-600/70 mt-1">Estimated</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {hasCalculated && simulation && countryId && !isSimulating && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both border-t border-slate-200 mt-24 pt-24 space-y-24">
            
            {/* Sections 2-7 Rebuilt below in HomeSections */}
            <ResultsDashboard simulation={simulation} countryId={countryId} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <HealthScore simulation={simulation} />
              <IncomeDistribution simulation={simulation} countryId={countryId} />
            </div>

            <DetailedTaxBreakdown simulation={simulation} countryId={countryId} />
            <CostOfLivingAnalysis simulation={simulation} countryId={countryId} cityMultiplier={activeCity?.cost_multiplier || 1.0} cityName={activeCity?.name || ''} />
            <AffordabilityScenarios countryId={countryId} cityId={selectedCityId || cityQuery.toLowerCase().replace(/\\s+/g, '-')} salary={grossSalary} currentSavings={currentSavings} />
            <CityComparison countryId={countryId} salary={grossSalary} currentSavings={currentSavings} />
            
            <section className="py-16 border-t border-slate-200">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-10 tracking-tight">Premium Relocation Partners</h2>
              <ExpatAffiliateCard countryId={countryId} />
            </section>
            
            <SeoContentLayer simulation={simulation} countryId={countryId} cityName={activeCity?.name || ''} salary={grossSalary} />
            <FaqSection countryId={countryId} />
            <RelatedCalculators />
          </div>
        )}

      </main>
    </div>
  );
}
