import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PersonalityService } from './personality.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('personality')
@Controller('personality')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PersonalityController {
  constructor(private personalityService: PersonalityService) {}

  @Post('quiz')
  @ApiOperation({ summary: 'Submit personality quiz responses' })
  @ApiResponse({ status: 201, description: 'Quiz submitted successfully' })
  async submitQuiz(@Request() req: any, @Body() quizResponses: any) {
    return this.personalityService.submitQuiz(req.user.id, quizResponses);
  }

  @Post('analyze')
  @ApiOperation({ summary: 'Trigger AI personality analysis' })
  @ApiResponse({ status: 200, description: 'Analysis completed' })
  async analyzePersonality(@Request() req: any) {
    return this.personalityService.analyzePersonality(req.user.id);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get personality profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved' })
  async getProfile(@Request() req: any) {
    return this.personalityService.getPersonalityProfile(req.user.id);
  }
}
