import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class PersonalityService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async submitQuiz(userId: string, quizResponses: any) {
    // Calculate scores from quiz responses
    const scores = this.calculateScores(quizResponses);

    // Determine personality type
    const personalityType = this.determinePersonalityType(scores);

    // Update profile with quiz data
    const profile = await this.prisma.profile.update({
      where: { userId },
      data: {
        quizResponses,
        quizCompletedAt: new Date(),
        extraversionScore: scores.E_I,
        intuitionScore: scores.N_S,
        thinkingScore: scores.T_F,
        judgingScore: scores.J_P,
        emotionalIntelligenceScore: scores.EQ,
        assertivenessScore: scores.assertiveness,
        personalityType,
        completionPercentage: 40, // Quiz completed
      },
    });

    // Trigger AI analysis in background
    this.analyzePersonality(userId).catch((error) =>
      console.error('Error analyzing personality:', error),
    );

    return {
      personalityType,
      scores,
      message: 'Quiz submitted successfully. AI analysis in progress...',
    };
  }

  async analyzePersonality(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile || !profile.quizResponses) {
      throw new NotFoundException('Quiz not completed');
    }

    // Call AI service for detailed analysis
    const analysis = await this.aiService.analyzePersonality({
      personalityType: profile.personalityType,
      quizResponses: profile.quizResponses as any,
      scores: {
        E_I: profile.extraversionScore,
        N_S: profile.intuitionScore,
        T_F: profile.thinkingScore,
        J_P: profile.judgingScore,
        EQ: profile.emotionalIntelligenceScore,
        assertiveness: profile.assertivenessScore,
      },
    });

    // Update profile with AI analysis
    await this.prisma.profile.update({
      where: { userId },
      data: {
        personalityTitle: analysis.title,
        personalitySummary: analysis.summary,
        personalityAnalysis: analysis.detailedAnalysis,
        dominantTraits: analysis.dominantTraits as any,
        strengths: analysis.strengths as any,
        growthAreas: analysis.growthAreas as any,
        coreValues: analysis.coreValues as any,
        communicationStyle: analysis.communicationStyle,
        relationshipPreferences: analysis.relationshipPreferences,
        lastAnalyzedAt: new Date(),
        completionPercentage: 60, // Analysis completed
      },
    });

    return analysis;
  }

  async getPersonalityProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        associations: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  private calculateScores(quizResponses: any) {
    // Simplified scoring logic - in production, use proper scoring algorithm
    return {
      E_I: 15, // Extraversion/Introversion score (0-30)
      N_S: 20, // Intuition/Sensing score (0-30)
      T_F: 12, // Thinking/Feeling score (0-25)
      J_P: 18, // Judging/Perceiving score (0-25)
      EQ: 10, // Emotional Intelligence (0-15)
      assertiveness: 3, // Assertiveness (0-5)
    };
  }

  private determinePersonalityType(scores: any): string {
    const E_I = scores.E_I > 15 ? 'E' : 'I';
    const N_S = scores.N_S > 15 ? 'N' : 'S';
    const T_F = scores.T_F > 12 ? 'T' : 'F';
    const J_P = scores.J_P > 12 ? 'J' : 'P';

    return `${E_I}${N_S}${T_F}${J_P}`;
  }
}
