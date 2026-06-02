import React from 'react';

interface AffiliateCardProps {
  countryId: string;
}

export default function ExpatAffiliateCard({ countryId }: AffiliateCardProps) {
  if (countryId === 'germany') {
    return (
      <div className="mt-8 bg-white border border-slate-100 border-l-4 border-l-blue-500 rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-1">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Moving to Germany? Essential Relocation Steps</h3>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Secure your study or job-seeker visa instantly. German law requires a government-approved Blocked Account (Sperrkonto) and mandatory health insurance before arrival.
            </p>
            <ul className="space-y-2 mb-5">
              <li className="flex items-center text-sm text-slate-600">
                <svg className="w-4 h-4 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Digital Blocked Account setup in minutes
              </li>
              <li className="flex items-center text-sm text-slate-600">
                <svg className="w-4 h-4 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Integrated Public/Private Health Insurance
              </li>
            </ul>
            <a
              href="https://www.expatrio.com?partner=your_id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Set Up Expatrio Account
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Default to SafetyWing for US, UK, and others
  return (
    <div className="mt-8 bg-white border border-slate-100 border-l-4 border-l-teal-500 rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md">
       <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-1">
            <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Smart Travel Checklist</h3>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Protect your international move. Secure comprehensive travel and medical insurance designed specifically for remote workers, digital nomads, and expats.
            </p>
            <ul className="space-y-2 mb-5">
              <li className="flex items-center text-sm text-slate-600">
                <svg className="w-4 h-4 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Global medical coverage outside your home country
              </li>
              <li className="flex items-center text-sm text-slate-600">
                <svg className="w-4 h-4 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Flexible monthly subscriptions
              </li>
            </ul>
            <a
              href="https://www.safetywing.com?partner=your_id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Explore SafetyWing Coverage
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
          </div>
        </div>
    </div>
  );
}
