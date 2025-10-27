import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class AssociationsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async discoverAssociation(userId: string, category: string, subcategory?: string) {
    // Get user's personality profile
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile || !profile.personalityType) {
      throw new NotFoundException('Please complete personality analysis first');
    }

    // Check if association already exists
    const existing = await this.prisma.association.findFirst({
      where: {
        profileId: profile.id,
        category,
        subcategory: subcategory || null,
      },
    });

    if (existing) {
      return existing;
    }

    // Generate association using AI
    const associationData = await this.aiService.generateAssociation(
      {
        personalityType: profile.personalityType,
        personalityAnalysis: profile.personalityAnalysis || '',
        dominantTraits: profile.dominantTraits as any,
        coreValues: profile.coreValues as any,
      },
      category,
      subcategory,
    );

    // Save association
    const association = await this.prisma.association.create({
      data: {
        profileId: profile.id,
        category,
        subcategory,
        result: associationData.result,
        confidence: associationData.confidence,
        explanation: associationData.explanation,
        metadata: associationData.metadata as any,
      },
    });

    // Update completion percentage
    const associationsCount = await this.prisma.association.count({
      where: { profileId: profile.id },
    });

    await this.prisma.profile.update({
      where: { id: profile.id },
      data: {
        completionPercentage: Math.min(60 + associationsCount * 5, 100),
      },
    });

    return association;
  }

  async getAssociations(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        associations: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile.associations;
  }

  async getAssociationsByCategory(userId: string, category: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.association.findMany({
      where: {
        profileId: profile.id,
        category,
      },
    });
  }
}
