import { calculateMarketSimilarity } from '../similarity.service';

describe('Similarity Service (Deterministic Engine)', () => {
  it('should find top 5 comparable vehicles and calculate correct price metrics for Porsche 911 GT3 RS', () => {
    const targetVehicle = {
      id: 'test-porsche-1',
      make: 'Porsche',
      model: '911 GT3 RS',
      category: 'SPORTS',
      price: 223800,
    };

    const result = calculateMarketSimilarity(targetVehicle);

    expect(result).toBeDefined();
    expect(result.comparableVehicles.length).toBeLessThanOrEqual(5);
    expect(result.lowestMarketPrice).toBeGreaterThan(0);
    expect(result.highestMarketPrice).toBeGreaterThanOrEqual(result.lowestMarketPrice);
    expect(result.estimatedMarketPrice).toBeGreaterThanOrEqual(result.lowestMarketPrice);
    expect(result.estimatedMarketPrice).toBeLessThanOrEqual(result.highestMarketPrice);
    expect(result.confidenceScore).toBeGreaterThanOrEqual(60);
    expect(result.confidenceScore).toBeLessThanOrEqual(95);

    // Porsche 911 GT3 RS at $223,800 is below the average (~$233,000), so it should classify as EXCELLENT_DEAL or FAIR_DEAL
    expect(['EXCELLENT_DEAL', 'FAIR_DEAL']).toContain(result.recommendation);
  });

  it('should classify overpriced vehicle correctly as SLIGHTLY_OVERPRICED or PREMIUM_PRICING', () => {
    const overpricedVehicle = {
      id: 'test-overpriced-1',
      make: 'Porsche',
      model: '911 GT3 RS',
      category: 'SPORTS',
      price: 320000,
    };

    const result = calculateMarketSimilarity(overpricedVehicle);

    expect(['SLIGHTLY_OVERPRICED', 'PREMIUM_PRICING']).toContain(result.recommendation);
  });

  it('should handle vehicles with no exact model match by falling back to category matches', () => {
    const rareVehicle = {
      id: 'test-rare-1',
      make: 'Pagani',
      model: 'Zonda HP Barchetta',
      category: 'SPORTS',
      price: 1500000,
    };

    const result = calculateMarketSimilarity(rareVehicle);

    expect(result.comparableVehicles.length).toBeGreaterThan(0);
    expect(result.confidenceScore).toBeGreaterThan(0);
    expect(result.recommendation).toBeDefined();
  });
});
