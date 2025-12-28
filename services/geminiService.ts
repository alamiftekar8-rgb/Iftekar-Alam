
import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing. AI features will use mock responses.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAiBio = async (interests: string, policeStation: string, name: string): Promise<string> => {
  const ai = getAiClient();
  
  if (!ai) {
    return `Hi, I'm ${name} from ${policeStation}. I like ${interests}. (AI Key missing)`;
  }

  try {
    // Using gemini-3-flash-preview for basic text tasks as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a short, witty, and friendly dating app bio (max 150 chars) for someone named ${name} living in ${policeStation}, Malda district, West Bengal. Their interests are: ${interests}. Include a local reference if possible (like mangoes, local rivers, or culture). Don't use hashtags.`,
    });
    return response.text || "Ready to mingle in Malda!";
  } catch (error) {
    console.error("Gemini Bio Error:", error);
    return "Loves long walks and fresh mangoes.";
  }
};

export const generateIcebreaker = async (): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "What's your favorite place in Malda?";

  try {
    // Using gemini-3-flash-preview for basic text tasks as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a single, fun, casual question to start a conversation with a stranger in Malda, West Bengal. Keep it short.",
    });
    return response.text || "How's the weather today?";
  } catch (error) {
    return "Do you like Himsagar or Langra mangoes better?";
  }
};
