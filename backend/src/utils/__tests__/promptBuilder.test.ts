import { buildMarketAnalysisPrompt, parseGeminiAnalysisResponse } from '../promptBuilder';

describe('Prompt Builder & Response Parser', () => {
  it('should construct a structured prompt string containing vehicle specs and similarity statistics', () => {
    const vehicle = {
      make: 'Porsche',
      model: '911 GT3 RS',
      category: 'SPORTS',
      price: 223800,
    };

    const stats = {
      estimatedMarketPrice: 233000,
      lowestMarketPrice: 215000,
      highestMarketPrice: 252000,
      confidenceScore: 92,
      recommendation: 'EXCELLENT_DEAL',
      comparableVehicles: [
        { marketplace: 'ExoticMarketplace US', year: 2023, mileage: 1200, price: 228000, difference: -4200 },
      ],
    };

    const prompt = buildMarketAnalysisPrompt(vehicle, stats);

    expect(prompt).toContain('Porsche');
    expect(prompt.toLowerCase()).toContain('911 gt3 rs');
    expect(prompt).toContain('EXCELLENT_DEAL');
    expect(prompt).toContain('JSON');
  });

  it('should parse valid JSON Gemini response successfully', () => {
    const validJson = JSON.stringify({
      summary: 'This Porsche 911 GT3 RS offers outstanding value.',
      strengths: ['Below market average', 'Highly sought-after spec', 'Low mileage'],
      concerns: ['Aggressive track suspension'],
      buyerAdvice: 'Strong buy recommendation for equity retention.',
    });

    const parsed = parseGeminiAnalysisResponse(validJson);

    expect(parsed.summary).toBe('This Porsche 911 GT3 RS offers outstanding value.');
    expect(parsed.strengths).toHaveLength(3);
    expect(parsed.concerns).toHaveLength(1);
    expect(parsed.buyerAdvice).toContain('Strong buy');
  });

  it('should parse Gemini JSON wrapped inside markdown codeblocks gracefully', () => {
    const markdownWrapped = `\`\`\`json
    {
      "summary": "Excellent luxury deal.",
      "strengths": ["Priced fairly"],
      "concerns": [],
      "buyerAdvice": "Great purchase."
    }
    \`\`\``;

    const parsed = parseGeminiAnalysisResponse(markdownWrapped);

    expect(parsed.summary).toBe('Excellent luxury deal.');
    expect(parsed.strengths).toEqual(['Priced fairly']);
    expect(parsed.buyerAdvice).toBe('Great purchase.');
  });

  it('should return safe fallback narrative if response is completely unparseable', () => {
    const invalidText = 'Sorry, as an AI model I cannot process this request.';

    const parsed = parseGeminiAnalysisResponse(invalidText);

    expect(parsed.summary).toBeDefined();
    expect(parsed.strengths.length).toBeGreaterThan(0);
    expect(parsed.buyerAdvice).toBeDefined();
  });
});
