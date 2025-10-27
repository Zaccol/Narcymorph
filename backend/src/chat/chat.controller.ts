import { Controller, Post, Get, Delete, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('message')
  @ApiOperation({ summary: 'Send a message to AI' })
  @ApiResponse({ status: 201, description: 'Message sent' })
  async sendMessage(@Request() req, @Body('content') content: string) {
    return this.chatService.sendMessage(req.user.id, content);
  }

  @Get('messages')
  @ApiOperation({ summary: 'Get chat history' })
  @ApiResponse({ status: 200, description: 'Messages retrieved' })
  async getMessages(@Request() req, @Query('limit') limit?: number) {
    return this.chatService.getMessages(req.user.id, limit);
  }

  @Delete('messages')
  @ApiOperation({ summary: 'Clear chat history' })
  @ApiResponse({ status: 200, description: 'History cleared' })
  async clearHistory(@Request() req) {
    return this.chatService.clearHistory(req.user.id);
  }
}
