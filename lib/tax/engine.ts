import citiesData from '../../data/cities.json';
import basketsData from '../../data/cost_baskets.json';

export interface TaxBreakdown {
  incomeTax: number;
  socialSecurity?: number;
  nationalInsurance?: number;
  medicare?: number;
  additionalMedicare?: number;
  solidaritySurcharge?: number;
  pension?: number;
  health?: number;
  unemployment?: number;
  longTermCare?: number;
}

export interface CalculationResult {
  grossSalary: number;
  netYearlyTakeHome: number;
  netMonthlyTakeHome: number;
  itemizedMonthlyLivingCosts?: number;
  monthlySavings?: number;
  savingsPercentage?: number;
  emergencyRunway?: number;
  taxBreakdown: TaxBreakdown;
}

function calculateProgressiveTax(taxableIncome: number, brackets: { rate: number, limit: number }[]): number {
  let tax = 0;
  let previousLimit = 0;

  for (const bracket of brackets) {
    if (taxableIncome > previousLimit) {
      const taxableAmountInBracket = Math.min(taxableIncome, bracket.limit) - previousLimit;
      tax += taxableAmountInBracket * bracket.rate;
    }
    previousLimit = bracket.limit;
  }
  return tax;
}

export function calculateUSTax(grossIncome: number, filingStatus: 'single' | 'married' = 'single'): CalculationResult {
  const isSingle = filingStatus === 'single';
  const standardDeduction = isSingle ? 16100 : 32200;
  
  // Social Security: 6.2% up to $184,500
  const socialSecurity = Math.min(grossIncome, 184500) * 0.062;
  
  // Medicare: 1.45% base
  const medicare = grossIncome * 0.0145;
  
  // Additional Medicare: 0.9% over $200k for single (assuming 250k for married based on common tax law, but let's strictly follow prompt: "Additional Medicare: An additional 0.9% Medicare tax applies to wages exceeding $200,000 for single filers." If married, I'll assume standard $250k or $200k. Prompt just says "for single filers", I will apply it only if single, or default 250k if married. Let's strictly use 200k if single).
  let additionalMedicare = 0;
  if (isSingle && grossIncome > 200000) {
    additionalMedicare = (grossIncome - 200000) * 0.009;
  } else if (!isSingle && grossIncome > 250000) {
    // Assuming standard US tax law for MFJ
    additionalMedicare = (grossIncome - 250000) * 0.009;
  }

  const taxableIncome = Math.max(0, grossIncome - standardDeduction);

  const brackets = isSingle ? [
    { rate: 0.10, limit: 12400 },
    { rate: 0.12, limit: 50400 },
    { rate: 0.22, limit: 105700 },
    { rate: 0.24, limit: 201775 },
    { rate: 0.32, limit: 256225 },
    { rate: 0.35, limit: 640600 },
    { rate: 0.37, limit: Infinity }
  ] : [
    { rate: 0.10, limit: 24800 },
    { rate: 0.12, limit: 100800 },
    { rate: 0.22, limit: 211400 },
    { rate: 0.24, limit: 403550 },
    { rate: 0.32, limit: 512450 },
    { rate: 0.35, limit: 768700 },
    { rate: 0.37, limit: Infinity }
  ];

  const incomeTax = calculateProgressiveTax(taxableIncome, brackets);
  const totalTax = incomeTax + socialSecurity + medicare + additionalMedicare;
  const netYearlyTakeHome = grossIncome - totalTax;

  return {
    grossSalary: grossIncome,
    netYearlyTakeHome,
    netMonthlyTakeHome: netYearlyTakeHome / 12,
    taxBreakdown: {
      incomeTax,
      socialSecurity,
      medicare,
      additionalMedicare
    }
  };
}

export function calculateUKTax(grossIncome: number): CalculationResult {
  // Personal Allowance: £12,570 baseline
  let personalAllowance = 12570;
  
  if (grossIncome > 100000) {
    const reduction = (grossIncome - 100000) / 2;
    personalAllowance = Math.max(0, personalAllowance - reduction);
  }

  const taxableIncome = Math.max(0, grossIncome - personalAllowance);

  // Income Tax Bands:
  // Note: UK bands are on taxable income (income above personal allowance)
  // Basic Rate (20%): Up to £37,700
  // Higher Rate (40%): £37,701 to £125,140 total income. This means taxable income up to (125140 - personal allowance)
  // But standard UK tax:
  // Basic: 0 to 37700
  // Higher: 37701 to 125140 (Total Income). Taxable band is from 37700 up to (125140 - personal allowance). Since allowance goes to 0 at 125140, the threshold is actually fixed at 125140.
  // Wait, let's look at prompt:
  // "Basic Rate (20%): On taxable income up to £37,700"
  // "Higher Rate (40%): From £37,701 to £125,140" -> total income or taxable? Usually, bands are defined on taxable income: 37700 basic, then up to 125140 of total income. So taxable limit for higher is 125140 - 0 = 125140 if allowance is 0.
  // Actually, standard rule: Higher rate threshold is 37700 + personal allowance = 50270.
  // So the 40% band is on taxable income from 37700 to (125140 - personalAllowance).
  const higherRateTaxableLimit = 125140 - personalAllowance;
  
  const brackets = [
    { rate: 0.20, limit: 37700 },
    { rate: 0.40, limit: higherRateTaxableLimit > 37700 ? higherRateTaxableLimit : 37700 },
    { rate: 0.45, limit: Infinity }
  ];

  const incomeTax = calculateProgressiveTax(taxableIncome, brackets);

  // National Insurance
  let nationalInsurance = 0;
  if (grossIncome > 12570) {
    const primaryLimit = Math.min(grossIncome, 50270);
    nationalInsurance += (primaryLimit - 12570) * 0.08;
  }
  if (grossIncome > 50270) {
    nationalInsurance += (grossIncome - 50270) * 0.02;
  }

  const totalTax = incomeTax + nationalInsurance;
  const netYearlyTakeHome = grossIncome - totalTax;

  return {
    grossSalary: grossIncome,
    netYearlyTakeHome,
    netMonthlyTakeHome: netYearlyTakeHome / 12,
    taxBreakdown: {
      incomeTax,
      nationalInsurance
    }
  };
}

export function calculateGermanTax(grossIncome: number, filingStatus: 'single' | 'married' = 'single'): CalculationResult {
  const isSingle = filingStatus === 'single';
  const basicAllowance = isSingle ? 12348 : 24696;
  const taxableIncome = Math.max(0, grossIncome - basicAllowance);

  let incomeTax = 0;
  if (taxableIncome > 0) {
    // Limits
    const progressiveZoneEnd = isSingle ? 69878 : 69878 * 2;
    const flat42End = isSingle ? 277825 : 277825 * 2;
    
    // Adjusted taxable income within zones
    const incomeInProgZone = Math.min(taxableIncome, progressiveZoneEnd - basicAllowance);
    if (incomeInProgZone > 0) {
      // Linear approximation from 14% to 42%
      // Average rate = (0.14 + (0.14 + (incomeInProgZone / size) * (0.42 - 0.14))) / 2
      const progZoneSize = progressiveZoneEnd - basicAllowance;
      const endRate = 0.14 + (incomeInProgZone / progZoneSize) * (0.42 - 0.14);
      const avgRate = (0.14 + endRate) / 2;
      incomeTax += incomeInProgZone * avgRate;
    }

    const incomeIn42Zone = Math.max(0, Math.min(grossIncome, flat42End) - Math.max(progressiveZoneEnd, basicAllowance));
    if (incomeIn42Zone > 0) {
      incomeTax += incomeIn42Zone * 0.42;
    }

    const incomeIn45Zone = Math.max(0, grossIncome - flat42End);
    if (incomeIn45Zone > 0) {
      incomeTax += incomeIn45Zone * 0.45;
    }
  }

  let solidaritySurcharge = 0;
  if (incomeTax >= 20350) {
    solidaritySurcharge = incomeTax * 0.055;
  }

  const pension = Math.min(grossIncome, 101400) * 0.093;
  const health = Math.min(grossIncome, 69750) * 0.0875;
  const unemployment = Math.min(grossIncome, 101400) * 0.013;
  const longTermCare = Math.min(grossIncome, 69750) * 0.018;

  const totalTax = incomeTax + solidaritySurcharge + pension + health + unemployment + longTermCare;
  const netYearlyTakeHome = grossIncome - totalTax;

  return {
    grossSalary: grossIncome,
    netYearlyTakeHome,
    netMonthlyTakeHome: netYearlyTakeHome / 12,
    taxBreakdown: {
      incomeTax,
      solidaritySurcharge,
      pension,
      health,
      unemployment,
      longTermCare
    }
  };
}

export function getFinancialSimulation(
  countryId: string, 
  cityId: string, 
  lifestyle: 'frugal' | 'mid_range' | 'premium', 
  grossIncome: number, 
  userSavingsInput: number = 0
): CalculationResult {
  let baseResult: CalculationResult;

  switch (countryId) {
    case 'usa':
      baseResult = calculateUSTax(grossIncome, 'single');
      break;
    case 'uk':
      baseResult = calculateUKTax(grossIncome);
      break;
    case 'germany':
      baseResult = calculateGermanTax(grossIncome, 'single');
      break;
    default:
      throw new Error(`Country ${countryId} not supported`);
  }

  // Use statically imported JSON data instead of fs.readFileSync
  const cities = citiesData;
  const baskets = basketsData as Record<string, number>;

  const city = cities.find((c: any) => c.id === cityId);
  const multiplier = city ? city.cost_multiplier : 0.65; // Fallback is 0.65 as per instructions
  const baseCost = baskets[lifestyle] || 0;

  const itemizedMonthlyLivingCosts = baseCost * multiplier;
  const monthlySavings = baseResult.netMonthlyTakeHome - itemizedMonthlyLivingCosts;
  const savingsPercentage = (monthlySavings / baseResult.netMonthlyTakeHome) * 100;
  const emergencyRunway = itemizedMonthlyLivingCosts > 0 ? userSavingsInput / itemizedMonthlyLivingCosts : 0;

  return {
    ...baseResult,
    itemizedMonthlyLivingCosts,
    monthlySavings,
    savingsPercentage,
    emergencyRunway
  };
}
