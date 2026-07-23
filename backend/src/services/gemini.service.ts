import { getGeminiApiKey, GEMINI_API_URL } from '../config/gemini';
import { parseGeminiAnalysisResponse, ParsedAiNarrative } from '../utils/promptBuilder';

export async function generateAiNarrative(promptText: string): Promise<ParsedAiNarrative> {
  const groqApiKey = process.env.GROQ_API_KEY;
  const geminiApiKey = getGeminiApiKey();

  // 1. Try Groq API (LLaMA 3.3 70B - Ultra Fast & Reliable)
  if (groqApiKey) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a senior automotive market analyst. Return valid JSON only.',
            },
            {
              role: 'user',
              content: promptText,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
          max_tokens: 800,
        }),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data: any = await response.json();
        const contentText = data?.choices?.[0]?.message?.content || '';
        console.log('[AIService] Successfully generated live market analysis using Groq (LLaMA 3.3 70B)!');
        return parseGeminiAnalysisResponse(contentText);
      } else {
        console.warn(`[AIService] Groq API returned HTTP ${response.status}. Falling back to Gemini/Statistical engine.`);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('[AIService] Groq API call error or timeout:', err.message || err);
    }
  }

  // 2. Fallback to Gemini API
  if (geminiApiKey) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': geminiApiKey,
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 800,
            responseMimeType: 'application/json',
          },
        }),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data: any = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        console.log('[AIService] Successfully generated live market analysis using Gemini API!');
        return parseGeminiAnalysisResponse(candidateText);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('[AIService] Gemini API error:', err.message || err);
    }
  }

  // 3. Fallback to Deterministic Statistical Engine
  console.log('[AIService] Using deterministic statistical benchmark narrative engine.');
  return parseGeminiAnalysisResponse('');
}
