import { Request, Response, NextFunction } from 'express';
import { generateAndStoreMarketAnalysis } from '../../services/aiMarketAnalysis.service';

export const regenerateAiMarketAnalysis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vehicleId } = req.params;
    const updatedVehicle = await generateAndStoreMarketAnalysis(vehicleId);
    res.status(200).json({
      message: 'AI Market Intelligence analysis generated and saved successfully.',
      data: updatedVehicle,
    });
  } catch (error) {
    next(error);
  }
};
