import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private readonly logger = new Logger(AiService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async analyzePersonality(data: {
    personalityType: string;
    quizResponses: any;
    scores: any;
  }) {
    const prompt = `Tu es un psychologue expert spécialisé dans l'analyse de personnalité.

DONNÉES DU PROFIL:
- Type MBTI: ${data.personalityType}
- Scores:
  - Extraversion/Introversion: ${data.scores.E_I}/30
  - Intuition/Sensing: ${data.scores.N_S}/30
  - Thinking/Feeling: ${data.scores.T_F}/25
  - Judging/Perceiving: ${data.scores.J_P}/25
  - Intelligence émotionnelle: ${data.scores.EQ}/15
  - Assertivité: ${data.scores.assertiveness}/5

Crée un profil psychologique complet et nuancé.

Réponds UNIQUEMENT en JSON valide avec cette structure exacte:
{
  "personalityType": "${data.personalityType}",
  "title": "Le [Surnom du type]",
  "summary": "Description générale en 2-3 phrases",
  "detailedAnalysis": "Analyse approfondie de 400 mots",
  "dominantTraits": [
    {"name": "Trait", "score": 85, "description": "Explication"}
  ],
  "strengths": [
    {"name": "Force", "description": "Comment l'utiliser"}
  ],
  "growthAreas": [
    {"area": "Zone", "suggestion": "Conseil"}
  ],
  "coreValues": ["Valeur1", "Valeur2"],
  "communicationStyle": "Description",
  "relationshipPreferences": "Description"
}

IMPORTANT: Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Nettoyer le texte pour extraire le JSON
      let jsonText = text.trim();

      // Enlever les balises markdown si présentes
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

      // Parser le JSON
      const parsed = JSON.parse(jsonText);
      return parsed;
    } catch (error) {
      this.logger.error('Error analyzing personality with Gemini:', error);

      // Fallback en cas d'erreur
      return {
        personalityType: data.personalityType,
        title: 'Profil en Cours d\'Analyse',
        summary: 'Votre analyse de personnalité est en cours de traitement.',
        detailedAnalysis: 'Nous analysons vos réponses pour créer votre profil personnalisé.',
        dominantTraits: [
          { name: 'En cours...', score: 50, description: 'Analyse en cours' }
        ],
        strengths: [
          { name: 'À venir', description: 'Analyse en cours' }
        ],
        growthAreas: [
          { area: 'À venir', suggestion: 'Analyse en cours' }
        ],
        coreValues: ['Authenticité', 'Croissance'],
        communicationStyle: 'En cours d\'analyse',
        relationshipPreferences: 'En cours d\'analyse'
      };
    }
  }

  async generateAssociation(profile: any, category: string, subcategory?: string) {
    let prompt = '';

    if (category === 'animal') {
      prompt = `Basé sur ce profil de personnalité: ${profile.personalityType}

Traits dominants: ${JSON.stringify(profile.dominantTraits || [])}
Valeurs: ${JSON.stringify(profile.coreValues || [])}

Trouve l'animal totem qui correspond le mieux à cette personnalité.

Réponds UNIQUEMENT en JSON valide:
{
  "result": "Nom de l'animal",
  "confidence": 85,
  "explanation": "Explication détaillée de 150 mots sur pourquoi cet animal correspond",
  "metadata": {"emoji": "🦅"}
}

IMPORTANT: Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.`;
    } else if (category === 'color') {
      prompt = `Basé sur ce profil: ${profile.personalityType}

Traits dominants: ${JSON.stringify(profile.dominantTraits || [])}

Trouve la couleur qui représente le mieux cette personnalité.

Réponds UNIQUEMENT en JSON valide:
{
  "result": "Nom de la couleur",
  "confidence": 90,
  "explanation": "Explication de 150 mots sur la signification de cette couleur pour cette personne",
  "metadata": {"hex": "#FF5733"}
}

IMPORTANT: Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.`;
    } else if (category === 'element') {
      prompt = `Basé sur ce profil: ${profile.personalityType}

Détermine l'élément naturel (Feu, Eau, Terre, Air) qui correspond.

Réponds UNIQUEMENT en JSON valide:
{
  "result": "Nom de l'élément",
  "confidence": 88,
  "explanation": "Explication de 150 mots",
  "metadata": {"symbol": "🔥"}
}

IMPORTANT: Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.`;
    } else if (category === 'anime' && subcategory === 'naruto') {
      prompt = `Basé sur ce profil: ${profile.personalityType}

Traits: ${JSON.stringify(profile.dominantTraits || [])}
Valeurs: ${JSON.stringify(profile.coreValues || [])}

Trouve le personnage de Naruto qui correspond le mieux.
Personnages disponibles: Naruto Uzumaki, Sasuke Uchiha, Sakura Haruno, Kakashi Hatake, Shikamaru Nara, Rock Lee, Gaara, Itachi Uchiha, Hinata Hyuga, Jiraiya, Tsunade.

Réponds UNIQUEMENT en JSON valide:
{
  "result": "Nom du personnage",
  "confidence": 88,
  "explanation": "Explication détaillée de 200 mots sur pourquoi ce personnage correspond",
  "metadata": {"village": "Konoha", "quote": "Citation du personnage"}
}

IMPORTANT: Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.`;
    } else if (category === 'anime' && subcategory === 'harry-potter') {
      prompt = `Basé sur ce profil: ${profile.personalityType}

Valeurs: ${JSON.stringify(profile.coreValues || [])}

Détermine la maison de Poudlard (Gryffondor, Serpentard, Serdaigle, Poufsouffle).

Réponds UNIQUEMENT en JSON valide:
{
  "result": "Nom de la maison",
  "confidence": 90,
  "explanation": "Discours du Choixpeau de 150 mots expliquant le choix",
  "metadata": {"colors": ["rouge", "or"], "founder": "Godric Gryffondor"}
}

IMPORTANT: Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.`;
    } else {
      // Association générique
      prompt = `Basé sur ce profil: ${profile.personalityType}

Catégorie: ${category}
Sous-catégorie: ${subcategory || 'Aucune'}

Trouve l'association correspondante.

Réponds UNIQUEMENT en JSON valide:
{
  "result": "Résultat",
  "confidence": 85,
  "explanation": "Explication de 150 mots",
  "metadata": {}
}

IMPORTANT: Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.`;
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();

      // Nettoyer le texte
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');

      return JSON.parse(text);
    } catch (error) {
      this.logger.error('Error generating association with Gemini:', error);

      // Fallback
      return {
        result: 'En cours...',
        confidence: 50,
        explanation: 'Analyse en cours de traitement.',
        metadata: {}
      };
    }
  }

  async chatWithUser(profile: any, userMessage: string, history: any[]) {
    const systemContext = `Tu es Narcymorph, une IA bienveillante spécialisée dans l'analyse de personnalité.

Profil de l'utilisateur: ${profile.personalityType || 'Non analysé'}

Ton rôle:
- Converser pour approfondir la compréhension de sa personnalité
- Poser UNE question à la fois, claire et ouverte
- Être empathique et sans jugement
- Détecter des insights importants

Contexte de la conversation:`;

    // Construire le contexte de conversation
    let conversationContext = systemContext + '\n\n';

    // Ajouter les derniers messages (max 5 pour ne pas dépasser les limites)
    const recentHistory = history.slice(-5);
    recentHistory.forEach((msg) => {
      conversationContext += `${msg.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${msg.content}\n`;
    });

    conversationContext += `\nUtilisateur: ${userMessage}\n\nAssistant:`;

    try {
      const result = await this.model.generateContent(conversationContext);
      const response = await result.response;
      const text = response.text();

      return {
        message: text,
        insights: [], // Pourrait être enrichi avec une analyse séparée
      };
    } catch (error) {
      this.logger.error('Error in chat with Gemini:', error);

      return {
        message: 'Je suis désolé, j\'ai rencontré un problème. Pouvez-vous reformuler votre question ?',
        insights: [],
      };
    }
  }
}
