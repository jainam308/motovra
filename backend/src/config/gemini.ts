import dotenv from 'dotenv';
dotenv.config();

export const getGeminiApiKey = (): string => {
  return process.env.GEMINI_API_KEY || '';
};

export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
