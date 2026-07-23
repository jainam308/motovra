import api from '../api/axios';

export const regenerateAiMarketAnalysis = async (vehicleId: string) => {
  const { data } = await api.post(`/ai-market-analysis/${vehicleId}`);
  return data;
};
