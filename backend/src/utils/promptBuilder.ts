export interface ParsedAiNarrative {
  summary: string;
  strengths: string[];
  concerns: string[];
  buyerAdvice: string;
}

export function buildMarketAnalysisPrompt(vehicle: any, stats: any): string {
  const targetPrice = Number(vehicle.price);
  const estPrice = Number(stats.estimatedMarketPrice);
  const priceDiff = targetPrice - estPrice;
  const priceDiffPercent = ((priceDiff / (estPrice || 1)) * 100).toFixed(1);

  return `
You are a senior luxury automotive market analyst for Motovra Exotics.
Analyze this vehicle listing against the provided statistical baseline and regional marketplace listings:

TARGET VEHICLE DETAILS:
- Make: ${vehicle.make}
- Model: ${vehicle.model}
- Category: ${vehicle.category}
- Current Listing Price: $${targetPrice.toLocaleString()}

STATISTICAL MARKET BASELINE:
- Market Range: $${Number(stats.lowestMarketPrice).toLocaleString()} - $${Number(stats.highestMarketPrice).toLocaleString()}
- Average Estimated Market Value: $${estPrice.toLocaleString()}
- Calculated Price Variance: ${priceDiff >= 0 ? '+' : ''}${priceDiffPercent}% ($${priceDiff.toLocaleString()})
- Algorithm Deal Classification: ${stats.recommendation}
- Statistical Confidence Score: ${stats.confidenceScore}%

TOP COMPARABLE MARKET LISTINGS:
${JSON.stringify(stats.comparableVehicles, null, 2)}

INSTRUCTIONS:
1. Provide a concise 2-sentence executive summary evaluating this listing's value position.
2. List exactly 3 specific key strengths of this vehicle and pricing.
3. List 1 to 2 potential buyer considerations or maintenance/depreciation concerns.
4. Provide actionable buyer advice for negotiating or acquiring this vehicle.

CRITICAL REQUIREMENT:
You MUST respond with valid JSON ONLY. Do NOT include markdown blocks, code formatting, or explanatory text outside the JSON object.
Use this exact JSON schema:
{
  "summary": "...",
  "strengths": ["...", "...", "..."],
  "concerns": ["..."],
  "buyerAdvice": "..."
}
`.trim();
}

export function parseGeminiAnalysisResponse(rawText: string): ParsedAiNarrative {
  if (!rawText || typeof rawText !== 'string') {
    return getDefaultFallbackNarrative();
  }

  try {
    // Clean markdown code blocks if present
    let cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    // Regex extract outer JSON object if extra text exists
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      cleaned = match[0];
    }

    const parsed = JSON.parse(cleaned);

    return {
      summary: typeof parsed.summary === 'string' ? parsed.summary : 'Market evaluation completed based on current pricing data.',
      strengths: Array.isArray(parsed.strengths) && parsed.strengths.length > 0
        ? parsed.strengths.map((s: any) => String(s))
        : ['Competitive market pricing', 'Motovra verified provenance', 'High liquidity retention'],
      concerns: Array.isArray(parsed.concerns)
        ? parsed.concerns.map((c: any) => String(c))
        : ['High-performance maintenance recommended'],
      buyerAdvice: typeof parsed.buyerAdvice === 'string' ? parsed.buyerAdvice : 'Inspect vehicle records and verify delivery terms before purchase.',
    };
  } catch (err) {
    return getDefaultFallbackNarrative();
  }
}

function getDefaultFallbackNarrative(): ParsedAiNarrative {
  return {
    summary: 'Automated market valuation based on regional luxury dealership listings and auction benchmark statistics.',
    strengths: [
      'Priced relative to comparable market listings',
      'Motovra certified white-glove delivery included',
      'Verified ownership history',
    ],
    concerns: [
      'High-performance luxury vehicles require regular specialized service',
    ],
    buyerAdvice: 'Review comparable market listings and consult our concierge team for custom financing options.',
  };
}
