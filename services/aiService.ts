import { GoogleGenAI } from "@google/genai";
import { EventData } from "../types";

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

export interface EmailDraft {
  subject: string;
  body: string;
}

export const generateContractEmail = async (event: EventData): Promise<EmailDraft> => {
  try {
    const prompt = `
      Rédige un courriel professionnel et amical en français pour un client concernant un contrat d'événement.
      Le ton doit être courtois et clair.
      Le but est d'informer le client que son contrat est prêt et de l'inviter à le signer.

      Voici les informations sur l'événement :
      - Nom du client : ${event.client.name}
      - Titre de l'événement : ${event.title}
      - Date de l'événement : ${new Date(event.date).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
      - Montant total du contrat : ${event.contract?.amount} $
      - Dépôt requis : ${event.contract?.deposit} $

      Le courriel doit inclure :
      1. Un objet clair et concis.
      2. Une salutation personnalisée.
      3. Une mention de l'événement et de la date.
      4. L'information que le contrat est en pièce jointe (ou via un lien, mentionne simplement qu'il est prêt).
      5. Une invitation à réviser et signer le contrat.
      6. Une mention du montant total et du dépôt.
      7. Une formule de politesse pour conclure.
      
      Retourne la réponse sous forme d'un objet JSON avec les clés "subject" et "body".
      Ne pas inclure les backticks de formatage (comme \`\`\`json) autour du JSON.
      Exemple de format de retour :
      {
        "subject": "Votre contrat pour l'événement...",
        "body": "Bonjour [Nom du client],\\n\\n..."
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    const text = response.text?.trim() ?? '{}';
    let cleanText = text;
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.slice(7, -3).trim();
    } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.slice(3, -3).trim();
    }
    
    try {
        const jsonResponse = JSON.parse(cleanText);
        return {
            subject: jsonResponse.subject || "Votre contrat est prêt",
            body: jsonResponse.body || "Impossible de générer le corps de l'e-mail."
        };
    } catch (e) {
        console.error("AI Error: Failed to parse JSON response.", cleanText);
        return {
            subject: "Votre contrat est prêt",
            body: `Nous n'avons pas pu générer l'e-mail automatiquement, mais vous pouvez informer le client que son contrat pour "${event.title}" est prêt.`,
        };
    }

  } catch (error) {
    console.error("AI Error:", error);
    return {
      subject: "Erreur de génération",
      body: "Une erreur est survenue lors de la génération du courriel. Veuillez réessayer.",
    };
  }
};
