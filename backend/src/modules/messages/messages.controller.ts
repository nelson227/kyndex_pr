import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessagesService } from './messages.service';

@ApiTags('Messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('users')
  @ApiResponse({
    status: 200,
    description: 'Get all available users for messaging (excluding current user)',
  })
  async getAvailableUsers(@CurrentUser() user: any) {
    return this.messagesService.getAvailableUsers(user.id);
  }

  @Get('conversations')
  @ApiResponse({
    status: 200,
    description: 'Get all conversations for current user',
  })
  async getConversations(@CurrentUser() user: any) {
    return this.messagesService.getConversations(user.id);
  }

  @Get('conversations/:conversationId')
  @ApiResponse({
    status: 200,
    description: 'Get specific conversation with messages',
  })
  async getConversation(
    @CurrentUser() user: any,
    @Param('conversationId') conversationId: string,
  ) {
    return this.messagesService.getConversation(user.id, conversationId);
  }

  @Post('conversations')
  @ApiResponse({
    status: 200,
    description: 'Create or get existing conversation with a user',
  })
  async createConversation(
    @CurrentUser() user: any,
    @Body() data: { otherUserId: string },
  ) {
    if (!data.otherUserId) {
      throw new BadRequestException('otherUserId is required');
    }
    return this.messagesService.createOrGetConversation(
      user.id,
      data.otherUserId,
    );
  }

  @Post('conversations/:conversationId/messages')
  @ApiResponse({
    status: 200,
    description: 'Send a message',
  })
  async sendMessage(
    @CurrentUser() user: any,
    @Param('conversationId') conversationId: string,
    @Body() data: { content: string },
  ) {
    if (!data.content) {
      throw new BadRequestException('content is required');
    }
    return this.messagesService.sendMessage(user.id, conversationId, data.content);
  }
}
