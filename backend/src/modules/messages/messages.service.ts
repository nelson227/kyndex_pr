import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getAvailableUsers(userId: string) {
    const users = await this.prisma.user.findMany({
      where: {
        id: { not: userId }, // Exclude current user
      },
      select: {
        id: true,
        email: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users;
  }

  async getConversations(userId: string) {
    const conversations = await (this.prisma as any).conversation.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations.map((conv: any) => ({
      id: conv.id,
      title: conv.title,
      participants: conv.participants,
      lastMessage: conv.messages[0],
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
    }));
  }

  async getConversation(userId: string, conversationId: string) {
    const conversation = await (this.prisma as any).conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
        messages: {
          select: {
            id: true,
            senderId: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            sender: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some((p: any) => p.userId === userId);
    if (!isParticipant) {
      throw new BadRequestException('User is not a participant in this conversation');
    }

    return conversation;
  }

  async createOrGetConversation(userId: string, otherUserId: string) {
    if (userId === otherUserId) {
      throw new BadRequestException('Cannot create conversation with yourself');
    }

    // Check if other user exists
    const otherUser = await this.prisma.user.findUnique({
      where: { id: otherUserId },
    });

    if (!otherUser) {
      throw new NotFoundException('User not found');
    }

    // Check if conversation already exists
    const existingConversation = await (this.prisma as any).conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId } } },
          { participants: { some: { userId: otherUserId } } },
        ],
      },
      include: {
        participants: true,
        messages: true,
      },
    });

    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    const conversation = await (this.prisma as any).conversation.create({
      data: {
        participants: {
          createMany: {
            data: [
              { userId },
              { userId: otherUserId },
            ],
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return conversation;
  }

  async sendMessage(userId: string, conversationId: string, content: string) {
    // Verify user is participant
    const participant = await (this.prisma as any).conversationParticipant.findFirst({
      where: {
        conversationId,
        userId,
      },
    });

    if (!participant) {
      throw new BadRequestException('User is not a participant in this conversation');
    }

    const message = await (this.prisma as any).message.create({
      data: {
        conversationId,
        senderId: userId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    // Update conversation updatedAt
    await (this.prisma as any).conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }
}
