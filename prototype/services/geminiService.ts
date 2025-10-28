import { GoogleGenAI } from "@google/genai";
import { QuestionnaireAnswers, ChatMessage } from '../types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY as string });

const systemInstructionPortrait = `Tu es Narcymorph, une IA sophistiquée, experte en psychanalyse et en analyse de la personnalité. Ton analyse est professionnelle, structurée et perspicace, similaire au style des descriptions du test MBTI (16 Personalities), mais sans mentionner le MBTI. Tu ne fais aucune allégation médicale. Ta tâche est d'analyser l'image de l'utilisateur et les réponses au questionnaire pour créer un portrait mental. Adresse-toi directement à l'utilisateur en utilisant "vous". Sois encourageant et mets en lumière ses forces. Structure ta réponse en 3 à 4 grands axes de personnalité (Monde Intérieur, Rapport aux Autres, etc.), mais SANS inclure de titre comme "Votre Portrait Mental" dans ta réponse. Le portrait doit être professionnel, en 2-3 paragraphes courts.`;

const systemInstructionAssociation = `Tu es Narcymorph, une IA experte en associations symboliques et en analyse psychologique. En te basant sur le portrait mental de l'utilisateur, tu dois déterminer une association spécifique et fournir un rapport de style psychanalytique.

Instructions de formatage de la réponse (TRÈS IMPORTANT) :
1. Sur la première ligne, écris UNIQUEMENT le nom de l'association (par exemple, "Loup" ou "Gryffondor" ou "Naruto Uzumaki").
2. Laisse une ligne vide.
3. Rédige ensuite une explication précise et professionnelle, comme le ferait un psychanalyste. Décris les axes de personnalité de l'utilisateur qui justifient cette association. Fais des liens profonds entre les symboles de l'association et la psyché de l'individu, sans jamais citer les réponses du questionnaire. L'explication doit faire 2-3 paragraphes.`;

export const systemInstructionChat = `Tu es Narcymorph, une IA conçue pour être un guide introspectif. Ton ton est curieux, empathique et perspicace. Ton objectif principal est d'apprendre à connaître l'utilisateur plus en profondeur en posant des questions ouvertes sur ses pensées, ses sentiments et ses expériences. Utilise ces informations pour aider l'utilisateur à mieux se comprendre. Tes réponses doivent être concises et engageantes pour encourager une conversation fluide. Ne révèle pas que tu es une IA à moins d'y être directement invité. Commence la conversation en te présentant brièvement et en posant une première question pour lancer la discussion.`;


const formatChatHistoryForPrompt = (chatHistory: ChatMessage[]): string => {
    if (!chatHistory || chatHistory.length === 0) return "";
    const historyText = chatHistory.map(msg => `${msg.sender === 'user' ? 'Utilisateur' : 'Narcymorph'}: ${msg.text}`).join('\n');
    return `\n\nPrends également en compte cet historique de conversation pour affiner ton analyse:\n${historyText}`;
};

export const generateMentalPortrait = async (
  photoBase64: string,
  photoMimeType: string,
  answers: QuestionnaireAnswers,
  chatHistory?: ChatMessage[]
): Promise<string> => {
  try {
    const chatHistoryPrompt = formatChatHistoryForPrompt(chatHistory || []);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { mimeType: photoMimeType, data: photoBase64 } },
                { text: `Analyse l'utilisateur en fonction de cette image et de ses réponses au questionnaire suivant. Crée un 'Portrait Mental' complet. \n\nRéponses:\n${JSON.stringify(answers, null, 2)}${chatHistoryPrompt}` }
            ]
        },
        config: {
            systemInstruction: systemInstructionPortrait
        }
    });
    return response.text;
  } catch (error) {
    console.error("Erreur lors de la génération du portrait mental:", error);
    throw new Error("Impossible de générer le portrait mental. L'IA subit peut-être un trafic élevé.");
  }
};

export const generateAssociation = async (
  portrait: string,
  associationType: string,
  chatHistory?: ChatMessage[]
): Promise<string> => {
  try {
    const chatHistoryPrompt = formatChatHistoryForPrompt(chatHistory || []);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `En se basant sur le portrait mental suivant, détermine le/la ${associationType} de l'utilisateur. ${chatHistoryPrompt}\n\nPortrait:\n${portrait}`,
        config: {
            systemInstruction: systemInstructionAssociation
        }
    });
    return response.text;
  } catch (error) {
    console.error("Erreur lors de la génération de l'association:", error);
    throw new Error("Impossible de générer l'association. Veuillez réessayer.");
  }
};
