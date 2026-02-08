import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateContractClause = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Rédige une clause légale courte, professionnelle et claire pour un contrat de service DJ/Événementiel au Québec.
      Le sujet de la clause est : "${topic}".
      Le ton doit être formel mais compréhensible. Limite-toi à un paragraphe.`,
    });
    
    return response.text || "Impossible de générer la clause pour le moment.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Erreur lors de la génération de la clause. Veuillez vérifier votre connexion.";
  }
};
