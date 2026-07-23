import marketVehicles from '../data/marketVehicles.json';

export interface TargetVehicleInput {
  id?: string;
  make: string;
  model: string;
  category: string;
  price: number | string;
}

export interface ComparableVehicleMatch {
  marketplace: string;
  year: number;
  mileage: number;
  price: number;
  difference: number;
}

export interface SimilarityResult {
  estimatedMarketPrice: number;
  lowestMarketPrice: number;
  highestMarketPrice: number;
  confidenceScore: number;
  recommendation: 'EXCELLENT_DEAL' | 'FAIR_DEAL' | 'SLIGHTLY_OVERPRICED' | 'PREMIUM_PRICING';
  comparableVehicles: ComparableVehicleMatch[];
}

export function calculateMarketSimilarity(target: TargetVehicleInput): SimilarityResult {
  const targetPrice = typeof target.price === 'string' ? parseFloat(target.price) : Number(target.price);
  const targetMake = target.make.trim().toLowerCase();
  const targetModel = target.model.trim().toLowerCase();
  const targetCategory = target.category.trim().toLowerCase();

  // 1. Primary Filter: Exact / Substring Brand & Model Match
  let matches = marketVehicles.filter(v => {
    const brandMatch = v.brand.toLowerCase().includes(targetMake) || targetMake.includes(v.brand.toLowerCase());
    const modelMatch = v.model.toLowerCase().includes(targetModel) || targetModel.includes(v.model.toLowerCase());
    return brandMatch && modelMatch;
  });

  // 2. Secondary Fallback: Brand Match
  if (matches.length < 3) {
    const brandMatches = marketVehicles.filter(v => 
      v.brand.toLowerCase().includes(targetMake) || targetMake.includes(v.brand.toLowerCase())
    );
    if (brandMatches.length > 0) {
      matches = brandMatches;
    }
  }

  // 3. Tertiary Fallback: Category Match
  if (matches.length === 0) {
    matches = marketVehicles;
  }

  // Rank matches by price closeness
  const sortedMatches = [...matches].sort((a, b) => {
    const diffA = Math.abs(a.price - targetPrice);
    const diffB = Math.abs(b.price - targetPrice);
    return diffA - diffB;
  });

  const topMatches = sortedMatches.slice(0, 5);

  const prices = topMatches.map(m => m.price);
  const lowestMarketPrice = Math.min(...prices);
  const highestMarketPrice = Math.max(...prices);
  const averagePrice = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length);
  const estimatedMarketPrice = averagePrice;

  // Calculate Confidence Score
  const confidenceScore = Math.min(95, Math.max(60, 60 + topMatches.length * 7));

  // Determine Deal Recommendation
  const ratio = targetPrice / (estimatedMarketPrice || 1);
  let recommendation: 'EXCELLENT_DEAL' | 'FAIR_DEAL' | 'SLIGHTLY_OVERPRICED' | 'PREMIUM_PRICING';

  if (ratio <= 0.96) {
    recommendation = 'EXCELLENT_DEAL';
  } else if (ratio <= 1.04) {
    recommendation = 'FAIR_DEAL';
  } else if (ratio <= 1.12) {
    recommendation = 'SLIGHTLY_OVERPRICED';
  } else {
    recommendation = 'PREMIUM_PRICING';
  }

  const comparableVehicles: ComparableVehicleMatch[] = topMatches.map(m => ({
    marketplace: m.marketplace,
    year: m.year,
    mileage: m.mileage,
    price: m.price,
    difference: Math.round(targetPrice - m.price),
  }));

  return {
    estimatedMarketPrice,
    lowestMarketPrice,
    highestMarketPrice,
    confidenceScore,
    recommendation,
    comparableVehicles,
  };
}
