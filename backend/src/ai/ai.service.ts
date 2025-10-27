import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private readonly logger = new Logger(AiService.name);

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
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

Réponds UNIQUEMENT en JSON avec cette structure:
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
}`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.configService.get<string>('OPENAI_MODEL', 'gpt-4-turbo-preview'),
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(completion.choices[0].message.content);
      return result;
    } catch (error) {
      this.logger.error('Error analyzing personality:', error);
      throw error;
    }
  }

  async generateAssociation(profile: any, category: string, subcategory?: string) {
    let prompt = '';

    if (category === 'animal') {
      prompt = `Basé sur ce profil: ${profile.personalityType}, trouve l'animal totem correspondant.

Réponds en JSON:
{
  "result": "Nom de l'animal",
  "confidence": 85,
  "explanation": "Explication de 150 mots",
  "metadata": {"emoji": "🦅"}
}`;
    } else if (category === 'color') {
      prompt = `Basé sur ce profil: ${profile.personalityType}, trouve la couleur correspondante.

Réponds en JSON:
{
  "result": "Nom de la couleur",
  "confidence": 90,
  "explanation": "Explication de 150 mots",
  "metadata": {"hex": "#FF5733"}
}`;
    } else if (category === 'anime' && subcategory === 'naruto') {
      prompt = `Basé sur ce profil: ${profile.personalityType}, trouve le personnage Naruto correspondant.

Réponds en JSON:
{
  "result": "Nom du personnage",
  "confidence": 88,
  "explanation": "Explication de 200 mots",
  "metadata": {"village": "Konoha", "quote": "Citation"}
}`;
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.configService.get<string>('OPENAI_MODEL_CHEAP', 'gpt-3.5-turbo'),
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      this.logger.error('Error generating association:', error);
      throw error;
    }
  }

  async chatWithUser(profile: any, userMessage: string, history: any[]) {
    const systemPrompt = `Tu es Narcymorph, une IA bienveillante spécialisée dans l'analyse de personnalité.

Profil de l'utilisateur: ${profile.personalityType || 'Non analysé'}

Ton rôle:
- Converser pour approfondir la compréhension de sa personnalité
- Poser UNE question à la fois
- Être empathique et sans jugement
- Détecter des insights importants`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: userMessage },
    ];

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.configService.get<string>('OPENAI_MODEL_CHEAP', 'gpt-3.5-turbo'),
        messages,
        temperature: 0.8,
        max_tokens: 500,
      });

      return {
        message: completion.choices[0].message.content,
        insights: [], // Could extract insights from conversation
      };
    } catch (error) {
      this.logger.error('Error in chat:', error);
      throw error;
    }
  }
}
