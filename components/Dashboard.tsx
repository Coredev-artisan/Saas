"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { getFinancialSimulation, CalculationResult } from '../lib/tax/engine';
import { formatCurrency, formatPercentage } from '../lib/utils/formatters';
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
  }, []);

  // Compute Calculation
  const simulation: CalculationResult | null = useMemo(() => {
    if (!mounted || !hasCalculated || !countryId) return null;
    const annualSalary = payPeriod === 'monthly' ? grossSalary * 12 : grossSalary;
    try {
      return getFinancialSimulation(countryId as any, selectedCityId || cityQuery.toLowerCase().replace(/\\s+/g, '-'), lifestyle, annualSalary, currentSavings);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [mounted, hasCalculated, grossSalary, payPeriod, countryId, filingStatus, selectedCityId, cityQuery, lifestyle, currentSavings]);

  // City Autocomplete Filter
  const filteredCities = useMemo(() => {
    if (!cityQuery) return [];
    const query = cityQuery.toLowerCase();
    return citiesData.filter(c => c.name.toLowerCase().includes(query) && c.country_id === countryId);
  }, [cityQuery, countryId]);

  const activeCity = useMemo(() => {
    if (selectedCityId) return citiesData.find(c => c.id === selectedCityId);
    if (filteredCities.length > 0) return filteredCities[0]; // fallback to first match
    return { name: cityQuery || 'Anywhere', cost_multiplier: 1.0 };
  }, [selectedCityId, filteredCities, cityQuery]);

  if (!mounted) return null; // Prevent hydration errors

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* SaaS Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100/60">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">TakeHome Pro</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-sm font-semibold text-slate-900 hover:text-teal-600 transition-colors">Calculator</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Cities</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Compare</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Tax Guides</a>
              <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-teal-500 transition-all">
                 <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        
        {/* SECTION 1: Hero Centered Funnel */}
        <section className="flex flex-col items-center justify-center min-h-[70vh] max-w-3xl mx-auto space-y-10">
          
          <header className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-5xl md:text-[64px] leading-tight font-extrabold tracking-tight text-slate-900">
              Know Your Real Take-Home Salary <span className="text-teal-500">Anywhere</span>.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium max-w-2xl mx-auto">
              Calculate taxes, living costs, savings potential and financial runway across major global cities.
            </p>
          </header>

          {/* Centered Progressive Form */}
          <div className="w-full bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 relative z-10 text-left">
            
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider">1. Select Your Country</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-2xl p-4 focus:ring-2 focus:ring-teal-500 outline-none transition-all cursor-pointer text-lg appearance-none"
                value={countryId} 
                onChange={e => {
                  setCountryId(e.target.value as any);
                  setHasCalculated(false);
                }}
              >
                <option value="" disabled>Choose a country...</option>
                <option value="usa">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="germany">Germany</option>
              </select>
            </div>

            {countryId && (
              <div className="space-y-8 animate-in slide-in-from-top-4 fade-in duration-500">
                <div className="space-y-3 relative">
                  <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider">2. Where are you moving?</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-semibold rounded-2xl p-4 focus:ring-2 focus:ring-teal-500 outline-none transition-shadow text-lg"
                    placeholder="Search city..."
                    value={cityQuery}
                    onFocus={() => setIsCityFocused(true)}
                    onBlur={() => setTimeout(() => setIsCityFocused(false), 200)}
                    onChange={e => {
                      setCityQuery(e.target.value);
                      setSelectedCityId('');
                      setHasCalculated(false);
                    }}
                  />
                  {isCityFocused && filteredCities.length > 0 && (
                    <div className="absolute z-50 w-full bg-white border border-slate-100 rounded-2xl shadow-xl mt-1 max-h-48 overflow-y-auto">
                      {filteredCities.map(c => (
                        <div key={c.id} onClick={() => { setSelectedCityId(c.id); setCityQuery(c.name); }} className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0">{c.name}</div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider">3. Gross Salary</label>
                    <span className="text-2xl font-black text-slate-900 tabular-nums">
                      {formatCurrency(grossSalary, countryId === 'usa' ? 'USD' : countryId === 'uk' ? 'GBP' : 'EUR')}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="20000" 
                    max="300000" 
                    step="1000"
                    value={grossSalary} 
                    onChange={e => {
                      setGrossSalary(Number(e.target.value));
                      if (hasCalculated) setHasCalculated(false);
                    }}
                    className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                </div>

                <button 
                  onClick={() => setHasCalculated(true)}
                  className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold rounded-2xl shadow-md transition-all active:scale-[0.98]"
                >
                  Calculate My Financial Reality
                </button>
              </div>
            )}
          </div>
        </section>

        {hasCalculated && simulation && countryId && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both border-t border-slate-100 mt-16 pt-16">
            {/* Sections 2-7 */}
            <ResultsDashboard simulation={simulation} countryId={countryId} />
            <HealthScore simulation={simulation} />
            <IncomeDistribution simulation={simulation} countryId={countryId} />
            <DetailedTaxBreakdown simulation={simulation} countryId={countryId} />
            <CostOfLivingAnalysis simulation={simulation} countryId={countryId} cityMultiplier={activeCity?.cost_multiplier || 1.0} cityName={activeCity?.name || ''} />
            <AffordabilityScenarios countryId={countryId} cityId={selectedCityId || cityQuery.toLowerCase().replace(/\\s+/g, '-')} salary={grossSalary} currentSavings={currentSavings} />
            <CityComparison countryId={countryId} salary={grossSalary} currentSavings={currentSavings} />
            
            {/* Affiliate & SEO Sections */}
            <section className="py-12 border-b border-slate-100">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Premium Relocation Partners</h2>
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
