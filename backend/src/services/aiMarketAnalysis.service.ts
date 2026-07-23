import { PrismaClient } from '@prisma/client';
import { calculateMarketSimilarity } from './similarity.service';
import { buildMarketAnalysisPrompt } from '../utils/promptBuilder';
import { generateAiNarrative } from './gemini.service';
import { NotFoundError } from '../common/errors/NotFoundError';

const prisma = new PrismaClient();

export async function generateAndStoreMarketAnalysis(vehicleId: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  });

  if (!vehicle) {
    throw new NotFoundError('Vehicle not found');
  }

  // 1. Calculate deterministic similarity & pricing statistics
  const similarityStats = calculateMarketSimilarity({
    id: vehicle.id,
    make: vehicle.make,
    model: vehicle.model,
    category: vehicle.category,
    price: Number(vehicle.price),
  });

  // 2. Build structured JSON prompt
  const promptText = buildMarketAnalysisPrompt(vehicle, similarityStats);

  // 3. Generate AI narrative from Gemini (with deterministic fallback safety)
  const aiNarrative = await generateAiNarrative(promptText);

  // 4. Update vehicle record in PostgreSQL database
  const updatedVehicle = await prisma.vehicle.update({
    where: { id: vehicleId },
    data: {
      estimatedMarketPrice: similarityStats.estimatedMarketPrice,
      lowestMarketPrice: similarityStats.lowestMarketPrice,
      highestMarketPrice: similarityStats.highestMarketPrice,
      confidenceScore: similarityStats.confidenceScore,
      recommendation: similarityStats.recommendation,
      summary: aiNarrative.summary,
      strengths: aiNarrative.strengths,
      concerns: aiNarrative.concerns,
      buyerAdvice: aiNarrative.buyerAdvice,
      comparableVehicles: similarityStats.comparableVehicles as any,
      aiGeneratedAt: new Date(),
    },
  });

  return updatedVehicle;
}
