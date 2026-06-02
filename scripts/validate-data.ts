import { z } from "zod";
import * as fs from "fs";
import * as path from "path";

// 1. Zod Schemas
const CostBasketsSchema = z.object({
  frugal: z.number().positive(),
  mid_range: z.number().positive(),
  premium: z.number().positive(),
});

const CitySchema = z.object({
  id: z.string(),
  name: z.string(),
  country_id: z.string(),
  cost_multiplier: z.number().positive(),
});

const CountrySchema = z.object({
  id: z.string(),
  name: z.string(),
  currency: z.string(),
  currency_symbol: z.string(),
  tax_rules: z.any(), // Keeping it as 'any' for now to allow flexible schemas per country, could be strictly typed per country later
});

// 2. Load Data Files
const dataDir = path.join(__dirname, "..", "data");

function readJsonFile(filename: string) {
  try {
    const fileContent = fs.readFileSync(path.join(dataDir, filename), "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    process.exit(1);
  }
}

const countriesData = readJsonFile("countries.json");
const citiesData = readJsonFile("cities.json");
const costBasketsData = readJsonFile("cost_baskets.json");

// 3. Validation
console.log("Validating data files...");

try {
  z.array(CountrySchema).parse(countriesData);
  console.log("✅ countries.json is valid.");

  z.array(CitySchema).parse(citiesData);
  console.log("✅ cities.json is valid.");

  CostBasketsSchema.parse(costBasketsData);
  console.log("✅ cost_baskets.json is valid.");
} catch (error: any) {
  if (error && error.errors) {
    console.error("❌ Validation Failed:");
    console.error(JSON.stringify(error.errors, null, 2));
  } else {
    console.error("❌ Unexpected Error:", error);
  }
  process.exit(1); // Fail the build
}

console.log("All data files validated successfully.");
