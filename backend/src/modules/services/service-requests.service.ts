import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ServiceRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ServiceRequestCreateInput) {
    return this.prisma.serviceRequest.create({
      data,
      include: {
        customer: {
          include: {
            profile: true,
          },
        },
        service: true,
        bookings: true,
      },
    });
  }

  async findAll(filters?: {
    customerId?: string;
    status?: string;
    categoryId?: string;
    limit?: number;
    offset?: number;
  }) {
    const {
      customerId,
      status,
      categoryId,
      limit = 20,
      offset = 0,
    } = filters || {};

    const where: Prisma.ServiceRequestWhereInput = {};

    if (customerId) {
      where.customerId = customerId;
    }

    if (status) {
      where.status = status;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [data, total] = await Promise.all([
      this.prisma.serviceRequest.findMany({
        where,
        include: {
          customer: {
            include: {
              profile: true,
            },
          },
          service: true,
          bookings: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      this.prisma.serviceRequest.count({ where }),
    ]);

    return {
      data,
      total,
      limit,
      offset,
    };
  }

  async findById(id: string) {
    return this.prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            profile: true,
          },
        },
        service: true,
        bookings: {
          include: {
            provider: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.ServiceRequestUpdateInput) {
    return this.prisma.serviceRequest.update({
      where: { id },
      data,
      include: {
        customer: {
          include: {
            profile: true,
          },
        },
        service: true,
        bookings: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.serviceRequest.delete({
      where: { id },
    });
  }

  async applyToRequest(requestId: string, providerId: string, proposalData?: any) {
    // Create or update a booking for this application
    return this.prisma.booking.create({
      data: {
        serviceRequest: {
          connect: { id: requestId },
        },
        provider: {
          connect: { id: providerId },
        },
        customer: {
          connect: { id: (await this.prisma.serviceRequest.findUnique({ where: { id: requestId } }))?.customerId || '' },
        },
        service: {
          connect: { id: (await this.prisma.serviceRequest.findUnique({ where: { id: requestId } }))?.serviceId || '' },
        },
        title: `Application to request`,
        status: 'PENDING',
        price: proposalData?.price || 0,
      },
      include: {
        provider: {
          include: {
            profile: true,
          },
        },
        serviceRequest: {
          include: {
            customer: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });
  }

  async generateBrief(title: string, description?: string) {
    // Placeholder for brief generation (likely will use AI module)
    return {
      title,
      description,
      generatedAt: new Date(),
    };
  }

  async refineBrief(briefData: any, refinements: any) {
    // Placeholder for brief refinement (likely will use AI module)
    return {
      ...briefData,
      refinements,
      refinedAt: new Date(),
    };
  }
}
