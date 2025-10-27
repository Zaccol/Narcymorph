import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async sendMessage(userId: string, content: string) {
    // Save user message
    const userMessage = await this.prisma.message.create({
      data: {
        userId,
        content,
        role: 'user',
      },
    });

    // Get conversation history
    const history = await this.prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Get user profile for context
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    // Generate AI response
    const aiResponse = await this.aiService.chatWithUser(
      {
        personalityType: profile?.personalityType,
        personalityAnalysis: profile?.personalityAnalysis,
        currentProfile: profile as any,
      },
      content,
      history.reverse(),
    );

    // Save AI response
    const assistantMessage = await this.prisma.message.create({
      data: {
        userId,
        content: aiResponse.message,
        role: 'assistant',
        context: aiResponse.insights as any,
      },
    });

    return {
      userMessage,
      assistantMessage,
      insights: aiResponse.insights,
    };
  }

  async getMessages(userId: string, limit = 50) {
    return this.prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  async clearHistory(userId: string) {
    await this.prisma.message.deleteMany({
      where: { userId },
    });

    return { message: 'Chat history cleared' };
  }
}
