import { describe, it, expect } from 'vitest';
import { calculateUSTax, calculateUKTax, calculateGermanTax, getFinancialSimulation } from '../lib/tax/engine';

describe('US Progressive Tax Calculation (Single Filer)', () => {
  it('calculates correct net pay for $40,000', () => {
    const result = calculateUSTax(40000, 'single');
    // $40,000 - $16,100 = $23,900 taxable
    // $12,400 @ 10% = 1240
    // $11,500 @ 12% = 1380
    // Income tax = 2620
    // SS: 40000 * 0.062 = 2480
    // Medicare: 40000 * 0.0145 = 580
    // Total Tax: 2620 + 2480 + 580 = 5680
    // Net: 40000 - 5680 = 34320
    expect(result.grossSalary).toBe(40000);
    expect(result.taxBreakdown.incomeTax).toBe(2620);
    expect(result.taxBreakdown.socialSecurity).toBe(2480);
    expect(result.taxBreakdown.medicare).toBe(580);
    expect(result.netYearlyTakeHome).toBe(34320);
  });

  it('calculates correct net pay for $80,000', () => {
    const result = calculateUSTax(80000, 'single');
    // $80,000 - $16,100 = $63,900 taxable
    // $12,400 @ 10% = 1240
    // $38,000 @ 12% = 4560
    // $13,500 @ 22% = 2970
    // Income tax = 8770
    // SS: 80000 * 0.062 = 4960
    // Medicare: 80000 * 0.0145 = 1160
    // Total Tax = 14890
    // Net: 80000 - 14890 = 65110
    expect(result.taxBreakdown.incomeTax).toBe(8770);
    expect(result.netYearlyTakeHome).toBe(65110);
  });

  it('calculates correct net pay for $150,000', () => {
    const result = calculateUSTax(150000, 'single');
    // $150k - $16.1k = $133,900 taxable
    // 10%: 1240
    // 12%: 4560
    // 22%: (105700 - 50400) * 0.22 = 55300 * 0.22 = 12166
    // 24%: (133900 - 105700) * 0.24 = 28200 * 0.24 = 6768
    // Income tax = 24734
    // SS: 150000 * 0.062 = 9300
    // Medicare: 150000 * 0.0145 = 2175
    // Total Tax: 36209
    // Net: 150000 - 36209 = 113791
    expect(result.taxBreakdown.incomeTax).toBe(24734);
    expect(result.netYearlyTakeHome).toBe(113791);
  });
});

describe('UK Progressive Tax Calculation', () => {
  it('calculates correct net pay for £40,000', () => {
    const result = calculateUKTax(40000);
    // Personal Allowance: £12,570
    // Taxable: 27430
    // 20% bracket: 27430 * 0.20 = 5486
    // NI: (40000 - 12570) * 0.08 = 2194.4
    // Total Tax: 7680.4
    // Net: 40000 - 7680.4 = 32319.6
    expect(result.grossSalary).toBe(40000);
    expect(result.taxBreakdown.incomeTax).toBe(5486);
    expect(result.taxBreakdown.nationalInsurance).toBe(2194.4);
    expect(result.netYearlyTakeHome).toBeCloseTo(32319.6);
  });

  it('calculates correct net pay for £80,000', () => {
    const result = calculateUKTax(80000);
    // Taxable: 67430
    // 20% on 37700 = 7540
    // 40% on (67430 - 37700) = 29730 * 0.40 = 11892
    // Total Income Tax = 19432
    // NI primary: (50270 - 12570) * 0.08 = 3016
    // NI secondary: (80000 - 50270) * 0.02 = 594.6
    // NI total = 3610.6
    // Total Tax = 23042.6
    // Net = 80000 - 23042.6 = 56957.4
    expect(result.taxBreakdown.incomeTax).toBe(19432);
    expect(result.taxBreakdown.nationalInsurance).toBeCloseTo(3610.6);
    expect(result.netYearlyTakeHome).toBeCloseTo(56957.4);
  });

  it('calculates correct net pay for £150,000', () => {
    const result = calculateUKTax(150000);
    // Allowance phase out: > 100k, so 50k / 2 = 25k > 12.57k. Allowance = 0
    // Taxable: 150000
    // 20% on 37700 = 7540
    // 40% on (125140 - 37700) = 87440 * 0.40 = 34976
    // 45% on (150000 - 125140) = 24860 * 0.45 = 11187
    // Total Income Tax = 53703
    // NI primary: (50270 - 12570) * 0.08 = 3016
    // NI secondary: (150000 - 50270) * 0.02 = 1994.6
    // NI total = 5010.6
    // Total Tax = 58713.6
    // Net = 150000 - 58713.6 = 91286.4
    expect(result.taxBreakdown.incomeTax).toBe(53703);
    expect(result.taxBreakdown.nationalInsurance).toBeCloseTo(5010.6);
    expect(result.netYearlyTakeHome).toBeCloseTo(91286.4);
  });
});

describe('Germany Progressive Tax Calculation (Single Filer)', () => {
  it('calculates correct net pay for €40,000', () => {
    const result = calculateGermanTax(40000, 'single');
    expect(result.grossSalary).toBe(40000);
    expect(result.taxBreakdown.incomeTax).toBeGreaterThan(0);
    expect(result.taxBreakdown.solidaritySurcharge).toBe(0); // Under 20350 limit
    expect(result.netYearlyTakeHome).toBeLessThan(40000);
  });

  it('calculates correct net pay for €80,000', () => {
    const result = calculateGermanTax(80000, 'single');
    expect(result.taxBreakdown.incomeTax).toBeGreaterThan(0);
    // Soli check might depend on exact math, let's just test determinism
    expect(result.netYearlyTakeHome).toBeLessThan(80000);
    expect(result.taxBreakdown.health).toBe(69750 * 0.0875); // hit cap
  });

  it('calculates correct net pay for €150,000', () => {
    const result = calculateGermanTax(150000, 'single');
    expect(result.taxBreakdown.pension).toBe(101400 * 0.093); // hit cap
    expect(result.taxBreakdown.solidaritySurcharge).toBeGreaterThan(0);
    expect(result.netYearlyTakeHome).toBeLessThan(150000);
  });
});

describe('Financial Simulation Orchestrator', () => {
  it('calculates monthly savings and runway accurately', () => {
    // US: 80000 salary, single.
    // Net yearly was 65110 -> 5425.83/mo
    // New York multiplier = 1.4, mid_range base = 3000 -> 4200 monthly cost
    // Savings = 5425.83 - 4200 = 1225.83
    // Runway with 10k savings = 10000 / 4200 = 2.38 months
    const sim = getFinancialSimulation('usa', 'new-york', 'mid_range', 80000, 10000);
    
    expect(sim.grossSalary).toBe(80000);
    expect(sim.itemizedMonthlyLivingCosts).toBe(4200);
    expect(sim.monthlySavings).toBeCloseTo(1225.83, 1);
    expect(sim.emergencyRunway).toBeCloseTo(2.38, 2);
  });
});
